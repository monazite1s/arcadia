import React from "react";

import { compileMDX } from "next-mdx-remote/rsc";

import type { MDXComponents } from "mdx/types";
import rehypePrettyCode from "rehype-pretty-code";
import remarkGfm from "remark-gfm";
import { Image } from "~/src/components/mdx/Image";
import { Alert, Callout, CodeSandbox, Tweet, YouTube } from "~/src/components/mdx/MDXComponents";
import { About, DocCategory, DocPage, Post, Tag } from "~/src/lib/types";
import type {
    SanityAboutPost,
    SanityDocCategory,
    SanityDocPage,
    SanityPost,
    SanityPostListItem,
} from "~/src/lib/types/sanityTypes";
import { client } from "~/src/sanity/client";

import { ContentProvider } from "./ContentProvider";

/**
 * MDX 自定义组件映射
 */
const mdxComponents: MDXComponents = {
    Alert,
    Callout,
    CodeSandbox,
    YouTube,
    Tweet,
    Image,
};

/**
 * Sanity CMS Content Provider
 * 从 Sanity 获取内容，转换为统一的 Post 格式
 */
export class SanityContentProvider implements ContentProvider {
    /**
     * 获取所有文章
     */
    async getPosts(): Promise<Post[]> {
        const query = `*[_type == "post"] | order(publishedAt desc) {
            _id,
            title,
            slug,
            publishedAt,
            excerpt,
            tags,
            series,
            image
        }`;

        const posts = (await client.fetch(
            query,
            {},
            { next: { revalidate: 30 } }
        )) as SanityPostListItem[];

        return Promise.all(
            posts.map(async (sanityPost) => {
                return {
                    slug: sanityPost.slug.current,
                    title: sanityPost.title,
                    date: sanityPost.publishedAt,
                    tags: sanityPost.tags || [],
                    excerpt: sanityPost.excerpt,
                    series: sanityPost.series,
                    // 列表页不需要完整内容，使用空元素占位
                    content: React.createElement(React.Fragment),
                };
            })
        );
    }

    /**
     * 根据 slug 获取单篇文章
     */
    async getPostBySlug(slug: string): Promise<Post | null> {
        const query = `*[_type == "post" && slug.current == $slug][0] {
            _id,
            title,
            slug,
            publishedAt,
            excerpt,
            tags,
            series,
            body,
            image
        }`;

        const sanityPost = (await client.fetch(
            query,
            { slug },
            { next: { revalidate: 30 } }
        )) as SanityPost | null;

        if (!sanityPost) {
            return null;
        }

        // 将 MDX 字符串编译为 React 组件
        const { content } = await compileMDX({
            source: sanityPost.body,
            options: {
                parseFrontmatter: false,
                mdxOptions: {
                    remarkPlugins: [remarkGfm],
                    rehypePlugins: [
                        [
                            rehypePrettyCode,
                            {
                                theme: {
                                    dark: "github-dark",
                                    light: "github-light",
                                },
                                keepBackground: false,
                            },
                        ],
                    ],
                },
            },
            components: mdxComponents,
        });

        return {
            slug: sanityPost.slug.current,
            title: sanityPost.title,
            date: sanityPost.publishedAt,
            tags: sanityPost.tags || [],
            excerpt: sanityPost.excerpt,
            series: sanityPost.series,
            content,
        };
    }

    /**
     * 获取所有标签及其文章数量
     */
    async getTags(): Promise<Tag[]> {
        const query = `*[_type == "post" && defined(tags)] {
            tags
        }`;

        const posts = (await client.fetch(query, {}, { next: { revalidate: 30 } })) as {
            tags: string[];
        }[];

        const tagMap = new Map<string, number>();

        posts.forEach((post) => {
            post.tags?.forEach((tag) => {
                tagMap.set(tag, (tagMap.get(tag) || 0) + 1);
            });
        });

        return Array.from(tagMap.entries()).map(([name, count]) => ({ name, count }));
    }

    /**
     * 获取特定标签的所有文章
     */
    async getPostsByTag(tag: string): Promise<Post[]> {
        const query = `*[_type == "post" && $tag in tags] | order(publishedAt desc) {
            _id,
            title,
            slug,
            publishedAt,
            excerpt,
            tags,
            series
        }`;

        const queryParams = { tag } as Record<string, unknown>;
        const posts = (await client.fetch(query, queryParams, {
            next: { revalidate: 30 },
        })) as SanityPostListItem[];

        return posts.map((sanityPost) => ({
            slug: sanityPost.slug.current,
            title: sanityPost.title,
            date: sanityPost.publishedAt,
            tags: sanityPost.tags || [],
            excerpt: sanityPost.excerpt,
            series: sanityPost.series,
            content: React.createElement(React.Fragment),
        }));
    }
    /**
     * Get the About page content.
     * Assumes there is a post with slug "about" in Sanity.
     */
    async getAboutPage(): Promise<About | null> {
        const query = `*[_type == "about"] {
            _id,
            title,
            slug,
            publishedAt,
            body
        }`;

        const aboutPost = (
            await client.fetch(
                query,
                {},
                {
                    next: { revalidate: 30 },
                }
            )
        )[0] as SanityAboutPost;

        const { content } = await compileMDX({
            source: aboutPost.body,
            options: {
                parseFrontmatter: false,
                mdxOptions: {
                    remarkPlugins: [remarkGfm],
                    rehypePlugins: [
                        [
                            rehypePrettyCode,
                            {
                                theme: {
                                    dark: "github-dark",
                                    light: "github-light",
                                },
                                keepBackground: false,
                            },
                        ],
                    ],
                },
            },
            components: mdxComponents,
        });

        return {
            slug: aboutPost.slug.current,
            title: aboutPost.title,
            content,
        };
    }

