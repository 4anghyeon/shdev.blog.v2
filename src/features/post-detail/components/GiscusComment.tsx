import Giscus from "@giscus/react";
import { useTheme } from "#/features/theme/provider/ThemeProvider.tsx";

export function GiscusComment() {
  const { isDark } = useTheme();
  return (
    <div className="mt-16">
      <Giscus
        repo="4anghyeon/shdev.blog.v2"
        repoId="R_kgDOR3g5Mg"
        category="Comments"
        categoryId="DIC_kwDOR3g5Ms4C7UCO"
        mapping="pathname"
        strict="0"
        reactionsEnabled="1"
        emitMetadata="0"
        inputPosition="top"
        theme={isDark ? "dark" : "light"}
        lang="ko"
        loading="lazy"
      />
    </div>
  );
}
