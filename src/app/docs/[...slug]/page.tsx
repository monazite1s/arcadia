import Link from "next/link";
import { notFound } from "next/navigation";

import { DocContent } from "~/src/components/docs/DocContent";
import { DocSidebar } from "~/src/components/docs/DocSidebar";
import { DocTOC } from "~/src/components/docs/DocTOC";
import { Stack } from "~/src/components/ui/layout";
import { getContentProvider } from "~/src/lib/content";

const provider = getContentProvider();

// SSG: Generate static pages for all docs
export async function generateStaticParams() {
    const docTree = await provider.getDocTree();
    const slugs: string[] = [];

    function collectSlugs(categories: typeof docTree) {
        categories.forEach((category) => {
            if (category.pages) {
                category.pages.forEach((page) => {
                    slugs.push(page.slug);
                });
            }
            if (category.children) {
                collectSlugs(category.children);
            }
        });
    }

    collectSlugs(docTree);

    return slugs.map((slug) => ({
        slug: slug.split("/"),
    }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string[] }> }) {
    const { slug } = await params;
    const slugStr = slug.join("/");
    const page = await provider.getDocPageBySlug(slugStr);

    if (!page) {
        return {
            title: "文档未找到 | Arcadia",
        };
    }

    return {
        title: `${page.title} | 知识库 | Arcadia`,
        description: `知识库文档: ${page.title}`,
    };
}

export default async function DocPageDetail({ params }: { params: Promise<{ slug: string[] }> }) {
    const { slug } = await params;
    const slugStr = slug.join("/");
    const page = await provider.getDocPageBySlug(slugStr);

    if (!page) {
        notFound();
    }

    // Get the full doc tree for sidebar
    const docTree = await provider.getDocTree();

    return (
        <div className="container mx-auto max-w-screen-2xl px-4 py-12">
            {/* Fixed Grid Layout - Three Columns */}
            <div className="grid grid-cols-[300px_1fr_300px] items-start gap-6">
                {/* Left Sidebar: Doc Tree */}
                <aside className="sticky top-20 hidden lg:block">
                    <DocSidebar docTree={docTree} />
                </aside>

                {/* Main Content */}
                <Stack gap="1rem" className="mx-auto w-full max-w-[1000px]">
                    <Link
                        href="/docs"
                        className="text-muted-foreground hover:text-foreground border-border hover:border-foreground inline-flex items-center border px-3 py-1.5 font-mono text-sm transition-colors"
                    >
                        ← 返回知识库
                    </Link>

                    <Stack gap="1rem">
                        <h1 className="font-mono text-4xl font-bold tracking-tight">
                            {page.title}
                        </h1>
                    </Stack>

                    <div className="bg-border h-px" />

                    <DocContent>{page.content}</DocContent>
                </Stack>

                {/* Right Sidebar: TOC */}
                <aside className="sticky top-20 hidden lg:block">
                    <DocTOC />
                </aside>
            </div>
        </div>
    );
}
