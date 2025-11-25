import { ApiContentProvider } from "./ApiContentProvider";
import type { ContentProvider as IContentProvider } from "./ContentProvider";
import { LocalMarkdownProvider } from "./LocalMarkdownProvider";

/**
 * Provider 工厂函数
 * 根据环境变量决定使用本地文件系统还是 API
 */
export function getContentProvider(): IContentProvider {
    const useApi = process.env.NEXT_PUBLIC_USE_API === "true";
    return useApi ? new ApiContentProvider() : new LocalMarkdownProvider();
}

// 默认导出
export type ContentProvider = IContentProvider;
export { LocalMarkdownProvider, ApiContentProvider };
