import {
  ContactShadows,
  Environment,
  Lightformer,
  PerformanceMonitor,
} from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { easing } from "maath";
import {
  type RefObject,
  Suspense,
  use,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { MathUtils, NeutralToneMapping, Vector3 } from "three";
import { Book } from "#/features/bookshelf/components/Book";
import { Shelf } from "#/features/bookshelf/components/Shelf";
import { loadBookFonts } from "#/features/bookshelf/helper/book-artwork";
import {
  detectInitialQualityTier,
  MIN_ACCEPTABLE_FPS,
  QUALITY_SETTINGS,
  type QualitySettings,
} from "#/features/bookshelf/helper/quality";
import { getShelfArea } from "#/features/bookshelf/helper/screen-area";
import {
  computeShelfLayout,
  FIT_MARGIN,
  SHELF_DEPTH,
  type ShelfLayout,
} from "#/features/bookshelf/helper/shelf-layout";
import type { BookItem } from "#/shared/constant/book-items";

const CAMERA_FOV = 32;
const CAMERA_TILT = 1.5;
const SCROLL_DAMPING = 0.15;

const lookTarget = new Vector3();

interface ViewportSize {
  width: number;
  height: number;
}

interface CameraPose {
  z: number;
  /** 스크롤 맨 위와 맨 아래에서의 시선 높이 */
  startY: number;
  endY: number;
  /** 맨 위 선반에서 맨 아래 선반까지 스크롤해야 하는 거리(px) */
  scrollPixels: number;
}

const computeCameraPose = (
  layout: ShelfLayout,
  size: ViewportSize,
): CameraPose => {
  const tan = Math.tan(MathUtils.degToRad(CAMERA_FOV) / 2);
  const aspect = size.width / size.height;
  const area = getShelfArea(size);
  const widthFitDistance = layout.width / 2 / (tan * aspect);
  const heightFitDistance =
    layout.height / 2 / (tan * (area.height / size.height));
  const distance =
    (layout.isScrollable
      ? widthFitDistance
      : Math.max(widthFitDistance, heightFitDistance)) * FIT_MARGIN;
  const viewHeight = 2 * tan * (distance + SHELF_DEPTH / 2);
  const shelfPixels = (layout.height / (2 * tan * distance)) * size.height;
  // 세로로 공간이 남으면 위쪽에 붙이고, 스크롤해야 하면 맨 위 선반부터 보이게 한다
  const startAnchor = area.top + shelfPixels / 2;
  const scrollPixels = Math.max(0, shelfPixels - area.height);
  // 책장을 화면 중앙보다 아래에 그리려면 시선을 그만큼 위로 올린다
  const toWorldY = (anchor: number) =>
    (anchor / size.height - 0.5) * viewHeight;

  return {
    z: SHELF_DEPTH / 2 + distance,
    startY: toWorldY(startAnchor),
    endY: toWorldY(startAnchor - scrollPixels),
    scrollPixels,
  };
};

interface ScrollRefs {
  scrollRef: RefObject<HTMLDivElement | null>;
  spacerRef: RefObject<HTMLDivElement | null>;
}

const getScrollProgress = (element: HTMLDivElement | null) => {
  if (!element) return 0;
  const range = element.scrollHeight - element.clientHeight;
  return range > 0 ? element.scrollTop / range : 0;
};

interface CameraRigProps extends Pick<ScrollRefs, "scrollRef"> {
  pose: CameraPose;
}

/**
 * 스크롤 위치에 맞춰 시선 높이를 옮긴다.
 */
function CameraRig({ pose, scrollRef }: CameraRigProps) {
  const scrollProgress = useRef(0);

  useFrame(({ camera }, delta) => {
    easing.damp(
      scrollProgress,
      "current",
      getScrollProgress(scrollRef.current),
      SCROLL_DAMPING,
      delta,
    );
    const y = MathUtils.lerp(pose.startY, pose.endY, scrollProgress.current);
    camera.position.set(0, y + CAMERA_TILT, pose.z);
    camera.lookAt(lookTarget.set(0, y, 0));
  });

  return null;
}

interface QualityProps {
  quality: QualitySettings;
}

function StudioLights({ quality }: QualityProps) {
  return (
    <>
      <ambientLight intensity={0.35} />
      {/* 그림자 맵은 크기가 바뀌어도 다시 만들어지지 않아서 key로 조명을 새로 만든다 */}
      <directionalLight
        key={quality.shadowMapSize}
        castShadow
        position={[35, 60, 90]}
        intensity={2.4}
        shadow-mapSize={[quality.shadowMapSize, quality.shadowMapSize]}
        shadow-bias={-0.0002}
        shadow-normalBias={0.05}
      >
        <orthographicCamera
          attach="shadow-camera"
          args={[-90, 90, 90, -90, 1, 300]}
        />
      </directionalLight>
      <Environment
        key={quality.environmentResolution}
        resolution={quality.environmentResolution}
        frames={1}
      >
        <Lightformer
          form="rect"
          intensity={3}
          position={[0, 40, 60]}
          scale={[80, 30, 1]}
        />
        <Lightformer
          form="rect"
          intensity={1.5}
          position={[-70, 10, 30]}
          rotation-y={Math.PI / 2}
          scale={[60, 40, 1]}
          color="#ffe9cc"
        />
        <Lightformer
          form="rect"
          intensity={1}
          position={[70, 0, 30]}
          rotation-y={-Math.PI / 2}
          scale={[60, 40, 1]}
        />
      </Environment>
    </>
  );
}

interface BookshelfProps {
  books: readonly BookItem[];
  selectedId: string | undefined;
  onSelect: (id: string) => void;
}

interface ShelfContentsProps extends BookshelfProps, QualityProps, ScrollRefs {}

function ShelfContents({
  books,
  selectedId,
  onSelect,
  quality,
  scrollRef,
  spacerRef,
}: ShelfContentsProps) {
  use(loadBookFonts());
  const size = useThree((state) => state.size);
  const layout = computeShelfLayout(books, getShelfArea(size));
  const pose = computeCameraPose(layout, size);

  // 스크롤 길이는 캔버스 크기를 알아야 정해져서, 캔버스 밖의 여백 요소 높이를 직접 맞춘다
  useLayoutEffect(() => {
    if (spacerRef.current) {
      spacerRef.current.style.height = `${pose.scrollPixels}px`;
    }
  }, [spacerRef, pose.scrollPixels]);

  return (
    <>
      <CameraRig pose={pose} scrollRef={scrollRef} />
      <Shelf layout={layout} />
      {layout.placements.map((placement) => (
        <Book
          key={placement.book.id}
          book={placement.book}
          dimensions={placement.dimensions}
          home={placement.position}
          isSelected={placement.book.id === selectedId}
          onSelect={onSelect}
        />
      ))}
      <ContactShadows
        position={[0, -layout.height / 2 - 0.05, 0]}
        scale={[layout.width * 1.6, SHELF_DEPTH * 2.5]}
        opacity={0.35}
        blur={2.5}
        far={20}
        frames={quality.contactShadowFrames}
      />
    </>
  );
}

interface BookshelfSceneProps extends BookshelfProps {
  onDeselect: () => void;
}

/**
 * 읽은 책을 꽂아 둔 3D 책장 캔버스.
 * 책장이 화면보다 길면 캔버스를 고정한 채 바깥 영역을 스크롤해서 카메라를 내린다.
 * 저사양 기기로 보이거나 실제 프레임레이트가 떨어지면 낮은 품질 단계로 내려간다.
 */
export function BookshelfScene({
  books,
  selectedId,
  onSelect,
  onDeselect,
}: BookshelfSceneProps) {
  const [qualityTier, setQualityTier] = useState(detectInitialQualityTier);
  const quality = QUALITY_SETTINGS[qualityTier];
  const scrollRef = useRef<HTMLDivElement>(null);
  const spacerRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={scrollRef}
      className="absolute inset-0 overflow-y-auto [scrollbar-width:thin]"
    >
      <div className="sticky top-0 h-full">
        <Canvas
          shadows
          dpr={quality.dpr}
          camera={{
            fov: CAMERA_FOV,
            near: 1,
            far: 2000,
            position: [0, 0, 200],
          }}
          gl={{ antialias: true, toneMapping: NeutralToneMapping }}
          onPointerMissed={onDeselect}
        >
          <StudioLights quality={quality} />
          <Suspense fallback={null}>
            <ShelfContents
              books={books}
              selectedId={selectedId}
              onSelect={onSelect}
              quality={quality}
              scrollRef={scrollRef}
              spacerRef={spacerRef}
            />
            <PerformanceMonitor
              bounds={() => [MIN_ACCEPTABLE_FPS, Number.POSITIVE_INFINITY]}
              onDecline={() => setQualityTier("low")}
            />
          </Suspense>
        </Canvas>
      </div>
      <div ref={spacerRef} />
    </div>
  );
}
