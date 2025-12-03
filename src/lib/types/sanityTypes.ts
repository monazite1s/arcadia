/**
 * Sanity 原始数据类型定义
 * 对应 Sanity CMS 返回的文档结构
 */

export interface SanityImageAsset {
    _type: "image";
    asset: {
        _ref: string;
        _type: "reference";
    };
    alt?: string;
}

export interface SanitySlug {
    _type: "slug";
    current: string;
}

/**
 * Sanity Post 文档类型
 */
export interface SanityPost {
    _id: string;
    _type: "post";
    _createdAt: string;
    _updatedAt: string;
    title: string;
    slug: SanitySlug;
    publishedAt: string;
    excerpt?: string;
    tags?: string[];
    series?: string;
    body: string; // MDX 格式字符串
    image?: SanityImageAsset;
}

/**
 * Sanity GROQ 查询结果类型
 */
export interface SanityPostListItem {
    _id: string;
    title: string;
    slug: SanitySlug;
    publishedAt: string;
    excerpt?: string;
    tags?: string[];
    series?: string;
    image?: SanityImageAsset;
}

export interface SanityAboutPost {
    _id: string;
    title: string;
    slug: SanitySlug;
    publishedAt: string;
    body: string;
}

export interface SanityDocCategory {
    _id: string;
    title: string;
    slug: SanitySlug;
    order: number;
    parentCategory?: {
        _ref: string;
        _type: "reference";
    };
}

export interface SanityDocPage {
    _id: string;
    title: string;
    slug: SanitySlug;
    content: string; // MDX 格式文本
    category: {
        _ref: string;
        _type: "reference";
    };
    order: number;
}
