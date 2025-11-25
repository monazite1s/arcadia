"use client";

import { useState } from "react";

import Link from "next/link";

import { Card, CardContent, CardHeader, CardTitle } from "~/src/components/ui/card";
import { Stack } from "~/src/components/ui/layout";
import { Post } from "~/src/lib/types";

interface SearchWidgetProps {
    posts: Post[];
}

export function SearchWidget({ posts }: SearchWidgetProps) {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<Post[]>([]);

    const handleSearch = (value: string) => {
        setQuery(value);
        if (value.trim() === "") {
            setResults([]);
            return;
        }

        const filtered = posts.filter(
            (post) =>
                post.title.toLowerCase().includes(value.toLowerCase()) ||
                post.excerpt?.toLowerCase().includes(value.toLowerCase()) ||
                post.tags.some((tag) => tag.toLowerCase().includes(value.toLowerCase()))
        );
        setResults(filtered.slice(0, 5)); // Limit to 5 results
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="font-mono text-lg">本地搜索</CardTitle>
            </CardHeader>
            <CardContent>
                <Stack gap="1rem">
                    <input
                        type="text"
                        placeholder="搜索文章..."
                        value={query}
                        onChange={(e) => handleSearch(e.target.value)}
                        className="border-border bg-background focus:border-foreground w-full border px-3 py-2 font-mono text-sm transition-colors focus:outline-none"
                    />
                    {results.length > 0 && (
                        <Stack gap="0.5rem">
                            {results.map((post) => (
                                <Link
                                    key={post.slug}
                                    href={`/blog/${post.slug}`}
                                    className="border-border hover:border-foreground/50 border px-3 py-2 text-sm transition-colors"
                                    onClick={() => {
                                        setQuery("");
                                        setResults([]);
                                    }}
                                >
                                    <div className="truncate font-medium">{post.title}</div>
                                    <div className="text-muted-foreground truncate text-xs">
                                        {post.tags.join(", ")}
                                    </div>
                                </Link>
                            ))}
                        </Stack>
                    )}
                </Stack>
            </CardContent>
        </Card>
    );
}
