import type { ContentProvider as IContentProvider } from "./ContentProvider";
import { LocalMarkdownProvider } from "./LocalMarkdownProvider";
import { SanityContentProvider } from "./SanityContentProvider";

/**
 * Provider 工厂函数
 * 默认使用 Sanity CMS（生产环境）
 * 本地开发可设置 NEXT_PUBLIC_USE_LOCAL=true 使用本地 MDX
 */
export function getContentProvider(): IContentProvider {
    const useLocal = process.env.NEXT_PUBLIC_USE_LOCAL === "true";

    if (useLocal) return new LocalMarkdownProvider();
    return new SanityContentProvider();
}

// 默认导出
export type ContentProvider = IContentProvider;
