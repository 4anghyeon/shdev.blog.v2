import { range } from "es-toolkit";
import { useEffect } from "react";
import { BoxGeometry, MeshStandardMaterial } from "three";
import {
  cloneTexture,
  getWoodTexture,
  WOOD_TILE_SIZE,
} from "#/features/bookshelf/helper/procedural-textures";
import {
  FRAME_BASE,
  FRAME_SIDE,
  FRAME_TOP,
  getShelfFloorY,
  SHELF_BOARD,
  SHELF_DEPTH,
  type ShelfLayout,
} from "#/features/bookshelf/helper/shelf-layout";

const BACK_PANEL = 0.6;
/** 도장 틀이 원목 선반보다 앞으로 튀어나온 거리. 선반이 틀 안쪽으로 들어가 보이게 한다 */
const FACE_LIP = 1.4;
const GRAIN_VERTICAL = Math.PI / 2;

type PanelFinish = { kind: "paint" } | { kind: "wood"; grainRotation: number };

interface PanelSpec {
  key: string;
  size: [number, number, number];
  position: [number, number, number];
  finish: PanelFinish;
}

const PAINT: PanelFinish = { kind: "paint" };
const WOOD: PanelFinish = { kind: "wood", grainRotation: 0 };

/**
 * 흰 도장 틀(측판, 머리판, 걸레받이) 안에 원목 선반판과 뒤판을 끼운 붙박이 책장의 판 목록.
 */
const createPanelSpecs = (layout: ShelfLayout): PanelSpec[] => {
  const frameDepth = SHELF_DEPTH + FACE_LIP;
  const frameZ = FACE_LIP / 2;

  const boards = range(layout.rows).map(
    (index): PanelSpec => ({
      key: `board-${index}`,
      size: [layout.innerWidth, SHELF_BOARD, SHELF_DEPTH],
      position: [0, getShelfFloorY(layout, index) - SHELF_BOARD / 2, 0],
      finish: WOOD,
    }),
  );
  const sideX = layout.innerWidth / 2 + FRAME_SIDE / 2;
  const sides = [-1, 1].map(
    (direction): PanelSpec => ({
      key: `side-${direction}`,
      size: [FRAME_SIDE, layout.height, frameDepth],
      position: [direction * sideX, 0, frameZ],
      finish: PAINT,
    }),
  );
  const header: PanelSpec = {
    key: "header",
    size: [layout.innerWidth, FRAME_TOP, frameDepth],
    position: [0, layout.height / 2 - FRAME_TOP / 2, frameZ],
    finish: PAINT,
  };
  const plinth: PanelSpec = {
    key: "plinth",
    size: [layout.innerWidth, FRAME_BASE, frameDepth],
    position: [0, -layout.height / 2 + FRAME_BASE / 2, frameZ],
    finish: PAINT,
  };
  const back: PanelSpec = {
    key: "back",
    size: [
      layout.innerWidth,
      layout.height - FRAME_TOP - FRAME_BASE,
      BACK_PANEL,
    ],
    position: [
      0,
      (FRAME_BASE - FRAME_TOP) / 2,
      -SHELF_DEPTH / 2 + BACK_PANEL / 2,
    ],
    finish: { kind: "wood", grainRotation: GRAIN_VERTICAL },
  };

  return [...boards, ...sides, header, plinth, back];
};

interface ShelfColors {
  /** 도장 틀의 색 */
  paintColor: string;
  /** 나뭇결 텍스처에 곱하는 색. 밤에는 어둡게 눌러 준다 */
  woodColor: string;
}

/** 판 크기에 맞춰 나뭇결이 늘어나지 않도록 반복 횟수를 정한 원목 재질을 만든다. */
const createWoodMaterial = (
  [width, height]: PanelSpec["size"],
  grainRotation: number,
  color: string,
) => {
  const map = cloneTexture(
    getWoodTexture(),
    width / WOOD_TILE_SIZE,
    height / WOOD_TILE_SIZE,
    grainRotation,
  );
  return new MeshStandardMaterial({ map, color, roughness: 0.7 });
};

const createMaterial = (
  spec: PanelSpec,
  { paintColor, woodColor }: ShelfColors,
) => {
  if (spec.finish.kind === "paint") {
    return new MeshStandardMaterial({ color: paintColor, roughness: 0.85 });
  }
  return createWoodMaterial(spec.size, spec.finish.grainRotation, woodColor);
};

interface ShelfPanelProps extends ShelfColors {
  spec: PanelSpec;
}

function ShelfPanel({ spec, paintColor, woodColor }: ShelfPanelProps) {
  const geometry = new BoxGeometry(...spec.size);
  const material = createMaterial(spec, { paintColor, woodColor });

  useEffect(
    () => () => {
      geometry.dispose();
      material.map?.dispose();
      material.dispose();
    },
    [geometry, material],
  );

  return (
    <mesh
      geometry={geometry}
      material={material}
      position={spec.position}
      castShadow
      receiveShadow
    />
  );
}

interface ShelfProps extends ShelfColors {
  layout: ShelfLayout;
}

/**
 * 레이아웃의 단 수와 폭에 맞춰지는 붙박이 책장.
 * 흰 도장 틀이 원목 선반과 뒤판을 감싸고, 틀이 살짝 앞으로 나와 선반이 안으로 들어가 보인다.
 */
export function Shelf({ layout, paintColor, woodColor }: ShelfProps) {
  const specs = createPanelSpecs(layout);

  return (
    <group>
      {specs.map((spec) => (
        <ShelfPanel
          key={spec.key}
          spec={spec}
          paintColor={paintColor}
          woodColor={woodColor}
        />
      ))}
    </group>
  );
}
