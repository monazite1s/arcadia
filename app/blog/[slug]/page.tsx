import Link from "next/link";
import { notFound } from "next/navigation";

import { format } from "date-fns";

import { ArticleBody } from "@/components/blog/ArticleBody";
import { TableOfContents } from "@/components/blog/TableOfContents";
import { Flex, Grid, Stack } from "@/components/ui/layout";
import { LocalMarkdownProvider } from "@/lib/content/LocalMarkdownProvider";

const provider = new LocalMarkdownProvider();

export async function generateStaticParams() {
    const posts = await provider.getPosts();
    return posts.map((post) => ({
        slug: post.slug,
    }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const post = await provider.getPostBySlug(slug);

    if (!post) {
        return {
            title: "文章未找到 | Arcadia",
        };
    }

    return {
        title: `${post.title} | Arcadia`,
        description: post.excerpt,
    };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const post = await provider.getPostBySlug(slug);

    if (!post) {
        notFound();
    }

    return (
        <div className="container mx-auto max-w-screen-xl px-4 py-12">
            {/* Two-Column Layout */}
            <Grid
                columns="1fr 300px"
                gap="3rem"
                className="items-start justify-center"
                style={{ gridTemplateColumns: "minmax(0, 800px) minmax(250px, 300px)" }}
            >
                {/* Main Content */}
                <Stack gap="2rem">
                    <Link
                        href="/blog"
                        className="text-muted-foreground hover:text-foreground border-border hover:border-foreground inline-flex items-center border px-3 py-1.5 font-mono text-sm transition-colors"
                    >
                        ← 返回博客
                    </Link>

                    <Stack gap="1rem">
                        <h1 className="font-mono text-4xl font-bold tracking-tight">
                            {post.title}
                        </h1>
                        <Flex
                            gap="1rem"
                            align="center"
                            className="text-muted-foreground font-mono text-sm"
                        >
                            <time dateTime={post.date}>
                                {format(new Date(post.date), "yyyy-MM-dd")}
                            </time>
                            <span>•</span>
                            <Flex gap="0.5rem">
                                {post.tags.map((tag) => (
                                    <Link
                                        key={tag}
                                        href={`/tags/${tag}`}
                                        className="border-border hover:border-foreground border px-2 py-0.5 transition-colors"
                                    >
                                        #{tag}
                                    </Link>
                                ))}
                            </Flex>
                        </Flex>
                    </Stack>

                    <div className="bg-border h-px" />

                    <ArticleBody>{post.content}</ArticleBody>
                </Stack>

                {/* Right Sidebar: TOC */}
                <aside className="hidden lg:block">
                    <TableOfContents />
                </aside>
            </Grid>
        </div>
    );
}
