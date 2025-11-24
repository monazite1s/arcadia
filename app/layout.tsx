import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";

import { GlobalFooter } from "@/components/layout/GlobalFooter";
import { GlobalHeader } from "@/components/layout/GlobalHeader";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { cn } from "@/lib/utils";

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
            <body className={cn(inter.className, jetbrainsMono.className, "antialiased")}>
                <script
                    dangerouslySetInnerHTML={{
                        __html: `
                            (function () {
                                try {
                                    var root = document.documentElement;
                                    var stored = localStorage.getItem('theme');
                                    var mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
                                    var theme = stored === 'dark' || stored === 'light' ? stored : (mediaQuery.matches ? 'dark' : 'light');
                                    root.classList.toggle('dark', theme === 'dark');
                                    root.dataset.theme = theme;
                                    root.style.colorScheme = theme;
                                } catch (error) {
                                    console.warn('Theme init failed', error);
                                }
                            })();
                        `,
                    }}
                />
                <ThemeProvider>
                    <div className="flex min-h-screen flex-col">
                        <GlobalHeader />
                        <main className="flex-1">{children}</main>
                        <GlobalFooter />
                    </div>
                </ThemeProvider>
            </body>
        </html>
    );
}
