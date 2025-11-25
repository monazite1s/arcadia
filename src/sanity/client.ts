import { createClient } from "next-sanity";

import imageUrlBuilder from "@sanity/image-url";
import type { SanityImageSource } from "@sanity/image-url/lib/types/types";

/**
 * Sanity Client 配置
 * 支持环境变量和生产环境 CDN 优化
 */
export const client = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "x98kub3q",
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
    apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2024-01-01",
    useCdn: process.env.NODE_ENV === "production", // 生产环境启用 CDN
    token: process.env.SANITY_API_TOKEN, // 用于写入操作（迁移脚本）
});

/**
 * 图片 URL Builder
 * 用于生成优化的图片 URL
 */
const builder = imageUrlBuilder(client);

export function urlFor(source: SanityImageSource) {
    return builder.image(source);
}
