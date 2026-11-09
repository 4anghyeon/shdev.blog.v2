export type BubbleRect = {
  x: number;
  y: number;
  width: number;
  height: number;
};

const RUBBER_BAND_RATIO = 0.25;

export const measureItem = (el: HTMLElement): BubbleRect => ({
  x: el.offsetLeft,
  y: el.offsetTop,
  width: el.offsetWidth,
  height: el.offsetHeight,
});

const centerOf = (rect: BubbleRect) => rect.x + rect.width / 2;

const placeAt = (slot: BubbleRect, center: number, width: number) => ({
  x: center - width / 2,
  y: slot.y,
  width,
  height: slot.height,
});

/** 메뉴 기준 x 좌표에 놓일 버블 영역. 항목 사이에서는 너비를 보간하고, 양 끝 밖은 고무줄처럼 덜 따라간다. */
export const resolveBubbleRect = (
  slots: BubbleRect[],
  center: number,
): BubbleRect | null => {
  const first = slots[0];
  const last = slots[slots.length - 1];
  if (!first || !last) return null;

  const firstCenter = centerOf(first);
  const lastCenter = centerOf(last);
  if (center <= firstCenter) {
    const pulled = firstCenter + (center - firstCenter) * RUBBER_BAND_RATIO;
    return placeAt(first, pulled, first.width);
  }
  if (center >= lastCenter) {
    const pulled = lastCenter + (center - lastCenter) * RUBBER_BAND_RATIO;
    return placeAt(last, pulled, last.width);
  }

  for (let i = 0; i < slots.length - 1; i++) {
    const from = slots[i];
    const to = slots[i + 1];
    if (!from || !to || center > centerOf(to)) continue;
    const t = (center - centerOf(from)) / (centerOf(to) - centerOf(from));
    return placeAt(from, center, from.width + (to.width - from.width) * t);
  }
  return null;
};

/** x 좌표에서 중심이 가장 가까운 항목의 인덱스 */
export const findNearestIndex = (slots: BubbleRect[], center: number) => {
  let nearest = 0;
  slots.forEach((slot, index) => {
    const best = slots[nearest];
    if (!best) return;
    if (Math.abs(centerOf(slot) - center) < Math.abs(centerOf(best) - center)) {
      nearest = index;
    }
  });
  return nearest;
};
