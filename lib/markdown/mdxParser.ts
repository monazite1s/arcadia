import { compileMDX } from "next-mdx-remote/rsc";

import type { Element, Node, Root } from "hast";
import rehypePrettyCode from "rehype-pretty-code";
import remarkGfm from "remark-gfm";

import { Post } from "@/lib/types";

// 目录标题接口
export interface TOCHeading {
    id: string;
    text: string;
    level: number;
}

// 正则提取标题
function extractHeadings(source: string): TOCHeading[] {
    const headings: TOCHeading[] = [];
    const lines = source.split("\n");
    for (const line of lines) {
        const match = line.match(/^(#{2,3})\s+(.+)$/);
        if (match) {
            const level = match[1].length;
            const text = match[2].trim();
            const id = text
                .toLowerCase()
                .replace(/[^\w\u4e00-\u9fa5]+/g, "-")
                .replace(/^-+|-+$/g, "");
            headings.push({ id, text, level });
        }
    }
    return headings;
}

// Rehype plugin: 为标题添加 ID
function rehypeAddHeadingIds(headings: TOCHeading[]) {
    return (tree: Root) => {
        let idx = 0;
        const visit = (node: Node) => {
            if (!node) return;
            if (node.type === "element") {
                const el = node as Element;
                if ((el.tagName === "h2" || el.tagName === "h3") && idx < headings.length) {
                    el.properties = el.properties || {};
                    el.properties.id = headings[idx].id;
                    idx++;
                }
            }
            if ("children" in node) {
                (node as Element).children.forEach(visit);
            }
        };
        visit(tree);
    };
}

const components = {};

export async function parseMDX(source: string) {
    const headings = extractHeadings(source);
    const { content, frontmatter } = await compileMDX<Omit<Post, "content" | "slug">>({
        source,
        options: {
            parseFrontmatter: true,
            mdxOptions: {
                remarkPlugins: [remarkGfm],
                rehypePlugins: [
                    rehypeAddHeadingIds(headings),
                    [rehypePrettyCode, { theme: "github-dark" }],
                ],
            },
        },
        components,
    });

    return { content, frontmatter, headings };
}
