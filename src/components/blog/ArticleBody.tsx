import { ReactNode } from "react";

import { cn } from "~/src/lib/utils";

interface ArticleBodyProps {
    children: ReactNode;
    className?: string;
}

/**
 * ArticleBody 组件 - 文章内容容器
 *
 * 🎨 主题支持：
 * - 所有样式通过 CSS 类应用，定义在 globals.css 中
 * - 自动适配 dark/light 模式
 * - 使用 CSS 变量，无需手动处理主题切换
 *
 * 📝 样式说明：
 * - 使用 Tailwind Typography 插件的 prose 类
 * - 通过 article-body 类应用自定义样式
 * - 所有颜色使用主题变量（--article-*）
 */
export function ArticleBody({ children, className }: ArticleBodyProps) {
    return (
        <article
            className={cn(
                // 基础 prose 样式
                "prose max-w-none",
                // 自定义文章样式（定义在 globals.css 中）
                "article-body",
                className
            )}
        >
            {children}
        </article>
    );
}
