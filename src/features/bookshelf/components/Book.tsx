import { useCursor } from "@react-three/drei";
import { type ThreeEvent, useFrame, useThree } from "@react-three/fiber";
import { easing } from "maath";
import { useRef, useState } from "react";
import { type Group, Quaternion, Vector3 } from "three";
import { BookModel } from "#/features/bookshelf/components/BookModel";
import type { BookDimensions } from "#/features/bookshelf/helper/book-dimensions";
import { getFocusPose } from "#/features/bookshelf/helper/focus-pose";
import type { BookItem } from "#/shared/constant/book-items";

const HOVER_OFFSET = 1.4;
const PULL_LIFT = 0.4;
const PULL_CLEARANCE = 3;
const SMOOTH_TIME = 0.22;

const ALIGN_DISTANCE = 0.6;
const ALIGN_ANGLE = 0.02;
const ALIGN_SCALE = 0.02;

const RESTING = new Quaternion();

type BookPhase = "shelved" | "pulling" | "focused";

const targetPosition = new Vector3();
const targetScale = new Vector3();
const targetQuaternion = new Quaternion();

const createSlotPositions = (
  home: [number, number, number],
  dimensions: BookDimensions,
) => {
  // 책 전체가 선반 앞으로 빠져나온 뒤에 돌아야 회전하면서 옆판을 뚫지 않는다
  const depth = dimensions.depth + PULL_CLEARANCE;
  return {
    homePosition: new Vector3(...home),
    pulledPosition: new Vector3(home[0], home[1] + PULL_LIFT, home[2] + depth),
    pullDepth: depth,
  };
};

interface BookProps {
  book: BookItem;
  dimensions: BookDimensions;
  home: [number, number, number];
  isSelected: boolean;
  onSelect: (id: string) => void;
}

/** 선반에 꽂힌 책. 선택되면 앞으로 뽑혀 나온 뒤 표지가 보이도록 카메라 앞으로 날아온다. */
export function Book({
  book,
  dimensions,
  home,
  isSelected,
  onSelect,
}: BookProps) {
  const ref = useRef<Group>(null);
  const phase = useRef<BookPhase>("shelved");
  const focusTime = useRef(0);
  const [isHovered, setIsHovered] = useState(false);
  const size = useThree((state) => state.size);

  const { homePosition, pulledPosition, pullDepth } = createSlotPositions(
    home,
    dimensions,
  );

  useCursor(isHovered && !isSelected);

  useFrame(({ camera }, delta) => {
    const group = ref.current;
    if (!group) return;

    if (!isSelected) {
      phase.current = "shelved";
    } else if (phase.current === "shelved") {
      phase.current = "pulling";
    } else if (
      phase.current === "pulling" &&
      group.position.z - homePosition.z > pullDepth * 0.9
    ) {
      phase.current = "focused";
      focusTime.current = 0;
    }

    if (phase.current === "focused") {
      focusTime.current += delta;
      const scale = getFocusPose(
        camera,
        size,
        dimensions,
        focusTime.current,
        targetPosition,
        targetQuaternion,
      );
      targetScale.setScalar(scale);
    } else if (phase.current === "pulling") {
      targetScale.setScalar(1);
      targetPosition.copy(pulledPosition);
      targetQuaternion.copy(RESTING);
    } else {
      const isOutOfSlot =
        group.position.z - homePosition.z > HOVER_OFFSET + 0.2;
      const isAlignedWithSlot =
        Math.hypot(
          group.position.x - pulledPosition.x,
          group.position.y - pulledPosition.y,
        ) < ALIGN_DISTANCE &&
        group.quaternion.angleTo(RESTING) < ALIGN_ANGLE &&
        Math.abs(group.scale.x - 1) < ALIGN_SCALE;
      // 칸 앞에서 위치와 자세를 모두 바로잡은 뒤에 밀어 넣어야 옆 책이나 선반을 뚫지 않는다
      if (isOutOfSlot && !isAlignedWithSlot) {
        targetPosition.copy(pulledPosition);
      } else {
        targetPosition.copy(homePosition);
        if (isHovered) targetPosition.z += HOVER_OFFSET;
      }
      targetQuaternion.copy(RESTING);
      targetScale.setScalar(1);
    }

    easing.damp3(group.scale, targetScale, SMOOTH_TIME, delta);
    easing.damp3(group.position, targetPosition, SMOOTH_TIME, delta);
    easing.dampQ(group.quaternion, targetQuaternion, SMOOTH_TIME, delta);
  });

  const handleClick = (event: ThreeEvent<MouseEvent>) => {
    event.stopPropagation();
    if (!isSelected) onSelect(book.id);
  };

  const handlePointerOver = (event: ThreeEvent<PointerEvent>) => {
    event.stopPropagation();
    setIsHovered(true);
  };

  return (
    // biome-ignore lint/a11y/noStaticElementInteractions: three.js 오브젝트라 DOM 접근성 규칙이 적용되지 않는다
    <group
      ref={ref}
      position={home}
      onClick={handleClick}
      onPointerOver={handlePointerOver}
      onPointerOut={() => setIsHovered(false)}
    >
      <BookModel book={book} dimensions={dimensions} />
    </group>
  );
}
