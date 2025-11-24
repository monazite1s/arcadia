import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";

import { GlobalFooter } from "@/components/layout/GlobalFooter";
import { GlobalHeader } from "@/components/layout/GlobalHeader";
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
                <div className="flex min-h-screen flex-col">
                    <GlobalHeader />
                    <main className="flex-1 overflow-auto">{children}</main>
                    <GlobalFooter />
                </div>
            </body>
        </html>
    );
}
