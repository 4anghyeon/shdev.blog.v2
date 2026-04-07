import { ScriptOnce } from "@tanstack/react-router";
import Cookies from "js-cookie";
import {
  createContext,
  type PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from "react";

type Theme = "light" | "dark" | "system";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_COOKIE_KEY = "theme";
const THEME_COOKIE_OPTIONS = {
  expires: 365, // 1년
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
};

const THEME_SCRIPT = `
              (function() {
                let theme = 'system';
                const cookies = document.cookie.split(';');
                for (let i = 0; i < cookies.length; i++) {
                  const cookie = cookies[i].trim();
                  if (cookie.startsWith('theme=')) {
                    theme = cookie.substring(6);
                    break;
                  }
                }

                const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                const isDark = theme === 'dark' || (theme === 'system' && systemDark);

                document.documentElement.classList.toggle('dark', isDark);
              })();
            `;

export function ThemeProvider({ children }: PropsWithChildren) {
  const [theme, setTheme] = useState<Theme>("system");
  const [isDark, setIsDark] = useState(false); // 별도 state로 관리

  const calcIsDark = (t: Theme) => {
    if (t === "dark") return true;
    if (t === "light") return false;
    if (typeof window === "undefined") return false;
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  };

  const applyTheme = (t: Theme) => {
    const dark = calcIsDark(t);
    document.documentElement.classList.toggle("dark", dark);
    setIsDark(dark);
  };

  const toggleTheme = () => {
    setTheme((prevTheme) => {
      const newTheme = prevTheme === "light" ? "dark" : "light";
      Cookies.set(THEME_COOKIE_KEY, newTheme, THEME_COOKIE_OPTIONS);
      applyTheme(newTheme);
      return newTheme;
    });
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: <only on mount>
  useEffect(() => {
    const storedTheme = Cookies.get(THEME_COOKIE_KEY) as Theme | undefined;

    if (storedTheme === "light" || storedTheme === "dark") {
      setTheme(storedTheme);
      applyTheme(storedTheme);
    } else {
      setTheme("system");
      applyTheme("system"); // 여기서 실제 시스템 값으로 isDark 세팅됨
    }
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, isDark }}>
      <ScriptOnce>{THEME_SCRIPT}</ScriptOnce>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
