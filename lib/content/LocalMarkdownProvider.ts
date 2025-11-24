import fs from "fs";
import path from "path";

import { parseMDX } from "@/lib/markdown/mdxParser";
import { Post, Tag } from "@/lib/types";

import { ContentProvider } from "./ContentProvider";

const POSTS_PATH = path.join(process.cwd(), "content/posts");

export class LocalMarkdownProvider implements ContentProvider {
    async getPosts(): Promise<Post[]> {
        if (!fs.existsSync(POSTS_PATH)) {
            return [];
        }

        const files = fs.readdirSync(POSTS_PATH).filter((file) => file.endsWith(".mdx"));

        const posts = await Promise.all(
            files.map(async (file) => {
                const filePath = path.join(POSTS_PATH, file);
                const source = fs.readFileSync(filePath, "utf8");
                const { frontmatter, content } = await parseMDX(source);
                const slug = file.replace(/\.mdx$/, "");

                return {
                    slug,
                    title: frontmatter.title as string,
                    date: frontmatter.date as string,
                    tags: (frontmatter.tags as string[]) || [],
                    excerpt: frontmatter.excerpt as string,
                    content: content, // ReactNode
                };
            })
        );

        return posts.sort((a, b) => (new Date(a.date) > new Date(b.date) ? -1 : 1));
    }

    async getPostBySlug(slug: string): Promise<Post | null> {
        const filePath = path.join(POSTS_PATH, `${slug}.mdx`);

        if (!fs.existsSync(filePath)) {
            return null;
        }

        const source = fs.readFileSync(filePath, "utf8");
        const { frontmatter, content } = await parseMDX(source);

        return {
            slug,
            title: frontmatter.title as string,
            date: frontmatter.date as string,
            tags: (frontmatter.tags as string[]) || [],
            excerpt: frontmatter.excerpt as string,
            content: content,
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
