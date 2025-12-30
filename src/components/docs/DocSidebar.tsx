"use client";

import { useState } from "react";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { ChevronDown, ChevronRight } from "lucide-react";
import { Stack } from "~/src/components/ui/layout";
import type { DocCategory } from "~/src/lib/types";
import { cn } from "~/src/lib/utils";

interface DocSidebarProps {
    docTree: DocCategory[];
}

/**
 * 知识库侧边栏组件
 * 支持多级嵌套可折叠菜单
 * 使用横线分隔而非 border
 */
export function DocSidebar({ docTree }: DocSidebarProps) {
    const pathname = usePathname();

    return (
        <div className="sticky top-24 max-h-[calc(100vh-6rem)] self-start overflow-y-auto pr-3">
            <div className="py-4">
                <h3 className="text-foreground mb-4 font-mono text-sm font-bold">知识库目录</h3>
                <Stack gap="0">
                    {docTree.map((category) => (
                        <CategoryItem
                            key={category.slug}
                            category={category}
                            currentPath={pathname}
                            level={0}
                        />
                    ))}
                </Stack>
            </div>
        </div>
    );
}

interface CategoryItemProps {
    category: DocCategory;
    currentPath: string;
    level: number;
}

function CategoryItem({ category, currentPath, level }: CategoryItemProps) {
    const hasChildren = (category.children && category.children.length > 0) || false;
    const hasPages = (category.pages && category.pages.length > 0) || false;
    const [isOpen, setIsOpen] = useState(true);

    return (
        <div className="w-full">
            {/* 分类标题 */}
            <div
                className={cn(
                    "group flex cursor-pointer items-center gap-2 py-2 text-sm transition-colors",
                    level === 0 ? "pl-0" : `pl-${level * 4}`
                )}
                onClick={() => setIsOpen(!isOpen)}
            >
                <span className="text-foreground font-medium">{category.title}</span>
                {(hasChildren || hasPages) && (
                    <span className="text-muted-foreground">
                        {isOpen ? (
                            <ChevronDown className="h-4 w-4" />
                        ) : (
                            <ChevronRight className="h-4 w-4" />
                        )}
                    </span>
                )}
            </div>

            {/* 子分类和页面 */}
            {isOpen && (
                <div className="ml-2">
                    {/* 子分类 */}
                    {hasChildren &&
                        category.children!.map((child) => (
                            <CategoryItem
                                key={child.slug}
                                category={child}
                                currentPath={currentPath}
                                level={level + 1}
                            />
                        ))}

                    {/* 页面列表 */}
                    {hasPages && (
                        <Stack
                            gap="0"
                            className={cn(level === 0 ? "pl-2" : `pl-${(level + 1) * 2}`)}
                        >
                            {category.pages!.map((page) => {
                                const pagePath = `/docs/${page.slug}`;
                                const isActive = currentPath === pagePath;

                                return (
                                    <Link
                                        key={page.slug}
                                        href={pagePath}
                                        className={cn(
                                            "block py-1.5 pl-6 text-sm transition-colors",
                                            "border-l-2",
                                            isActive
                                                ? "border-primary text-primary font-medium"
                                                : "text-muted-foreground hover:text-foreground border-transparent"
                                        )}
                                    >
                                        {page.title}
                                    </Link>
                                );
                            })}
                        </Stack>
                    )}

                    {/* 分隔线 */}
                    {(hasChildren || hasPages) && <div className="bg-border my-2 h-px" />}
                </div>
            )}
        </div>
    );
}
