"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { Moon, Sun } from "lucide-react";
import { AuthButton } from "~/src/components/auth/AuthButton";
import { useTheme } from "~/src/components/providers/ThemeProvider";
import { Flex } from "~/src/components/ui/layout";
import { cn } from "~/src/lib/utils";

import { Button } from "../ui/button";

const navItems = [
    { name: "小屋", href: "/" },
    { name: "博客", href: "/blog" },
    { name: "归档", href: "/archives" },
    { name: "日历", href: "/calendar" },
    { name: "留言板", href: "/guestbook" },
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

                    {/* Auth Button */}
                    <AuthButton />

                    <div className="bg-border mx-2 h-6 w-px" />

                    <Button
                        onClick={toggleTheme}
                        variant="outline"
                        size="icon"
                        aria-label="Toggle theme"
                        suppressHydrationWarning
                    >
                        {mounted && isDark ? (
                            <Sun className="h-4 w-4" />
                        ) : (
                            <Moon className="h-4 w-4" />
                        )}
                    </Button>
                </Flex>
            </Flex>
        </Flex>
    );
}
