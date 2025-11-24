"use client";

import { Flex, Stack } from "@/components/ui/layout";

export function GlobalFooter() {
    const currentYear = new Date().getFullYear();

    return (
        <Flex
            as="footer"
            className="border-border text-background/70 w-full border-t bg-[#2D2C2A]"
            align="center"
            justify="center"
            style={{ minHeight: "80px" }}
        >
            <Stack className="px-6 py-6 text-center" gap="0.5rem" align="center">
                <p className="font-mono text-sm">
                    © {currentYear} Arcadia. Built with Next.js & shadcn/ui.
                </p>
                <p className="text-xs">一个高度工程化、可扩展且模块化的全栈博客 Starter。</p>
            </Stack>
        </Flex>
    );
}
