import Link from "next/link";

import { DocSidebar } from "~/src/components/docs/DocSidebar";
import { Stack } from "~/src/components/ui/layout";
import { getContentProvider } from "~/src/lib/content";

const provider = getContentProvider();

export const metadata = {
    title: "知识库 | Arcadia",
    description: "前端系统性知识总结,技术文档库",
};

/**
 * 知识库首页
 * 显示所有分类和页面的索引
 */
export default async function DocsIndexPage() {
    const docTree = await provider.getDocTree();

    // 如果没有文档,显示空状态
    if (docTree.length === 0) {
        return (
            <div className="max-w-screen2xl container mx-auto px-4 py-12">
                <Stack gap="2rem">
                    <Stack gap="1rem">
                        <h1 className="font-mono text-4xl font-bold tracking-tight">知识库</h1>
                        <p className="text-muted-foreground text-lg">
                            前端系统性知识总结,技术文档库
                        </p>
                    </Stack>

                    <div className="bg-muted/50 rounded-lg p-12 text-center">
                        <p className="text-muted-foreground text-lg">
                            知识库内容正在整理中,敬请期待...
                        </p>
                    </div>
                </Stack>
            </div>
        );
    }

    // 收集所有页面用于首页展示
    const allPages: Array<{
        title: string;
        slug: string;
        categoryTitle: string;
        categorySlug: string;
    }> = [];

    function collectPages(categories: typeof docTree, parentTitle?: string) {
        categories.forEach((category) => {
            const catTitle = parentTitle ? `${parentTitle} / ${category.title}` : category.title;

            // 添加该分类下的页面
            if (category.pages) {
                category.pages.forEach((page) => {
                    allPages.push({
                        title: page.title,
                        slug: page.slug,
                        categoryTitle: catTitle,
                        categorySlug: category.slug,
                    });
                });
            }

            // 递归处理子分类
            if (category.children) {
                collectPages(category.children, catTitle);
            }
        });
    }

    collectPages(docTree);

    return (
        <div className="container mx-auto max-w-screen-2xl px-4 py-12">
            {/* Three-Column Layout */}
            <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[300px_1fr_300px]">
                {/* Left Sidebar: DocTree */}
                <aside className="sticky top-20 hidden lg:block">
                    <DocSidebar docTree={docTree} />
                </aside>

                {/* Center: Page Index */}
                <Stack gap="2rem">
                    <Stack gap="1rem">
                        <h1 className="font-mono text-4xl font-bold tracking-tight">知识库</h1>
                        <p className="text-muted-foreground text-lg">
                            前端系统性知识总结,技术文档库
                        </p>
                    </Stack>

                    <div className="bg-border h-px" />

                    <Stack gap="1.5rem">
                        <h2 className="font-mono text-2xl font-bold">所有文档</h2>
                        <div className="grid gap-4">
                            {allPages.map((page) => (
                                <Link
                                    key={page.slug}
                                    href={`/docs/${page.slug}`}
                                    className="border-border hover:border-foreground bg-card hover:bg-muted/50 group block border-l-2 px-4 py-3 transition-colors"
                                >
                                    <h3 className="text-foreground mb-1 font-medium">
                                        {page.title}
                                    </h3>
                                    <p className="text-muted-foreground text-sm">
                                        {page.categoryTitle}
                                    </p>
                                </Link>
                            ))}
                        </div>
                    </Stack>
                </Stack>

                {/* Right Sidebar: Empty placeholder */}
                <aside className="sticky top-20 hidden lg:block">
                    <div />
                </aside>
            </div>
        </div>
    );
}
