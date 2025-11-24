"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Stack } from "@/components/ui/layout";
import { Tag } from "@/lib/types";
import { cn } from "@/lib/utils";

interface TagFilterProps {
    tags: Tag[];
}

export function TagFilter({ tags }: TagFilterProps) {
    const pathname = usePathname();

    return (
        <Card className="sticky top-20">
            <CardHeader>
                <CardTitle className="font-mono text-lg">标签分类</CardTitle>
            </CardHeader>
            <CardContent>
                <Stack gap="0.5rem">
                    <Link
                        href="/blog"
                        className={cn(
                            "border px-3 py-2 font-mono text-sm transition-colors",
                            pathname === "/blog"
                                ? "border-foreground bg-foreground/5"
                                : "border-border hover:border-foreground/50"
                        )}
                    >
                        全部文章
                    </Link>
                    {tags.map((tag) => (
                        <Link
                            key={tag.name}
                            href={`/tags/${tag.name}`}
                            className={cn(
                                "border px-3 py-2 font-mono text-sm transition-colors",
                                pathname === `/tags/${tag.name}`
                                    ? "border-foreground bg-foreground/5"
                                    : "border-border hover:border-foreground/50"
                            )}
                        >
                            #{tag.name}{" "}
                            <span className="text-muted-foreground text-xs">({tag.count})</span>
                        </Link>
                    ))}
                </Stack>
            </CardContent>
        </Card>
    );
}
