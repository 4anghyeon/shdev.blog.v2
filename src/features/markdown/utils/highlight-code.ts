import { codeToHtml } from "shiki";

export const highlightCode = (code: string, language: string) => {
  return codeToHtml(code, {
    lang: language,
    themes: {
      light: "slack-ochin",
      dark: "slack-dark",
    },
  });
};
