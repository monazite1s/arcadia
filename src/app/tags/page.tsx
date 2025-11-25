import Link from "next/link";

import { Card } from "~/src/components/ui/card";
import { Grid, Stack } from "~/src/components/ui/layout";
import { LocalMarkdownProvider } from "~/src/lib/content/LocalMarkdownProvider";

const provider = new LocalMarkdownProvider();

export const metadata = {
    title: "标签 | Arcadia",
    description: "按标签浏览文章",
};

export default async function TagsPage() {
    const tags = await provider.getTags();
    const posts = await provider.getPosts();

    return (
        <div className="container mx-auto max-w-5xl px-4 py-12">
            <Stack gap="2rem">
                {/* Header */}
                <Stack gap="1rem">
                    <h1 className="font-mono text-4xl font-bold">标签</h1>
                    <p className="text-muted-foreground text-lg">
                        共 {tags.length} 个标签，{posts.length} 篇文章
                    </p>
                </Stack>

                {/* Tags Grid */}
                <Grid columns={3} gap="1.5rem" className="md:grid-cols-4 lg:grid-cols-5">
                    {tags.map((tag) => (
                        <Link key={tag.name} href={`/tags/${tag.name}`}>
                            <Card className="khaki-card p-4 text-center transition-all hover:shadow-lg">
                                <Stack gap="0.5rem">
                                    <div className="text-primary font-mono text-2xl font-bold">
                                        {tag.count}
                                    </div>
                                    <div className="text-sm font-medium">#{tag.name}</div>
                                </Stack>
                            </Card>
                        </Link>
                    ))}
                </Grid>
            </Stack>
        </div>
    );
}
