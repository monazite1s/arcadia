export type Theme = "light" | "dark";

const THEME_STORAGE_KEY = "theme";
const DARK_MEDIA_QUERY = "(prefers-color-scheme: dark)";

export const getStoredTheme = (): Theme | null => {
    if (typeof window === "undefined") return null;
    const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
    return stored === "dark" || stored === "light" ? stored : null;
};

export const getSystemTheme = (): Theme => {
    if (typeof window === "undefined") return "light";
    return window.matchMedia(DARK_MEDIA_QUERY).matches ? "dark" : "light";
};

export const resolveTheme = (): Theme => {
    return getStoredTheme() ?? getSystemTheme();
};

/**
 * 应用主题
 * @param theme
 */
export const applyThemeToDocument = (theme: Theme) => {
    if (typeof document === "undefined") return;
    const root = document.documentElement;
    root.classList.toggle("dark", theme === "dark");
    root.dataset.theme = theme;
    root.style.colorScheme = theme;
};

/**
 * 持久化主题
 * @param theme
 */
export const persistTheme = (theme: Theme) => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(THEME_STORAGE_KEY, theme);
};

/**
 * 订阅系统主题变化
 * @param cb
 * @returns
 */
export const subscribeToSystemTheme = (cb: (theme: Theme) => void): (() => void) | undefined => {
    if (typeof window === "undefined") return undefined;
    const mediaQuery = window.matchMedia(DARK_MEDIA_QUERY);
    const handler = (event: MediaQueryListEvent) => cb(event.matches ? "dark" : "light");
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
};

export const THEME_KEY = THEME_STORAGE_KEY;
