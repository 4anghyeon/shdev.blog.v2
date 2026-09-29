import { useTransition } from "react";
import { useTheme } from "#/features/theme/provider/ThemeProvider";
import { cn } from "#/shared/lib/tailwind";

// 헤더 풍경 속 해(라이트)/달(다크) 위에 겹쳐 놓는 투명 버튼
export function ThemeToggleButton({ className }: { className?: string }) {
  const { isDark, toggleTheme } = useTheme();
  const [isChanging, startThemeChange] = useTransition();
  const label = isDark ? "Switch to light mode" : "Switch to dark mode";

  const handleClick = () => {
    toggleTheme();
    document.body.classList.add("theme-change");
    startThemeChange(async () => {
      document.body.classList.remove("theme-change");
    });
  };

  return (
    <button
      type="button"
      className={cn(
        "-translate-1/2 aspect-square w-[4.5%] min-w-10 cursor-pointer rounded-full transition-shadow duration-300 hover:shadow-[0_0_24px_10px_rgb(253_224_171/0.7)] focus-visible:outline-2 focus-visible:outline-amber-400 focus-visible:outline-offset-2 dark:hover:shadow-[0_0_24px_10px_rgb(226_232_240/0.35)]",
        className,
      )}
      onClick={handleClick}
      disabled={isChanging}
      aria-label={label}
      title={label}
    />
  );
}
