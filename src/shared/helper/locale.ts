const removeLocaleFromPath = (path: string) =>
  path.replace(/^\/[a-z]{2}\/|^[a-z]{2}\//, "");

export const localeHelper = {
  removeLocaleFromPath,
} as const;
