import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";

import { SpeedInsights } from "@vercel/speed-insights/next";
import { GlobalFooter } from "~/src/components/layout/GlobalFooter";
import { GlobalHeader } from "~/src/components/layout/GlobalHeader";
import { ThemeProvider } from "~/src/components/providers/ThemeProvider";
import { cn } from "~/src/lib/utils";

import "./globals.css";

const inter = Inter({
    variable: "--font-sans",
    subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
    variable: "--font-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "Arcadia | Engineering Blog",
    description: "A Next.js full-stack engineering blog starter.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="zh-CN" suppressHydrationWarning>
            <head>
                {/* 🎯 关键：在任何内容渲染前执行，消除闪烁 */}
                <script
                    dangerouslySetInnerHTML={{
                        __html: `
                            (function() {
                                try {
                                    // 与 lib/theme.ts 中的 resolveTheme() 逻辑完全一致
                                    var root = document.documentElement;
                                    var stored = localStorage.getItem('theme');
                                    var theme;
                                    
                                    // 优先使用存储的主题
                                    if (stored === 'dark' || stored === 'light') {
                                        theme = stored;
                                    } else {
                                        // 回退到系统主题
                                        var mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
                                        theme = mediaQuery.matches ? 'dark' : 'light';
                                    }
                                    
                                    // 立即应用主题，避免闪烁
                                    root.classList.toggle('dark', theme === 'dark');
                                    root.dataset.theme = theme;
                                    root.style.colorScheme = theme;
                                } catch (e) {
                                    // 静默失败，使用默认 light 主题
                                }
                            })();
                        `,
                    }}
                />
            </head>
            <body className={cn(inter.className, jetbrainsMono.className, "antialiased")}>
                <ThemeProvider>
                    <div className="flex min-h-screen flex-col">
                        <GlobalHeader />
                        <main className="flex-1">{children}</main>
                        <GlobalFooter />
                    </div>
                </ThemeProvider>
                {/* Vercel 性能监控埋点 */}
                <SpeedInsights />
            </body>
        </html>
    );
}
