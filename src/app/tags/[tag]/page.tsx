import { notFound } from "next/navigation";

import { PostCard } from "~/src/components/blog/PostCard";
import { getContentProvider } from "~/src/lib/content";

const provider = getContentProvider();

export async function generateStaticParams() {
    const tags = await provider.getTags();
    return tags.map((tag) => ({
        tag: tag.name,
    }));
}

export async function generateMetadata({ params }: { params: Promise<{ tag: string }> }) {
    const { tag } = await params;
    const decodedTag = decodeURIComponent(tag);

    return {
        title: `Posts tagged "${decodedTag}" | Arcadia`,
        description: `Blog posts about ${decodedTag}`,
    };
}

export default async function TagPage({ params }: { params: Promise<{ tag: string }> }) {
    const { tag } = await params;
    const decodedTag = decodeURIComponent(tag);
    const posts = await provider.getPostsByTag(decodedTag);

    if (posts.length === 0) {
        notFound();
    }

    return (
        <div className="container mx-auto max-w-5xl px-4 py-12">
            <div className="mb-12 flex flex-col items-start gap-4">
                <h1 className="text-4xl font-bold tracking-tight break-words">
                    Tagged: <span className="text-primary">{decodedTag}</span>
                </h1>
                <p className="text-muted-foreground text-xl">
                    Found {posts.length} post{posts.length === 1 ? "" : "s"}.
                </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-2">
                {posts.map((post) => (
                    <PostCard key={post.slug} post={post} />
                ))}
            </div>
        </div>
    );
}
