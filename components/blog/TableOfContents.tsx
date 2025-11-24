"use client";

import { useEffect, useState } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Stack } from "@/components/ui/layout";
import { cn } from "@/lib/utils";

interface TOCHeading {
    id: string;
    text: string;
    level: number;
}

export function TableOfContents() {
    const [headings, setHeadings] = useState<TOCHeading[]>([]);
    const [activeId, setActiveId] = useState<string>("");

    useEffect(() => {
        // Extract headings from the article
        const article = document.querySelector("article");
        if (!article) return;

        const elements = article.querySelectorAll("h2, h3");
        const tocHeadings: TOCHeading[] = Array.from(elements).map((elem) => ({
            id: elem.id,
            text: elem.textContent || "",
            level: parseInt(elem.tagName.charAt(1)),
        }));

        // 使用 requestAnimationFrame 延迟 setState，避免同步调用
        requestAnimationFrame(() => {
            setHeadings(tocHeadings);
        });

        // Intersection Observer for active heading
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setActiveId(entry.target.id);
                    }
                });
            },
            { rootMargin: "-80px 0px -80% 0px" }
        );

        elements.forEach((elem) => observer.observe(elem));

        return () => observer.disconnect();
    }, []);

    if (headings.length === 0) return null;

    return (
        <Card className="sticky top-20">
            <CardHeader>
                <CardTitle className="font-mono text-lg">目录</CardTitle>
            </CardHeader>
            <CardContent>
                <Stack gap="0.5rem">
                    {headings.map((heading) => (
                        <a
                            key={heading.id}
                            href={`#${heading.id}`}
                            className={cn(
                                "border-l-2 py-1 text-sm transition-colors",
                                heading.level === 3 && "pl-4",
                                heading.level === 2 && "pl-2",
                                activeId === heading.id
                                    ? "border-foreground font-medium"
                                    : "text-muted-foreground hover:text-foreground border-transparent"
                            )}
                        >
                            {heading.text}
                        </a>
                    ))}
                </Stack>
            </CardContent>
        </Card>
    );
}
