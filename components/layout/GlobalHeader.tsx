"use client";

import { useEffect, useState } from "react";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { Flex } from "@/components/ui/layout";
import { cn } from "@/lib/utils";

const navItems = [
    { name: "小屋", href: "/" },
    { name: "秘笈", href: "/blog" },
    { name: "书橱", href: "/archives" },
    { name: "日历", href: "/calendar" },
    { name: "杂谈", href: "/about" },
];

export function GlobalHeader() {
    const pathname = usePathname();
    // 使用 lazy initialization 来初始化主题状态
    const [isDark, setIsDark] = useState(() => {
        if (typeof window === "undefined") return false;
        const savedTheme = localStorage.getItem("theme");
        return (
            savedTheme === "dark" ||
            (!savedTheme && document.documentElement.classList.contains("dark"))
        );
    });

    useEffect(() => {
        // 只在客户端同步 DOM 状态
        if (isDark) {
            document.documentElement.classList.add("dark");
        }
    }, [isDark]);

    const toggleTheme = () => {
        const newTheme = !isDark;
        setIsDark(newTheme);
        if (newTheme) {
            document.documentElement.classList.add("dark");
            localStorage.setItem("theme", "dark");
        } else {
            document.documentElement.classList.remove("dark");
            localStorage.setItem("theme", "light");
        }
    };

    return (
        <Flex
            as="header"
            className="border-border bg-background/95 supports-[backdrop-filter]:bg-background/80 sticky top-0 z-50 w-full border-b-2 backdrop-blur"
            align="center"
            style={{ height: "60px" }}
        >
            <Flex className="w-full px-6" align="center" justify="between">
                {/* Left: Logo */}
                <Link href="/" className="flex items-center">
                    <span className="text-primary font-mono text-xl font-bold">ARCADIA</span>
                </Link>

                {/* Right: Navigation + Theme Toggle */}
                <Flex align="center" gap="0">
                    <Flex as="nav" align="center" gap="0">
                        {navItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "border-b-2 border-transparent px-4 py-2 text-sm font-medium transition-all",
                                    pathname === item.href || pathname.startsWith(item.href + "/")
                                        ? "text-primary border-primary bg-primary/5"
                                        : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                                )}
                            >
                                {item.name}
                            </Link>
                        ))}
                    </Flex>

                    <div className="bg-border mx-2 h-6 w-px" />

                    <button
                        onClick={toggleTheme}
                        className="border-border hover:bg-muted/50 rounded-md border-2 px-3 py-1.5 text-sm font-medium transition-colors"
                        aria-label="Toggle theme"
                    >
                        {isDark ? "☀️" : "🌙"}
                    </button>
                </Flex>
            </Flex>
        </Flex>
    );
}
