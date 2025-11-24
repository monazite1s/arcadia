import fs from "fs";
import path from "path";

import { parseMDX } from "@/lib/markdown/mdxParser";
import { Post, Tag } from "@/lib/types";

import { ContentProvider } from "./ContentProvider";

const POSTS_PATH = path.join(process.cwd(), "content/posts");

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
}
