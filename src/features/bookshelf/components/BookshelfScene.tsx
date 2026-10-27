import {
  ContactShadows,
  Environment,
  Lightformer,
  PerformanceMonitor,
} from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { easing } from "maath";
import { Suspense, use, useState } from "react";
import { AgXToneMapping, MathUtils, Vector3 } from "three";
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
  SHELF_DEPTH,
  type ShelfLayout,
} from "#/features/bookshelf/helper/shelf-layout";
import type { BookItem } from "#/shared/constant/book-items";

const CAMERA_FOV = 32;
const FIT_MARGIN = 1.12;
const PARALLAX = 2.5;

const cameraTarget = new Vector3();

interface ViewportSize {
  width: number;
  height: number;
}

const computeCameraPose = (layout: ShelfLayout, size: ViewportSize) => {
  const tan = Math.tan(MathUtils.degToRad(CAMERA_FOV) / 2);
  const aspect = size.width / size.height;
  const area = getShelfArea(size);
  const distance =
    Math.max(
      layout.height / 2 / (tan * (area.height / size.height)),
      layout.width / 2 / (tan * aspect),
    ) * FIT_MARGIN;
  const viewHeight = 2 * tan * (distance + SHELF_DEPTH / 2);
  const shelfPixels = (layout.height / (2 * tan * distance)) * size.height;
  // 폭에 맞춰진 경우 세로로 남는 공간이 생기므로 영역 중앙 대신 위쪽에 붙인다
  const anchorY = Math.min(area.centerY, area.top + shelfPixels / 2);
  // 책장을 화면 중앙보다 아래에 그리려면 시선을 그만큼 위로 올린다
  const centerY = (anchorY / size.height - 0.5) * viewHeight;
  return {
    base: new Vector3(
      0,
      centerY + layout.height * 0.04,
      SHELF_DEPTH / 2 + distance,
    ),
    lookAt: new Vector3(0, centerY, 0),
  };
};

interface CameraRigProps {
  layout: ShelfLayout;
}

/**
 * 하단 내비게이션을 뺀 영역에 책장 전체가 들어오도록 거리와 높이를 맞추고,
 * 포인터를 따라 살짝 시점을 움직인다.
 */
function CameraRig({ layout }: CameraRigProps) {
  const size = useThree((state) => state.size);

  const { base, lookAt } = computeCameraPose(layout, size);

  useFrame(({ camera, pointer }, delta) => {
    cameraTarget.set(
      base.x + pointer.x * PARALLAX,
      base.y + pointer.y * PARALLAX,
      base.z,
    );
    easing.damp3(camera.position, cameraTarget, 0.4, delta);
    camera.lookAt(lookAt);
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

interface ShelfContentsProps extends BookshelfProps, QualityProps {}

function ShelfContents({
  books,
  selectedId,
  onSelect,
  quality,
}: ShelfContentsProps) {
  use(loadBookFonts());
  const size = useThree((state) => state.size);
  const area = getShelfArea(size);
  const aspect = area.width / area.height;
  const layout = computeShelfLayout(books, aspect);

  return (
    <>
      <CameraRig layout={layout} />
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

  return (
    <Canvas
      shadows
      dpr={quality.dpr}
      camera={{ fov: CAMERA_FOV, near: 1, far: 2000, position: [0, 0, 200] }}
      gl={{ antialias: true, toneMapping: AgXToneMapping }}
      onPointerMissed={onDeselect}
    >
      <StudioLights quality={quality} />
      <Suspense fallback={null}>
        <ShelfContents
          books={books}
          selectedId={selectedId}
          onSelect={onSelect}
          quality={quality}
        />
        {/*
          로딩 중 텍스처 생성으로 생기는 일시적인 끊김을 저사양으로 오인하지 않도록 장면이 준비된 뒤에 측정한다.
          다시 올리면 품질이 오르내리며 깜빡일 수 있어서 낮추기만 한다.
        */}
        <PerformanceMonitor
          bounds={() => [MIN_ACCEPTABLE_FPS, Number.POSITIVE_INFINITY]}
          onDecline={() => setQualityTier("low")}
        />
      </Suspense>
    </Canvas>
  );
}
