import { range } from "es-toolkit";
import { useEffect } from "react";
import { BoxGeometry, MeshStandardMaterial } from "three";
import {
  SHELF_BOARD,
  SHELF_DEPTH,
  type ShelfLayout,
} from "#/features/bookshelf/helper/shelf-layout";

const BACK_PANEL = 0.6;

interface PanelSpec {
  key: string;
  size: [number, number, number];
  position: [number, number, number];
}

const createPanelSpecs = (layout: ShelfLayout): PanelSpec[] => {
  const shelves = range(layout.rows + 1).map(
    (index): PanelSpec => ({
      key: `shelf-${index}`,
      size: [layout.innerWidth, SHELF_BOARD, SHELF_DEPTH],
      position: [
        0,
        index * (layout.compartmentHeight + SHELF_BOARD) +
          SHELF_BOARD / 2 -
          layout.height / 2,
        0,
      ],
    }),
  );
  const sideX = layout.innerWidth / 2 + SHELF_BOARD / 2;
  const sides = [-1, 1].map(
    (direction): PanelSpec => ({
      key: `side-${direction}`,
      size: [SHELF_BOARD, layout.height, SHELF_DEPTH],
      position: [direction * sideX, 0, 0],
    }),
  );
  const back: PanelSpec = {
    key: "back",
    size: [layout.innerWidth, layout.height, BACK_PANEL],
    position: [0, 0, -SHELF_DEPTH / 2 + BACK_PANEL / 2],
  };

  return [...shelves, ...sides, back];
};

interface ShelfPanelProps {
  spec: PanelSpec;
  color: string;
}

function ShelfPanel({ spec, color }: ShelfPanelProps) {
  const geometry = new BoxGeometry(...spec.size);
  const material = new MeshStandardMaterial({ color, roughness: 0.9 });

  useEffect(
    () => () => {
      geometry.dispose();
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
  color: string;
}

/**
 * 레이아웃의 단 수와 폭에 맞춰지는 무광 도장 책장.
 * 각진 판을 같은 재질로 빈틈없이 맞대어 이음매 없는 한 덩어리로 보이게 한다.
 */
export function Shelf({ layout, color }: ShelfProps) {
  const specs = createPanelSpecs(layout);

  return (
    <group>
      {specs.map((spec) => (
        <ShelfPanel key={spec.key} spec={spec} color={color} />
      ))}
    </group>
  );
}