    /**
     * Get the documentation tree structure.
     * Fetches all categories and pages, then reconstructs the tree.
     */
    async getDocTree(): Promise<DocCategory[]> {
        // Fetch all categories
        const categoriesQuery = `*[_type == "docCategory"] | order(order asc) {
            _id,
            title,
            slug,
            order,
            parentCategory
        }`;

        // Fetch all pages
        const pagesQuery = `*[_type == "docPage"] | order(order asc) {
            _id,
            title,
            slug,
            order,
            category
        }`;

        const [sanityCategories, sanityPages] = (await Promise.all([
            client.fetch(categoriesQuery, {}, { next: { revalidate: 30 } }),
            client.fetch(pagesQuery, {}, { next: { revalidate: 30 } }),
        ])) as [SanityDocCategory[], SanityDocPage[]];

        // Build the tree
        const categoryMap = new Map<string, DocCategory & { _id: string; parentId?: string }>();

        // 1. Create category nodes
        sanityCategories.forEach((cat) => {
            categoryMap.set(cat._id, {
                _id: cat._id,
                title: cat.title,
                slug: cat.slug.current,
                order: cat.order,
                parentId: cat.parentCategory?._ref,
                children: [],
                pages: [],
            });
        });

        // 2. Add pages to categories
        sanityPages.forEach((page) => {
            const cat = categoryMap.get(page.category._ref);
            if (cat) {
                cat.pages = cat.pages || [];
                cat.pages.push({
                    title: page.title,
                    slug: page.slug.current,
                    order: page.order,
                    content: React.createElement(React.Fragment), // Content not needed for tree
                });
            }
        });

        // 3. Assemble tree
        const rootCategories: DocCategory[] = [];

        categoryMap.forEach((cat) => {
            if (cat.parentId) {
                const parent = categoryMap.get(cat.parentId);
                if (parent) {
                    parent.children = parent.children || [];
                    parent.children.push(cat);
                } else {
                    // Parent not found (maybe deleted), treat as root or orphan
                    rootCategories.push(cat);
                }
            } else {
                rootCategories.push(cat);
            }
        });

        // Sort root categories and children
        const sortItems = (items: { order: number }[]) => items.sort((a, b) => a.order - b.order);

        const recursiveSort = (cats: DocCategory[]) => {
            sortItems(cats);
            cats.forEach((c) => {
                if (c.children) recursiveSort(c.children);
                if (c.pages) sortItems(c.pages);
            });
        };

        recursiveSort(rootCategories);

        return rootCategories;
    }

    /**
     * Get a single documentation page by its slug.
     */
    async getDocPageBySlug(slug: string): Promise<DocPage | null> {
        // Note: slug in Sanity is just the last part, but we might pass full path.
        // For now assuming slug is unique enough or we match by the 'current' field.
        // If slug is 'docs/guide/intro', we might need to extract 'intro'.
        // Let's assume the slug passed here is the 'current' slug from Sanity.

        const cleanSlug = slug.split("/").pop() || slug;

        const query = `*[_type == "docPage" && slug.current == $slug][0] {
            _id,
            title,
            slug,
            content,
            order,
            category
        }`;

        const sanityPage = (await client.fetch(
            query,
            { slug: cleanSlug },
            { next: { revalidate: 30 } }
        )) as SanityDocPage | null;

        if (!sanityPage) {
            return null;
        }

        // Compile MDX
        const { content } = await compileMDX({
            source: sanityPage.content || "",
            options: {
                parseFrontmatter: false,
                mdxOptions: {
                    remarkPlugins: [remarkGfm],
                    rehypePlugins: [
                        [
                            rehypePrettyCode,
                            {
                                theme: {
                                    dark: "github-dark",
                                    light: "github-light",
                                },
                                keepBackground: false,
                            },
                        ],
                    ],
                },
            },
            components: mdxComponents,
        });

        return {
            slug: sanityPage.slug.current,
            title: sanityPage.title,
            order: sanityPage.order,
            content,
        };
    }
}
