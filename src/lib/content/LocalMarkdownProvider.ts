import React from "react";

import fs from "fs";
import path from "path";
import { parseMDX } from "~/src/lib/markdown/mdxParser";
import { About, DocCategory, DocPage, Post, Tag } from "~/src/lib/types";

import { ContentProvider } from "./ContentProvider";

const POSTS_PATH = path.join(process.cwd(), "src/content/posts");
const DOCS_PATH = path.join(process.cwd(), "src/content/docs");

/**
 * 递归遍历目录，获取所有 mdx 文件的完整路径
 */
function walkMdxFiles(dir: string, baseDir = dir): string[] {
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    let mdxFiles: string[] = [];

    for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);

        if (entry.isDirectory()) {
            mdxFiles = mdxFiles.concat(walkMdxFiles(fullPath, baseDir));
        } else if (entry.isFile() && entry.name.endsWith(".mdx")) {
            // 保存相对于 baseDir 的路径
            mdxFiles.push(path.relative(baseDir, fullPath));
        }
    }
    return mdxFiles;
}

export class LocalMarkdownProvider implements ContentProvider {
    /**
     * 多级目录下读取所有 MDX
     */
    async getPosts(): Promise<Post[]> {
        if (!fs.existsSync(POSTS_PATH)) return [];

        // 获取所有子目录的 mdx 路径
        const files = walkMdxFiles(POSTS_PATH);
        // files 示例：
        // [
        //   "2024/jan/post-a.mdx",
        //   "react/hooks/useMemo.mdx"
        // ]

        const posts = await Promise.all(
            files.map(async (relativePath) => {
                const filePath = path.join(POSTS_PATH, relativePath);
                const source = fs.readFileSync(filePath, "utf8");
                const { frontmatter, content } = await parseMDX(source);

                // slug = 不含 .mdx 的相对路径（带多级目录）
                const slug = relativePath.replace(/\.mdx$/, "");

                return {
                    slug, // "react/hooks/useMemo"
                    title: frontmatter.title,
                    date: frontmatter.date,
                    tags: frontmatter.tags || [],
                    excerpt: frontmatter.excerpt,
                    series: frontmatter.series,
                    content,
                };
            })
        );

        return posts.sort((a, b) => (new Date(a.date) > new Date(b.date) ? -1 : 1));
    }

    /**
     * 根据多级目录 slug 获取文章
     * slug 如：react/hooks/useMemo
     */
    async getPostBySlug(slug: string): Promise<Post | null> {
        const filePath = path.join(POSTS_PATH, `${slug}.mdx`);

        if (!fs.existsSync(filePath)) return null;

        const source = fs.readFileSync(filePath, "utf8");
        const { frontmatter, content } = await parseMDX(source);

        return {
            slug,
            title: frontmatter.title,
            date: frontmatter.date,
            tags: frontmatter.tags || [],
            excerpt: frontmatter.excerpt,
            series: frontmatter.series,
            content,
        };
    }

    async getTags(): Promise<Tag[]> {
        const posts = await this.getPosts();
        const tagMap = new Map<string, number>();

        posts.forEach((post) => {
            post.tags.forEach((tag) => {
                tagMap.set(tag, (tagMap.get(tag) || 0) + 1);
            });
        });

        return Array.from(tagMap.entries()).map(([name, count]) => ({ name, count }));
    }

    async getPostsByTag(tag: string): Promise<Post[]> {
        const posts = await this.getPosts();
        return posts.filter((post) => post.tags.includes(tag));
    }

    async getAboutPage(): Promise<About | null> {
        const aboutPath = path.join(process.cwd(), "src/content/about/about.mdx");
        if (!fs.existsSync(aboutPath)) return null;

        const source = fs.readFileSync(aboutPath, "utf8");
        const { frontmatter, content } = await parseMDX(source);

        return {
            slug: "about",
            title: frontmatter.title,
            content,
        };
    }

