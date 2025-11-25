import React from "react";

import { compileMDX } from "next-mdx-remote/rsc";

import type { MDXComponents } from "mdx/types";
import rehypePrettyCode from "rehype-pretty-code";
import remarkGfm from "remark-gfm";
import { Alert, Callout, CodeSandbox, Tweet, YouTube } from "~/src/components/mdx/MDXComponents";
import { Post, Tag } from "~/src/lib/types";
import type { SanityPost, SanityPostListItem } from "~/src/lib/types/sanityTypes";
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

        // @ts-expect-error - GROQ query type inference issue with next-sanity
        const posts = (await client.fetch(
            query,
            { tag },
            { next: { revalidate: 30 } }
        )) as SanityPostListItem[];

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
}
