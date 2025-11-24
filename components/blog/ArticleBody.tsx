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
                // 移除 prose-slate 和 dark:prose-invert,直接使用 prose
                "prose max-w-none",
                // Headings - 使用!important强制覆盖所有默认样式
                "prose-headings:!font-mono prose-headings:!font-bold prose-headings:!tracking-tight prose-headings:!scroll-mt-20",
                "prose-headings:!text-[hsl(var(--article-heading))]",
                "prose-h1:!text-4xl prose-h2:!text-3xl prose-h3:!text-2xl",
                "prose-h2:!border-b prose-h2:!border-border prose-h2:!pb-2 prose-h2:!mb-4",
                // 修复标题中的内联代码字体大小
                "prose-h1:prose-code:!text-[0.875em] prose-h2:prose-code:!text-[0.875em] prose-h3:prose-code:!text-[0.875em]",
                "prose-h1:prose-code:!font-bold prose-h2:prose-code:!font-bold prose-h3:prose-code:!font-bold",
                // Links
                "prose-a:!text-[hsl(var(--article-link))] prose-a:!underline",
                "hover:prose-a:!text-[hsl(var(--article-link-hover))]",
                // Code - 使用!important强制应用主题颜色
                "prose-code:!bg-[hsl(var(--article-code-bg))] prose-code:!text-[hsl(var(--article-code-text))]",
                "prose-code:!px-1.5 prose-code:!py-0.5 prose-code:!rounded prose-code:!font-mono prose-code:!text-sm",
                "prose-code:before:!content-[''] prose-code:after:!content-['']",
                // Pre (code blocks)
                "prose-pre:!bg-[#2D2C2A] dark:prose-pre:!bg-[#1a1a1a] prose-pre:!text-foreground",
                "prose-pre:!border prose-pre:!border-border prose-pre:!shadow-sm prose-pre:!rounded-none",
                // Blockquotes
                "prose-blockquote:!border-l-4 prose-blockquote:!border-muted prose-blockquote:!italic prose-blockquote:!text-[hsl(var(--article-blockquote))]",
                // Lists
                "prose-ul:!list-disc prose-ol:!list-decimal",
                "prose-li:!text-[hsl(var(--article-text))]",
                // Strong and emphasis
                "prose-strong:!text-[hsl(var(--article-heading))] prose-strong:!font-bold",
                "prose-em:!text-[hsl(var(--article-text))]",
                // Paragraphs
                "prose-p:!text-[hsl(var(--article-text))] prose-p:!leading-7",
                // Tables
                "prose-table:!text-[hsl(var(--article-text))] prose-th:!text-[hsl(var(--article-text))] prose-td:!text-[hsl(var(--article-text))]",
                "prose-thead:!border-border prose-tbody:!border-border",
                // Images
                "prose-img:border prose-img:border-border prose-img:rounded-none",
                className
            )}
        >
            {children}
        </article>
    );
}
