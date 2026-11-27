import { useCursor } from "@react-three/drei";
import { type ThreeEvent, useFrame } from "@react-three/fiber";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  DoubleSide,
  type InstancedMesh,
  Matrix4,
  MeshStandardMaterial,
  TubeGeometry,
} from "three";
import {
  createLeafGeometry,
  getLeafTextures,
} from "#/features/bookshelf/helper/leaf";
import {
  composeLeafMatrix,
  createFallingLeaf,
  type FallingLeaf,
  stepFallingLeaf,
} from "#/features/bookshelf/helper/leaf-fall";
import type { ShelfLayout } from "#/features/bookshelf/helper/shelf-layout";
import {
  createVineSpecs,
  type VineSpec,
} from "#/features/bookshelf/helper/vine";

const STEM_RADIUS = 0.16;
const STEM_COLOR = "#5b7a34";
/** 탭이 가려졌다 돌아온 첫 프레임처럼 시간이 크게 튀어도 잎이 순간이동하지 않게 한다 */
const MAX_FRAME_DELTA = 0.05;

/** 줄기는 장식이라 클릭을 받지 않게 광선 검사에서 뺀다 */
const ignoreRaycast = () => null;

const leafMatrix = new Matrix4();

interface StemProps {
  spec: VineSpec;
}

function Stem({ spec }: StemProps) {
  const geometry = new TubeGeometry(
    spec.curve,
    spec.curve.points.length * 8,
    STEM_RADIUS,
    5,
  );
  const material = new MeshStandardMaterial({
    color: STEM_COLOR,
    roughness: 0.6,
  });

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
      raycast={ignoreRaycast}
      castShadow
    />
  );
}

interface LeavesProps {
  spec: VineSpec;
  floorY: number;
}

/**
 * 한 줄기에 달린 잎을 인스턴스로 한 번에 그린다.
 * 잎을 누르면 줄기에서 떨어져 팔랑이며 바닥에 내려앉는다.
 */
function Leaves({ spec, floorY }: LeavesProps) {
  const [isHovered, setIsHovered] = useState(false);

  const meshRef = useRef<InstancedMesh>(null);
  const fallingRef = useRef(new Map<number, FallingLeaf>());

  const geometry = createLeafGeometry();
  const { map, bumpMap } = getLeafTextures();
  const material = new MeshStandardMaterial({
    map,
    bumpMap,
    bumpScale: 0.6,
    roughness: 0.42,
    side: DoubleSide,
  });

  const getAttachedLeaf = (event: ThreeEvent<PointerEvent | MouseEvent>) => {
    const { instanceId } = event;
    if (instanceId === undefined || fallingRef.current.has(instanceId)) {
      return undefined;
    }
    return instanceId;
  };

  const handlePointerMove = (event: ThreeEvent<PointerEvent>) => {
    const instanceId = getAttachedLeaf(event);
    setIsHovered(instanceId !== undefined);
    // 잎 뒤에 가려진 책이 함께 들썩이지 않게 한다
    if (instanceId !== undefined) event.stopPropagation();
  };

  const handleClick = (event: ThreeEvent<MouseEvent>) => {
    const instanceId = getAttachedLeaf(event);
    if (instanceId === undefined) return;
    event.stopPropagation();
    fallingRef.current.set(
      instanceId,
      createFallingLeaf(spec.leaves[instanceId].matrix),
    );
    setIsHovered(false);
  };

  useCursor(isHovered);

  useLayoutEffect(() => {
    const mesh = meshRef.current;
    if (!mesh) return;
    fallingRef.current.clear();
    spec.leaves.forEach((leaf, index) => {
      mesh.setMatrixAt(index, leaf.matrix);
      mesh.setColorAt(index, leaf.color);
    });
    mesh.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
    mesh.computeBoundingSphere();
  }, [spec]);

  useEffect(
    () => () => {
      geometry.dispose();
      material.dispose();
    },
    [geometry, material],
  );

  useFrame((_, delta) => {
    const mesh = meshRef.current;
    if (!mesh) return;
    const step = Math.min(delta, MAX_FRAME_DELTA);
    let hasMoved = false;
    for (const [index, leaf] of fallingRef.current) {
      if (leaf.phase === "settled") continue;
      stepFallingLeaf(leaf, step, floorY);
      mesh.setMatrixAt(index, composeLeafMatrix(leaf, leafMatrix));
      hasMoved = true;
    }
    if (hasMoved) mesh.instanceMatrix.needsUpdate = true;
  });

  return (
    // biome-ignore lint/a11y/noStaticElementInteractions: three.js 오브젝트라 DOM 접근성 규칙이 적용되지 않는다
    <instancedMesh
      ref={meshRef}
      args={[geometry, material, spec.leaves.length]}
      // 떨어지는 잎은 처음 잡은 경계 구 밖으로 나가서, 화면 밖으로 판정돼 사라지지 않게 한다
      frustumCulled={false}
      onClick={handleClick}
      onPointerMove={handlePointerMove}
      onPointerOut={() => setIsHovered(false)}
      castShadow
      receiveShadow
    />
  );
}

interface VinesProps {
  layout: ShelfLayout;
}

/**
 * 책장 머리판에서 양쪽 측판을 타고 늘어진 포토스 덩굴.
 * 책장 크기가 바뀌면 줄기 길이와 잎 수도 함께 바뀌고, 떨어진 잎도 제자리로 돌아온다.
 */
export function Vines({ layout }: VinesProps) {
  const specs = createVineSpecs(layout);
  const floorY = -layout.height / 2;

  return (
    <group>
      {specs.map((spec) => (
        <group key={spec.key}>
          <Stem spec={spec} />
          <Leaves spec={spec} floorY={floorY} />
        </group>
      ))}
    </group>
  );
}