    /**
     * 获取文档树结构
     * 从本地 src/content/docs/ 目录读取
     * 使用 _meta.json 文件定义分类元数据
     */
    async getDocTree(): Promise<DocCategory[]> {
        if (!fs.existsSync(DOCS_PATH)) {
            return [];
        }

        return this.buildDocTree(DOCS_PATH);
    }

    /**
     * 递归构建文档树
     */
    private buildDocTree(dirPath: string, parentSlug = ""): DocCategory[] {
        const entries = fs.readdirSync(dirPath, { withFileTypes: true });
        const categories: DocCategory[] = [];

        // 读取当前目录的 _meta.json（如果存在）
        const metaPath = path.join(dirPath, "_meta.json");
        let metaConfig: Record<string, { title?: string; order?: number; children?: string[] }> =
            {};

        if (fs.existsSync(metaPath)) {
            const metaContent = fs.readFileSync(metaPath, "utf8");
            metaConfig = JSON.parse(metaContent);
        }

        // 收集所有子目录（分类）和 mdx 文件（页面）
        const subDirs: string[] = [];
        const mdxFiles: string[] = [];

        entries.forEach((entry) => {
            if (entry.isDirectory() && !entry.name.startsWith("_")) {
                subDirs.push(entry.name);
            } else if (entry.isFile() && entry.name.endsWith(".mdx")) {
                mdxFiles.push(entry.name);
            }
        });

        // 为每个子目录创建分类
        subDirs.forEach((dirName) => {
            const categorySlug = parentSlug ? `${parentSlug}/${dirName}` : dirName;
            const categoryPath = path.join(dirPath, dirName);
            const meta = metaConfig[dirName] || {};

            const category: DocCategory = {
                title: meta.title || dirName,
                slug: categorySlug,
                order: meta.order || 999,
                children: this.buildDocTree(categoryPath, categorySlug),
                pages: [],
            };

            // 读取该分类下的页面
            const categoryEntries = fs.readdirSync(categoryPath, { withFileTypes: true });
            const categoryPages: DocPage[] = [];

            categoryEntries.forEach((entry) => {
                if (entry.isFile() && entry.name.endsWith(".mdx")) {
                    const pageSlug = entry.name.replace(/\.mdx$/, "");
                    const fullSlug = `${categorySlug}/${pageSlug}`;
                    const pageMeta = metaConfig[pageSlug] || {};

                    categoryPages.push({
                        slug: fullSlug,
                        title: pageMeta.title || pageSlug,
                        order: pageMeta.order || 999,
                        content: React.createElement(React.Fragment), // 树结构不需要完整内容
                    });
                }
            });

            category.pages = categoryPages.sort((a, b) => a.order - b.order);
            categories.push(category);
        });

        // 当前目录的直接页面（根级页面）
        if (parentSlug === "" && mdxFiles.length > 0) {
            mdxFiles.forEach((fileName) => {
                const pageSlug = fileName.replace(/\.mdx$/, "");
                const meta = metaConfig[pageSlug] || {};

                // 根级页面作为独立分类
                const rootCategory: DocCategory = {
                    title: meta.title || pageSlug,
                    slug: pageSlug,
                    order: meta.order || 999,
                    pages: [
                        {
                            slug: pageSlug,
                            title: meta.title || pageSlug,
                            order: 1,
                            content: React.createElement(React.Fragment),
                        },
                    ],
                };
                categories.push(rootCategory);
            });
        }

        return categories.sort((a, b) => a.order - b.order);
    }

    /**
     * 根据 slug 获取文档页面
     * slug 格式：category/subcategory/page 或 page
     */
    async getDocPageBySlug(slug: string): Promise<DocPage | null> {
        // 构建文件路径
        const filePath = path.join(DOCS_PATH, `${slug}.mdx`);

        if (!fs.existsSync(filePath)) {
            return null;
        }

        const source = fs.readFileSync(filePath, "utf8");
        const { frontmatter, content } = await parseMDX(source);

        return {
            slug,
            title: frontmatter.title || slug.split("/").pop() || slug,
            order: (frontmatter as any).order || 999, // eslint-disable-line @typescript-eslint/no-explicit-any
            content,
        };
    }
}
