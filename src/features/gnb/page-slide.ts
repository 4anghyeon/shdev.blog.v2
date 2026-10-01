import { MENU_ITEMS } from "#/shared/constant/menu-items";

interface LocationChange {
  fromLocation?: { pathname: string };
  toLocation: { pathname: string };
}

const getMenuIndex = (pathname?: string) =>
  MENU_ITEMS.findIndex((item) => item.to === pathname);

/**
 * 큰 메뉴(GNB 항목) 사이를 오갈 때만 메뉴 순서에 따라 좌우 슬라이드 전환을 건다. (page-slide.css)
 * 그 외 이동(글 상세 등)은 view transition 없이 그대로 진행된다.
 */
const pageSlideViewTransition = {
  types: ({ fromLocation, toLocation }: LocationChange) => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return false as const;
    }
    const from = getMenuIndex(fromLocation?.pathname);
    const to = getMenuIndex(toLocation.pathname);
    if (from < 0 || to < 0 || from === to) return false as const;
    // 이전 화면을 캡처하기 직전이므로, 지금 있는 본문이 떠나는 본문이다. (page-slide.css)
    document.querySelector("main")?.setAttribute("data-slide-out", "");
    return [to > from ? "slide-left" : "slide-right"];
  },
};

/**
 * view transition type을 지원하지 않는 브라우저에서는 라우터가 모든 이동에
 * 기본 크로스페이드를 걸어 버리므로, 아예 끈다.
 */
export const getPageSlideViewTransition = () => {
  const isTypesSupported =
    typeof CSS !== "undefined" &&
    CSS.supports("selector(:active-view-transition-type(a))");
  return isTypesSupported ? pageSlideViewTransition : false;
};
