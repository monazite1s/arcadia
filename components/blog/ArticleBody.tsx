import { ReactNode } from "react";

import { cn } from "@/lib/utils";

interface ArticleBodyProps {
    children: ReactNode;
    className?: string;
}

export function ArticleBody({ children, className }: ArticleBodyProps) {
    return (
        <article
            className={cn(
                "prose prose-slate dark:prose-invert max-w-none",
                // Headings
                "prose-headings:font-mono prose-headings:font-bold prose-headings:tracking-tight",
                "prose-h1:text-4xl prose-h2:text-3xl prose-h3:text-2xl",
                "prose-h2:border-b prose-h2:pb-2 prose-h2:mb-4",
                // Links
                "prose-a:text-foreground prose-a:underline prose-a:decoration-muted-foreground hover:prose-a:decoration-foreground",
                // Code
                "prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:font-mono prose-code:text-sm",
                "prose-code:before:content-[''] prose-code:after:content-['']",
                // Pre (code blocks)
                "prose-pre:bg-[#2D2C2A] prose-pre:border prose-pre:border-border",
                "prose-pre:shadow-sm prose-pre:rounded-none",
                // Blockquotes
                "prose-blockquote:border-l-4 prose-blockquote:border-muted prose-blockquote:italic",
                // Lists
                "prose-ul:list-disc prose-ol:list-decimal",
                // Images
                "prose-img:border prose-img:border-border prose-img:rounded-none",
                className
            )}
        >
            {children}
        </article>
    );
}
