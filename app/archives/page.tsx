import Link from "next/link";

import { format } from "date-fns";

import { Flex, Stack } from "@/components/ui/layout";
import { LocalMarkdownProvider } from "@/lib/content/LocalMarkdownProvider";

const provider = new LocalMarkdownProvider();

export const metadata = {
    title: "书橱 | Arcadia",
    description: "按时间线查看所有文章",
};

export default async function ArchivesPage() {
    const posts = await provider.getPosts();

    // Group posts by Year -> Month
    const postsByDate = posts.reduce(
        (acc, post) => {
            const date = new Date(post.date);
            const year = date.getFullYear();
            const month = date.getMonth() + 1; // 1-12

            if (!acc[year]) {
                acc[year] = {};
            }
            if (!acc[year][month]) {
                acc[year][month] = [];
            }
            acc[year][month].push(post);
            return acc;
        },
        {} as Record<number, Record<number, typeof posts>>
    );

    const years = Object.keys(postsByDate)
        .map(Number)
        .sort((a, b) => b - a);

    return (
        <div className="container mx-auto max-w-4xl px-4 py-12">
            <Stack gap="1rem">
                {/* Header */}
                <Stack gap="1rem">
                    <h1 className="font-mono text-4xl font-bold">书橱</h1>
                    <p className="text-muted-foreground text-lg">
                        共 {posts.length} 篇文章，按时间线排列
                    </p>
                </Stack>

                {/* Timeline Container */}
                <div className="relative pl-8">
                    {/* Simple Vertical Line */}
                    <div className="bg-primary absolute top-0 bottom-0 left-2 w-0.5" />

                    <Stack gap="1rem">
                        {years.map((year) => {
                            const months = Object.keys(postsByDate[year])
                                .map(Number)
                                .sort((a, b) => b - a);

                            return (
                                <div key={year}>
                                    {/* Year Header */}
                                    <h2 className="text-foreground mb-4 font-mono text-3xl font-bold">
                                        {year}
                                    </h2>

                                    <Stack gap="1rem">
                                        {months.map((month) => (
                                            <div key={`${year}-${month}`}>
                                                {/* Month Header */}
                                                <h3 className="text-muted-foreground mb-2 font-mono text-lg font-semibold">
                                                    {month}月
                                                </h3>

                                                {/* Articles List */}
                                                <Stack gap="0.5rem">
                                                    {postsByDate[year][month].map((post) => (
                                                        <Link
                                                            key={post.slug}
                                                            href={`/blog/${post.slug}`}
                                                            className="group block"
                                                        >
                                                            <div className="hover:bg-muted/30 rounded-md px-3 py-2 transition-colors">
                                                                <Flex
                                                                    align="baseline"
                                                                    gap="0.75rem"
                                                                >
                                                                    <span className="text-muted-foreground font-mono text-xs">
                                                                        {format(
                                                                            new Date(post.date),
                                                                            "MM-dd"
                                                                        )}
                                                                    </span>
                                                                    <span className="group-hover:text-primary font-medium transition-colors">
                                                                        {post.title}
                                                                    </span>
                                                                </Flex>
                                                            </div>
                                                        </Link>
                                                    ))}
                                                </Stack>
                                            </div>
                                        ))}
                                    </Stack>
                                </div>
                            );
                        })}
                    </Stack>
                </div>
            </Stack>
        </div>
    );
}
