"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { Moon, Sun } from "lucide-react";

import { useTheme } from "@/components/providers/ThemeProvider";
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
    const { theme, toggleTheme, mounted } = useTheme();
    const isDark = theme === "dark";

    return (
        <Flex
            as="header"
            className="border-border bg-background/100 supports-[backdrop-filter]:bg-background/100 sticky top-0 z-50 w-full border-b-2 backdrop-blur-[4px]"
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
                        className="border-border hover:bg-muted/50 text-muted-foreground hover:text-foreground rounded-md border-2 px-2 py-1.5 transition-colors"
                        aria-label="Toggle theme"
                    >
                        {!mounted ? (
                            <Moon className="h-4 w-4" />
                        ) : isDark ? (
                            <Sun className="h-4 w-4" />
                        ) : (
                            <Moon className="h-4 w-4" />
                        )}
                    </button>
                </Flex>
            </Flex>
        </Flex>
    );
}
