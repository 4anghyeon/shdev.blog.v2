import { ContactShadows, Environment, Lightformer } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { easing } from "maath";
import { Suspense, use } from "react";
import { AgXToneMapping, MathUtils, Vector3 } from "three";
import { Book } from "#/features/bookshelf/components/Book";
import { Shelf } from "#/features/bookshelf/components/Shelf";
import { loadBookFonts } from "#/features/bookshelf/helper/book-artwork";
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

function StudioLights() {
  return (
    <>
      <ambientLight intensity={0.35} />
      <directionalLight
        castShadow
        position={[35, 60, 90]}
        intensity={2.4}
        shadow-mapSize={[2048, 2048]}
        shadow-bias={-0.0002}
        shadow-normalBias={0.05}
      >
        <orthographicCamera
          attach="shadow-camera"
          args={[-90, 90, 90, -90, 1, 300]}
        />
      </directionalLight>
      <Environment resolution={256} frames={1}>
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

interface ShelfContentsProps {
  books: readonly BookItem[];
  selectedId: string | undefined;
  onSelect: (id: string) => void;
}

function ShelfContents({ books, selectedId, onSelect }: ShelfContentsProps) {
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
      />
    </>
  );
}

interface BookshelfSceneProps extends ShelfContentsProps {
  onDeselect: () => void;
}

/** 읽은 책을 꽂아 둔 3D 책장 캔버스. */
export function BookshelfScene({
  books,
  selectedId,
  onSelect,
  onDeselect,
}: BookshelfSceneProps) {
  return (
    <Canvas
      shadows
      dpr={[1, 2]}
      camera={{ fov: CAMERA_FOV, near: 1, far: 2000, position: [0, 0, 200] }}
      gl={{ antialias: true, toneMapping: AgXToneMapping }}
      onPointerMissed={onDeselect}
    >
      <StudioLights />
      <Suspense fallback={null}>
        <ShelfContents
          books={books}
          selectedId={selectedId}
          onSelect={onSelect}
        />
      </Suspense>
    </Canvas>
  );
}
