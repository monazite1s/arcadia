"use client";

import { useEffect, useState } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "~/src/components/ui/card";
import { Stack } from "~/src/components/ui/layout";
import { cn } from "~/src/lib/utils";

interface TOCHeading {
    id: string;
    text: string;
    level: number;
}

const slugify = (text: string) =>
    text
        .toLowerCase()
        .trim()
        .replace(/[\s]+/g, "-")
        .replace(/[^\w-]/g, "");

export function TableOfContents() {
    const [headings, setHeadings] = useState<TOCHeading[]>([]);
    const [activeId, setActiveId] = useState<string>("");

    useEffect(() => {
        // Extract headings from the article
        const article = document.querySelector("article");
        if (!article) return;

        const elements = article.querySelectorAll("h2, h3");
        const idMap = new Map<string, number>();
        const ensureId = (elem: Element, index: number) => {
            if (elem.id) return elem.id;
            const rawText = elem.textContent || `heading-${index}`;
            const base = slugify(rawText) || `heading-${index}`;
            const count = idMap.get(base) ?? 0;
            idMap.set(base, count + 1);
            const computedId = count === 0 ? base : `${base}-${count}`;
            elem.id = computedId;
            return computedId;
        };

        const tocHeadings: TOCHeading[] = Array.from(elements).map((elem, index) => ({
            id: ensureId(elem, index),
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

    // 处理点击跳转,平滑滚动到对应标题
    const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
        e.preventDefault();
        const element = document.getElementById(id);
        if (element) {
            const headerOffset = 96; // 固定头部高度 (top-24 = 6rem = 96px)
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({ top: offsetPosition, behavior: "smooth" });
            window.history.replaceState(null, "", `#${id}`);
        }
    };

    if (headings.length === 0) return null;

    return (
        <Card className="hide-scrollbar sticky top-24 max-h-[calc(100vh-6rem)] self-start overflow-y-auto">
            <CardHeader>
                <CardTitle className="font-mono text-lg">目录</CardTitle>
            </CardHeader>
            <CardContent>
                <Stack gap="0.5rem">
                    {headings.map((heading) => (
                        <a
                            key={heading.id}
                            href={`#${heading.id}`}
                            onClick={(e) => handleClick(e, heading.id)}
                            className={cn(
                                "cursor-pointer border-l-2 py-1 text-sm transition-colors",
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
