"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { Flex } from "@/components/ui/layout";
import { cn } from "@/lib/utils";

const navItems = [
    { name: "Home", href: "/" },
    { name: "Blog", href: "/blog" },
    { name: "Schedule", href: "/calendar" },
];

export function Navbar() {
    const pathname = usePathname();

    return (
        <Flex
            as="nav"
            className="border-border/40 bg-background/95 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 h-14 w-full border-b backdrop-blur"
            align="center"
        >
            <Flex className="container max-w-screen-2xl" align="center">
                <Flex className="mr-4 hidden md:flex" align="center">
                    <Link href="/" className="mr-6 flex items-center space-x-2">
                        <span className="hidden font-bold sm:inline-block">ARCADIA</span>
                    </Link>
                    <Flex as="nav" align="center" gap="1.5rem" className="text-sm">
                        {navItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "hover:text-foreground/80 transition-colors",
                                    pathname === item.href
                                        ? "text-foreground"
                                        : "text-foreground/60"
                                )}
                            >
                                {item.name}
                            </Link>
                        ))}
                    </Flex>
                </Flex>
            </Flex>
        </Flex>
    );
}
