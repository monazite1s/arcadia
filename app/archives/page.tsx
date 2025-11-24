import Link from "next/link";

import { format } from "date-fns";

import { Card } from "@/components/ui/card";
import { Flex, Stack } from "@/components/ui/layout";
import { LocalMarkdownProvider } from "@/lib/content/LocalMarkdownProvider";

const provider = new LocalMarkdownProvider();

export const metadata = {
    title: "书橱 | Arcadia",
    description: "按时间线查看所有文章",
};

export default async function ArchivesPage() {
    const posts = await provider.getPosts();

    // Group posts by year
    const postsByYear = posts.reduce(
        (acc, post) => {
            const year = new Date(post.date).getFullYear();
            if (!acc[year]) {
                acc[year] = [];
            }
            acc[year].push(post);
            return acc;
        },
        {} as Record<number, typeof posts>
    );

    const years = Object.keys(postsByYear).sort((a, b) => Number(b) - Number(a));

    return (
        <div className="container mx-auto max-w-4xl px-4 py-12">
            <Stack gap="2rem">
                {/* Header */}
                <Stack gap="1rem">
                    <h1 className="font-mono text-4xl font-bold">书橱</h1>
                    <p className="text-muted-foreground text-lg">
                        共 {posts.length} 篇文章，按时间线排列
                    </p>
                </Stack>

                {/* Timeline */}
                <Stack gap="3rem" className="relative">
                    {/* Vertical Line */}
                    <div className="bg-border absolute top-0 bottom-0 left-[15px] w-0.5" />

                    {years.map((year) => (
                        <Stack key={year} gap="1.5rem">
                            {/* Year Header */}
                            <Flex align="center" gap="1rem" className="relative">
                                <div className="bg-primary border-background z-10 flex h-8 w-8 items-center justify-center rounded-full border-4">
                                    <div className="bg-background h-2 w-2 rounded-full" />
                                </div>
                                <h2 className="font-mono text-2xl font-bold">{year}</h2>
                            </Flex>

                            {/* Posts in this year */}
                            <Stack gap="1rem" className="ml-12">
                                {postsByYear[Number(year)].map((post) => (
                                    <Link key={post.slug} href={`/blog/${post.slug}`}>
                                        <Card className="khaki-card p-4 transition-all hover:shadow-lg">
                                            <Flex align="start" justify="between" gap="1rem">
                                                <Stack gap="0.5rem" className="flex-1">
                                                    <h3 className="hover:text-primary text-lg font-bold transition-colors">
                                                        {post.title}
                                                    </h3>
                                                    {post.excerpt && (
                                                        <p className="text-muted-foreground line-clamp-2 text-sm">
                                                            {post.excerpt}
                                                        </p>
                                                    )}
                                                    <Flex gap="0.5rem" className="flex-wrap">
                                                        {post.tags.map((tag) => (
                                                            <span
                                                                key={tag}
                                                                className="bg-primary/10 text-primary border-primary/20 rounded border px-2 py-0.5 text-xs"
                                                            >
                                                                {tag}
                                                            </span>
                                                        ))}
                                                    </Flex>
                                                </Stack>
                                                <time className="text-muted-foreground font-mono text-sm whitespace-nowrap">
                                                    {format(new Date(post.date), "MM-dd")}
                                                </time>
                                            </Flex>
                                        </Card>
                                    </Link>
                                ))}
                            </Stack>
                        </Stack>
                    ))}
                </Stack>
            </Stack>
        </div>
    );
}
