import { DEFAULT_LANG } from "#/shared/constant/lang";
export const MENU_ITEMS = [
  { to: "/", subPath: `/${DEFAULT_LANG}/post`, label: "Posts" },
  { to: "/series", label: "Series" },
  { to: "/about", label: "About" },
] as const;
