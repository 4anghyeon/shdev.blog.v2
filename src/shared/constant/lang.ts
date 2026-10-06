export const SUPPORTED_LANGS = ["ko"] as const;
export const DEFAULT_LANG = "ko";

export type Lang = (typeof SUPPORTED_LANGS)[number];

export const isSupportedLang = (lang: string): lang is Lang =>
  (SUPPORTED_LANGS as readonly string[]).includes(lang);
