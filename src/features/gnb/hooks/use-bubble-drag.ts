import type { DragEvent, MouseEvent, PointerEvent, RefObject } from "react";
import { useRef } from "react";
import {
  type BubbleRect,
  findNearestIndex,
  measureItem,
  resolveBubbleRect,
} from "#/features/gnb/helper/bubble-geometry";

type DragState = {
  pointerId: number;
  startX: number;
  isDragging: boolean;
  slots: BubbleRect[];
  center: number;
};

interface UseBubbleDragOptions {
  itemRefs: RefObject<(HTMLLIElement | null)[]>;
  onDrag: (rect: BubbleRect) => void;
  onRelease: (index: number) => void;
}

const DRAG_THRESHOLD_PX = 6;

const toListX = (event: PointerEvent<HTMLUListElement>) =>
  event.clientX - event.currentTarget.getBoundingClientRect().left;

/** 메뉴를 누른 채 좌우로 끌면 버블이 포인터를 따라오고, 놓으면 가장 가까운 항목을 고른다. */
export const useBubbleDrag = ({
  itemRefs,
  onDrag,
  onRelease,
}: UseBubbleDragOptions) => {
  const dragRef = useRef<DragState | null>(null);
  const shouldSuppressClickRef = useRef(false);

  const onPointerDown = (event: PointerEvent<HTMLUListElement>) => {
    if (event.button !== 0) return;
    shouldSuppressClickRef.current = false;
    dragRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      isDragging: false,
      slots: [],
      center: toListX(event),
    };
  };

  const onPointerMove = (event: PointerEvent<HTMLUListElement>) => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;

    if (!drag.isDragging) {
      if (Math.abs(event.clientX - drag.startX) < DRAG_THRESHOLD_PX) return;
      drag.isDragging = true;
      drag.slots = itemRefs.current.flatMap((el) =>
        el ? [measureItem(el)] : [],
      );
      event.currentTarget.setPointerCapture(event.pointerId);
    }

    drag.center = toListX(event);
    const rect = resolveBubbleRect(drag.slots, drag.center);
    if (rect) onDrag(rect);
  };

  // 끌기를 마친 포인터가 링크 위에서 떨어지면 클릭으로 이어지므로 한 번 막는다
  const onClickCapture = (event: MouseEvent<HTMLUListElement>) => {
    if (!shouldSuppressClickRef.current) return;
    shouldSuppressClickRef.current = false;
    event.preventDefault();
    event.stopPropagation();
  };

  const onDragStart = (event: DragEvent<HTMLUListElement>) =>
    event.preventDefault();

  const finishDrag = (event: PointerEvent<HTMLUListElement>) => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    dragRef.current = null;
    if (!drag.isDragging) return;

    shouldSuppressClickRef.current = true;
    onRelease(findNearestIndex(drag.slots, drag.center));
  };

  return {
    onPointerDown,
    onPointerMove,
    onPointerUp: finishDrag,
    onPointerCancel: finishDrag,
    onClickCapture,
    onDragStart,
  };
};
