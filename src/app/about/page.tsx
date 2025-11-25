import Link from "next/link";

import fs from "fs/promises";
import path from "path";
import { ArticleBody } from "~/src/components/blog/ArticleBody";
import { Stack } from "~/src/components/ui/layout";
import { parseMDX } from "~/src/lib/markdown/mdxParser";

const ABOUT_FILE_PATH = path.join(process.cwd(), "src/content/about/about.mdx");

async function getAboutContent() {
    const source = await fs.readFile(ABOUT_FILE_PATH, "utf8");
    return parseMDX(source);
}

export async function generateMetadata() {
    const { frontmatter } = await getAboutContent();
    return {
        title: frontmatter.title ? `${frontmatter.title} | Arcadia` : "关于 | Arcadia",
        description: frontmatter.excerpt ?? "关于 Arcadia 博客",
    };
}

export default async function AboutPage() {
    const { content } = await getAboutContent();

    return (
        <div className="container mx-auto max-w-4xl px-4 py-12">
            <Stack gap="2rem">
                <Link
                    href="/"
                    className="text-muted-foreground hover:text-foreground border-border hover:border-foreground inline-flex items-center border px-3 py-1.5 font-mono text-sm transition-colors"
                >
                    ← 返回首页
                </Link>

                <ArticleBody>{content}</ArticleBody>
            </Stack>
        </div>
    );
}
