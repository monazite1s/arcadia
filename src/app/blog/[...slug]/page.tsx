import Link from "next/link";
import { notFound } from "next/navigation";

import { format } from "date-fns";
import { ArticleBody } from "~/src/components/blog/ArticleBody";
import { SeriesSidebar } from "~/src/components/blog/SeriesSidebar";
import { TableOfContents } from "~/src/components/blog/TableOfContents";
import { Flex, Stack } from "~/src/components/ui/layout";
import { LocalMarkdownProvider } from "~/src/lib/content/LocalMarkdownProvider";

const provider = new LocalMarkdownProvider();

// SSG
export async function generateStaticParams() {
    const posts = await provider.getPosts();
    return posts.map((post) => ({
        slug: post.slug.split("/"),
    }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string[] }> }) {
    const { slug } = await params;
    const slugStr = slug.join("/");
    const post = await provider.getPostBySlug(slugStr);

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

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string[] }> }) {
    const { slug } = await params;
    const slugStr = slug.join("/");
    const post = await provider.getPostBySlug(slugStr);

    if (!post) {
        notFound();
    }

    // Get series posts if this post belongs to a series
    const seriesPosts = post.series
        ? (await provider.getPosts())
              .filter((p) => p.series === post.series)
              .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
        : [];

    const hasSeries = seriesPosts.length > 0;

    return (
        <div className="container mx-auto max-w-screen-xl px-4 py-12">
            {/* Dynamic Layout: Three columns if series, two columns otherwise */}
            <div
                className={`grid items-start gap-6 ${
                    hasSeries ? "lg:grid-cols-[250px_1fr_250px]" : "lg:grid-cols-[1fr_300px]"
                }`}
            >
                {/* Left Sidebar: Series (only if exists) */}
                {hasSeries && (
                    <aside className="sticky top-20 hidden lg:block">
                        <SeriesSidebar currentPost={post} seriesPosts={seriesPosts} />
                    </aside>
                )}

                {/* Main Content */}
                <Stack
                    gap="1rem"
                    className={hasSeries ? "min-w-[660px]" : "max-w-[800px] min-w-[660px]"}
                >
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
                            {post.series && (
                                <>
                                    <span>•</span>
                                    <span className="text-primary">📚 {post.series}</span>
                                </>
                            )}
                        </Flex>
                    </Stack>

                    <div className="bg-border h-px" />

                    <ArticleBody>{post.content}</ArticleBody>
                </Stack>

                {/* Right Sidebar: TOC */}
                <aside className="sticky top-20 hidden lg:block">
                    <TableOfContents />
                </aside>
            </div>
        </div>
    );
}
