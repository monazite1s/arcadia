"use client";

import Link from "next/link";

import { Stack } from "~/src/components/ui/layout";
import { Post } from "~/src/lib/types";

interface SeriesSidebarProps {
    currentPost: Post;
    seriesPosts: Post[];
}

export function SeriesSidebar({ currentPost, seriesPosts }: SeriesSidebarProps) {
    return (
        <div className="sticky top-24 max-h-[calc(100vh-6rem)] self-start overflow-y-auto pr-3">
            <div
                className="border-border bg-card text-card-foreground rounded-lg border p-4"
                aria-label="系列文章导航"
            >
                <h3 className="text-foreground mb-4 font-mono text-sm font-bold">
                    📚 专栏：{currentPost.series}
                </h3>
                <Stack gap="0.5rem">
                    {seriesPosts.map((post, index) => (
                        <Link
                            key={post.slug}
                            href={`/blog/${post.slug}`}
                            className={`group block rounded-md px-3 py-2 text-sm transition-colors ${
                                post.slug === currentPost.slug
                                    ? "bg-primary/10 text-primary font-medium"
                                    : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                            }`}
                        >
                            <div className="flex items-start gap-2">
                                <span className="text-muted-foreground mt-0.5 font-mono text-xs">
                                    {String(index + 1).padStart(2, "0")}
                                </span>
                                <span className="flex-1">{post.title}</span>
                            </div>
                        </Link>
                    ))}
                </Stack>
            </div>
        </div>
    );
}
