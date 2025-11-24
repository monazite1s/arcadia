import { PostCard } from "@/components/blog/PostCard";
import { SearchWidget } from "@/components/blog/SearchWidget";
import { StatsWidget } from "@/components/blog/StatsWidget";
import { TagFilter } from "@/components/blog/TagFilter";
import { Stack } from "@/components/ui/layout";
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
            {/* Three-Column Layout */}
            <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-[300px_1fr_300px]">
                {/* Left Sidebar: TagFilter */}
                <aside className="sticky top-20 hidden lg:block">
                    <TagFilter tags={tags} />
                </aside>

                {/* Center: Post List */}
                <Stack gap="2rem">
                    {posts.map((post) => (
                        <PostCard key={post.slug} post={post} />
                    ))}
                </Stack>

                {/* Right Sidebar: Search + Stats */}
                <aside className="sticky top-20 hidden lg:block">
                    <Stack gap="2rem">
                        <SearchWidget posts={posts} />
                        <StatsWidget totalPosts={posts.length} totalTags={tags.length} />
                    </Stack>
                </aside>
            </div>

            {/* Mobile: Filters and Stats below content */}
            <div className="mt-8 w-full lg:hidden">
                <Stack gap="2rem" className="w-full">
                    <div className="w-full">
                        <SearchWidget posts={posts} />
                    </div>
                    <div className="w-full">
                        <TagFilter tags={tags} />
                    </div>
                    <div className="w-full">
                        <StatsWidget totalPosts={posts.length} totalTags={tags.length} />
                    </div>
                </Stack>
            </div>
        </div>
    );
}
