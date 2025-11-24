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
} from "@/lib/theme";

interface ThemeContextValue {
    theme: Theme;
    toggleTheme: () => void;
    setTheme: (theme: Theme) => void;
    mounted: boolean;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

const getInitialTheme = (): Theme => {
    if (typeof document === "undefined") {
        return "light";
    }
    const declaredTheme = document.documentElement.dataset.theme;
    if (declaredTheme === "dark" || declaredTheme === "light") {
        return declaredTheme;
    }
    return resolveTheme();
};

export function ThemeProvider({ children }: { children: ReactNode }) {
    const [theme, setThemeState] = useState<Theme>(() => {
        const initial = getInitialTheme();
        if (typeof document !== "undefined") {
            applyThemeToDocument(initial);
        }
        return initial;
    });
    const mounted = typeof window !== "undefined";

    const applyAndStoreTheme = useCallback((nextTheme: Theme, persist = true) => {
        setThemeState(nextTheme);
        applyThemeToDocument(nextTheme);
        if (persist) {
            persistTheme(nextTheme);
        }
    }, []);

    useEffect(() => {
        const unsubscribe = subscribeToSystemTheme((systemTheme) => {
            const stored = typeof window !== "undefined" ? localStorage.getItem(THEME_KEY) : null;
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
    }, [applyAndStoreTheme]);

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
