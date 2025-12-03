import { ReactNode } from "react";

import { cn } from "~/src/lib/utils";

interface DocContentProps {
    children: ReactNode;
    className?: string;
}

/**
 * 知识库文档内容容器
 *
 * 样式特点:
 * - 无 border 边框,使用横线分隔
 * - 复用 ArticleBody 的样式基础
 * - 文档风格,简洁清晰
 */
export function DocContent({ children, className }: DocContentProps) {
    return (
        <article
            className={cn(
                // 基础 prose 样式
                "prose max-w-none",
                // 自定义文章样式（定义在 globals.css 中）
                "article-body",
                // 文档特有样式
                "doc-content",
                className
            )}
        >
            {children}
        </article>
    );
}
