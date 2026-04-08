const LANG_TO_EXT = {
  typescript: "ts",
  javascript: "js",
  typescriptreact: "tsx",
  javascriptreact: "jsx",
  python: "py",
  rust: "rs",
  golang: "go",
  markdown: "md",
  mdx: "mdx",
  html: "html",
  css: "css",
  scss: "scss",
  json: "json",
  yaml: "yml",
  shell: "sh",
  bash: "sh",
  sh: "sh",
  sql: "sql",
} as const;

export type LangExtension = keyof typeof LANG_TO_EXT;
export const getLangExtension = (lang: LangExtension | string) => {
  return LANG_TO_EXT[lang as LangExtension] ?? lang;
};
