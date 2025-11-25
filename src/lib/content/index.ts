import type { ContentProvider as IContentProvider } from "./ContentProvider";
import { LocalMarkdownProvider } from "./LocalMarkdownProvider";
import { SanityContentProvider } from "./SanityContentProvider";

/**
 * Provider 工厂函数
 * 根据环境变量决定使用本地文件系统、API 还是 Sanity CMS
 */
export function getContentProvider(): IContentProvider {
    const useSanity = process.env.NEXT_PUBLIC_USE_SANITY === "true";

    if (useSanity) return new SanityContentProvider();
    return new LocalMarkdownProvider();
}

// 默认导出
export type ContentProvider = IContentProvider;
