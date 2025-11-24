import { PostCard } from "@/components/blog/PostCard";
import { SearchWidget } from "@/components/blog/SearchWidget";
import { StatsWidget } from "@/components/blog/StatsWidget";
import { TagFilter } from "@/components/blog/TagFilter";
import { Grid, Stack } from "@/components/ui/layout";
import { LocalMarkdownProvider } from "@/lib/content/LocalMarkdownProvider";

export const revalidate = 600; // ISR: Revalidate every 10 minutes

const provider = new LocalMarkdownProvider();

export const metadata = {
    title: "博客 | Arcadia",
    description: "工程化思考、教程与更新。",
};

export default async function BlogIndexPage() {
    const posts = await provider.getPosts();
    const tags = await provider.getTags();

    return (
        <div className="container mx-auto max-w-screen-2xl px-4 py-12">
            {/* Page Header */}
            <Stack gap="1rem" className="mb-12">
                <h1 className="font-mono text-4xl font-bold tracking-tight">博客</h1>
                <p className="text-muted-foreground text-lg">工程化思考、技术教程与项目更新。</p>
            </Stack>

            {/* Three-Column Layout */}
            <Grid
                columns="300px 1fr 300px"
                gap="2rem"
                className="items-start"
                style={{ gridTemplateColumns: "minmax(250px, 300px) 1fr minmax(250px, 300px)" }}
            >
                {/* Left Sidebar: TagFilter */}
                <aside className="hidden lg:block">
                    <TagFilter tags={tags} />
                </aside>

                {/* Center: Post List */}
                <Stack gap="2rem">
                    {posts.map((post) => (
                        <PostCard key={post.slug} post={post} />
                    ))}
                </Stack>

                {/* Right Sidebar: Search + Stats */}
                <aside className="hidden lg:block">
                    <Stack gap="2rem">
                        <SearchWidget posts={posts} />
                        <StatsWidget totalPosts={posts.length} totalTags={tags.length} />
                    </Stack>
                </aside>
            </Grid>

            {/* Mobile: Filters and Stats below content */}
            <div className="mt-8 lg:hidden">
                <Stack gap="2rem">
                    <SearchWidget posts={posts} />
                    <TagFilter tags={tags} />
                    <StatsWidget totalPosts={posts.length} totalTags={tags.length} />
                </Stack>
            </div>
        </div>
    );
}
