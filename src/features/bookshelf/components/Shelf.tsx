import { range } from "es-toolkit";
import { useEffect } from "react";
import { MeshStandardMaterial } from "three";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";
import {
  cloneTexture,
  getWoodTexture,
} from "#/features/bookshelf/helper/procedural-textures";
import {
  SHELF_BOARD,
  SHELF_DEPTH,
  type ShelfLayout,
} from "#/features/bookshelf/helper/shelf-layout";

const BACK_PANEL = 0.6;

interface BoardSpec {
  key: string;
  size: [number, number, number];
  position: [number, number, number];
  vertical: boolean;
}

const createBoardSpecs = (layout: ShelfLayout): BoardSpec[] => {
  const shelves = range(layout.rows + 1).map(
    (index): BoardSpec => ({
      key: `shelf-${index}`,
      size: [layout.innerWidth, SHELF_BOARD, SHELF_DEPTH],
      position: [
        0,
        index * (layout.compartmentHeight + SHELF_BOARD) +
          SHELF_BOARD / 2 -
          layout.height / 2,
        0,
      ],
      vertical: false,
    }),
  );
  const sideX = layout.innerWidth / 2 + SHELF_BOARD / 2;
  const sides = [-1, 1].map(
    (direction): BoardSpec => ({
      key: `side-${direction}`,
      size: [SHELF_BOARD, layout.height, SHELF_DEPTH],
      position: [direction * sideX, 0, 0],
      vertical: true,
    }),
  );
  const back: BoardSpec = {
    key: "back",
    size: [layout.innerWidth, layout.height, BACK_PANEL],
    position: [0, 0, -SHELF_DEPTH / 2 + BACK_PANEL / 2],
    vertical: true,
  };

  return [...shelves, ...sides, back];
};

const createBoardMesh = (spec: BoardSpec) => {
  const [width, height, depth] = spec.size;
  const wood = getWoodTexture();
  const rotation = spec.vertical ? Math.PI / 2 : 0;
  return {
    geometry: new RoundedBoxGeometry(width, height, depth, 3, 0.35),
    material: new MeshStandardMaterial({
      map: cloneTexture(wood, 1, 1, rotation),
      bumpMap: cloneTexture(wood, 1, 1, rotation),
      bumpScale: 0.4,
      roughness: 0.62,
      color: spec.key === "back" ? "#d9cbb8" : "#ffffff",
    }),
  };
};

interface ShelfBoardProps {
  spec: BoardSpec;
}

function ShelfBoard({ spec }: ShelfBoardProps) {
  const { geometry, material } = createBoardMesh(spec);

  useEffect(
    () => () => {
      geometry.dispose();
      material.map?.dispose();
      material.bumpMap?.dispose();
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

interface ShelfProps {
  layout: ShelfLayout;
}

/** 레이아웃의 단 수와 폭에 맞춰 조립되는 원목 책장. */
export function Shelf({ layout }: ShelfProps) {
  const specs = createBoardSpecs(layout);

  return (
    <group>
      {specs.map((spec) => (
        <ShelfBoard key={spec.key} spec={spec} />
      ))}
    </group>
  );
}
