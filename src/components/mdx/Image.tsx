"use client";

import { useState } from "react";

import { cn } from "~/src/lib/utils";

/**
 * MDX Image 组件 Props
 */
interface ImageProps {
    /** 图片 URL */
    src: string;
    /** 图片描述 (alt text) */
    alt?: string;
    /** 尺寸预设: small(400px) | medium(600px,默认) | large(800px) | full(100%) */
    size?: "small" | "medium" | "large" | "full";
    /** 图片说明文字,显示在图片下方 */
    caption?: string;
    /** 对齐方式 */
    align?: "left" | "center" | "right";
    /** 自定义类名 */
    className?: string;
}

/**
 * 尺寸预设映射
 */
const SIZE_PRESETS = {
    small: "max-w-[400px]",
    medium: "max-w-[600px]",
    large: "max-w-[800px]",
    full: "w-full",
} as const;

/**
 * 对齐方式映射
 */
const ALIGN_CLASSES = {
    left: "mr-auto",
    center: "mx-auto",
    right: "ml-auto",
} as const;

/**
 * MDXImage - 增强的图片组件
 *
 * 解决问题:
 * 1. 图片尺寸不合理 (1:1 图片占满宽度)
 * 2. 缺少说明文字支持
 * 3. 缺少加载状态和错误处理
 *
 * 🎨 主题支持:
 * - 自动适配 dark/light 模式
 * - 使用 --mdx-image-* CSS 变量
 *
 * @example
 * ```mdx
 * <Image src="/image.jpg" alt="示例图片" />
 * <Image src="/image.jpg" alt="小图" size="small" />
 * <Image src="/image.jpg" alt="大图" size="large" caption="这是图片说明" />
 * ```
 */
export function Image({
    src,
    alt = "Blog Image",
    size = "medium",
    caption,
    align = "center",
    className,
}: ImageProps) {
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);

    if (!src) return null;

    // 组合样式类
    const containerClasses = cn(
        "my-6",
        SIZE_PRESETS[size],
        ALIGN_CLASSES[align],
        "w-full" // 确保在小屏幕上响应式
    );

    const imageClasses = cn(
        "w-full h-auto rounded-lg border transition-opacity duration-300",
        "border-[hsl(var(--mdx-image-border))]",
        isLoading && "opacity-0",
        !isLoading && "opacity-100",
        className
    );

    return (
        <figure className={containerClasses}>
            {/* 加载骨架屏 */}
            {isLoading && (
                <div className="aspect-video w-full animate-pulse rounded-lg bg-[hsl(var(--muted))]" />
            )}

            {/* 错误状态 */}
            {hasError && (
                <div className="flex aspect-video w-full items-center justify-center rounded-lg border border-[hsl(var(--mdx-image-border))] bg-[hsl(var(--muted))]">
                    <div className="text-center">
                        <span className="text-4xl">🖼️</span>
                        <p className="mt-2 text-sm text-[hsl(var(--muted-foreground))]">
                            图片加载失败
                        </p>
                    </div>
                </div>
            )}

            {/* 图片 */}
            {!hasError && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                    src={src}
                    alt={alt}
                    className={imageClasses}
                    loading="lazy"
                    onLoad={() => setIsLoading(false)}
                    onError={() => {
                        setIsLoading(false);
                        setHasError(true);
                    }}
                />
            )}

            {/* Caption 说明文字 */}
            {caption && !hasError && (
                <figcaption className="mt-2 text-center text-sm text-[hsl(var(--mdx-image-caption-text))] italic">
                    {caption}
                </figcaption>
            )}
        </figure>
    );
}

// 导出别名,方便在 MDX 中使用
export default Image;
