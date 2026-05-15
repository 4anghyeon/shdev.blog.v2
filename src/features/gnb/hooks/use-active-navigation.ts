import { useLocation } from "@tanstack/react-router";
import { MENU_ITEMS } from "#/shared/constant/menu-items";

export const useActiveNavigation = () => {
  const { pathname, search } = useLocation();

  const getActiveIndex = (pathname: string) => {
    if (search?.from === "series") {
      return MENU_ITEMS.findIndex((item) => item.to === "/series");
    }
    return MENU_ITEMS.findIndex((item) => {
      if ("subPath" in item && pathname.startsWith(item.subPath)) return true;
      return item.to === "/" ? pathname === "/" : pathname.startsWith(item.to);
    });
  };

  return {
    activeIndex: getActiveIndex(pathname),
    pathname,
    search,
  };
};
