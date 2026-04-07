import { AnimatePresence, motion, type Variants } from "motion/react";
import { useTransition } from "react";
import { useTheme } from "#/features/theme/provider/ThemeProvider.tsx";

const toggleVariants: Variants = {
  initial: { y: -60, x: 20, rotate: 30, opacity: 0 },
  animate: {
    y: 0,
    x: 0,
    rotate: 0,
    opacity: 1,
    transition: { duration: 0.8, ease: [0.4, 0, 0.2, 1] },
  },
  exit: {
    y: 60,
    x: -20,
    rotate: -30,
    opacity: 0,
    transition: { duration: 0.8, ease: [0.4, 0, 0.2, 1] },
  },
};

const THEMES = {
  light: { src: "/images/sun.png", alt: "sun", label: "Switch to dark mode" },
  dark: { src: "/images/moon.png", alt: "moon", label: "Switch to light mode" },
} as const;

export function ThemeToggleButton() {
  const { isDark, toggleTheme } = useTheme();
  const [isChanging, startThemeChange] = useTransition();
  const current = isDark ? THEMES.dark : THEMES.light;

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
      className="absolute top-4 left-44 z-30 h-10 w-10 shrink-0 cursor-pointer sm:left-64"
      onClick={handleClick}
      disabled={isChanging}
      aria-label={current.label}
    >
      <AnimatePresence>
        <motion.div
          key={current.alt}
          initial="initial"
          animate="animate"
          exit="exit"
          variants={toggleVariants}
          className="absolute inset-0"
        >
          <img
            src={current.src}
            alt={current.alt}
            width={40}
            height={40}
            className="h-full w-full animate-bounce-slow object-contain"
          />
        </motion.div>
      </AnimatePresence>
    </button>
  );
}
