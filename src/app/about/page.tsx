import Link from "next/link";
import { notFound } from "next/navigation";

import { ArticleBody } from "~/src/components/blog/ArticleBody";
import { Stack } from "~/src/components/ui/layout";
import { getContentProvider } from "~/src/lib/content";

async function getAboutContent() {
    const provider = getContentProvider();
    const post = await provider.getAboutPage();

    if (!post) {
        return null;
    }

    return post;
}

export async function generateMetadata() {
    const post = await getAboutContent();

    if (!post) {
        return {
            title: "关于 | Arcadia",
            description: "关于 Arcadia 博客",
        };
    }

    return {
        title: post.title ? `${post.title} | Arcadia` : "关于 | Arcadia",
        description: "关于 Arcadia 博客",
    };
}

export default async function AboutPage() {
    const post = await getAboutContent();

    if (!post) {
        notFound();
    }

    return (
        <div className="container mx-auto max-w-4xl px-4 py-12">
            <Stack gap="2rem">
                <Link
                    href="/"
                    className="text-muted-foreground hover:text-foreground border-border hover:border-foreground inline-flex items-center border px-3 py-1.5 font-mono text-sm transition-colors"
                >
                    ← 返回首页
                </Link>

                <ArticleBody>{post.content}</ArticleBody>
            </Stack>
        </div>
    );
}
