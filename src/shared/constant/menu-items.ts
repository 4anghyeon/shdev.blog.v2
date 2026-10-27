import { DEFAULT_LANG } from "#/shared/constant/lang";
export const MENU_ITEMS = [
  { to: "/", subPath: `/${DEFAULT_LANG}/post`, label: "Posts" },
  { to: "/series", label: "Series" },
  { to: "/books", label: "Books" },
  { to: "/about", label: "About" },
] as const;
