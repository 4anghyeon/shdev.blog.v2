/** 페이지 제목, 하단 내비게이션, 상세 패널이 캔버스 위에서 차지하는 영역(px). books 라우트와 BookDetailPanel의 배치와 맞춰야 한다. */
export const DESKTOP_BREAKPOINT = 768;
const TITLE_RESERVE = 88;
const MOBILE_NAV_RESERVE = 96;
const DESKTOP_PANEL_RESERVE = 380;
const MOBILE_PANEL_RATIO = 0.5;

interface ViewportSize {
  width: number;
  height: number;
}

export interface ScreenArea {
  top: number;
  width: number;
  height: number;
  centerX: number;
  centerY: number;
}

const toArea = (right: number, top: number, bottom: number): ScreenArea => ({
  top,
  width: right,
  height: bottom - top,
  centerX: right / 2,
  centerY: (top + bottom) / 2,
});

/** 제목과 하단 내비게이션을 피해 책장을 그릴 수 있는 영역. */
export const getShelfArea = (size: ViewportSize) => {
  const isDesktop = size.width >= DESKTOP_BREAKPOINT;
  const bottom = isDesktop ? size.height : size.height - MOBILE_NAV_RESERVE;
  return toArea(size.width, TITLE_RESERVE, bottom);
};

/** 상세 패널까지 피해 꺼낸 책을 띄울 수 있는 영역. */
export const getFocusArea = (size: ViewportSize) => {
  const isDesktop = size.width >= DESKTOP_BREAKPOINT;
  const right = isDesktop ? size.width - DESKTOP_PANEL_RESERVE : size.width;
  const bottom = isDesktop
    ? size.height
    : size.height * (1 - MOBILE_PANEL_RATIO);
  return toArea(right, TITLE_RESERVE, bottom);
};
