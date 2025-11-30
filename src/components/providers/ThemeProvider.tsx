"use client";

import {
    ReactNode,
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
} from "react";

import {
    THEME_KEY,
    Theme,
    applyThemeToDocument,
    persistTheme,
    resolveTheme,
    subscribeToSystemTheme,
} from "~/src/lib/theme";

interface ThemeContextValue {
    theme: Theme;
    toggleTheme: () => void;
    setTheme: (theme: Theme) => void;
    mounted: boolean;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
    const [mounted, setMounted] = useState(false);
    const [theme, setThemeState] = useState<Theme>(() => {
        // SSR: 初始使用 light 避免水合冲突
        if (typeof window === "undefined") {
            return "light";
        }
        // Client 初始渲染
        return resolveTheme();
    });

    // 挂载时应用主题并标记为已挂载
    useEffect(() => {
        const actualTheme = resolveTheme();
        if (actualTheme !== theme) {
            setThemeState(actualTheme);
        }
        applyThemeToDocument(actualTheme);
        setMounted(true);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const applyAndStoreTheme = useCallback((nextTheme: Theme, persist = true) => {
        setThemeState(nextTheme);
        applyThemeToDocument(nextTheme);
        if (persist) {
            persistTheme(nextTheme);
        }
    }, []);

    useEffect(() => {
        if (!mounted) return;

        const unsubscribe = subscribeToSystemTheme((systemTheme) => {
            const stored = localStorage.getItem(THEME_KEY);
            if (stored === "dark" || stored === "light") {
                return;
            }
            applyAndStoreTheme(systemTheme, false);
        });

        return () => {
            if (unsubscribe) {
                unsubscribe();
            }
        };
    }, [applyAndStoreTheme, mounted]);

    const handleSetTheme = useCallback(
        (nextTheme: Theme) => {
            applyAndStoreTheme(nextTheme);
        },
        [applyAndStoreTheme]
    );

    const toggleTheme = useCallback(() => {
        handleSetTheme(theme === "dark" ? "light" : "dark");
    }, [handleSetTheme, theme]);

    const value = useMemo(
        () => ({
            theme,
            toggleTheme,
            setTheme: handleSetTheme,
            mounted,
        }),
        [handleSetTheme, mounted, theme, toggleTheme]
    );

    return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error("useTheme must be used within ThemeProvider");
    }
    return context;
}
