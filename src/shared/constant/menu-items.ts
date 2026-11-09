import { DEFAULT_LANG } from "#/shared/constant/lang";
export const MENU_ITEMS = [
  { to: "/", subPath: `/${DEFAULT_LANG}/post`, label: "블로그" },
  { to: "/series", label: "시리즈" },
  { to: "/books", label: "책장" },
  { to: "/about", label: "소개" },
] as const;
