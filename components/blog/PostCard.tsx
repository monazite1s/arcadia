import Link from "next/link";

import { format } from "date-fns";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Flex, Stack } from "@/components/ui/layout";
import { Post } from "@/lib/types";

interface PostCardProps {
    post: Post;
}

export function PostCard({ post }: PostCardProps) {
    return (
        <Link href={`/blog/${post.slug}`} className="block">
            <Card className="khaki-card h-full">
                <CardHeader className="p-5 pb-3">
                    <Stack gap="0.75rem">
                        {/* Date and Tags */}
                        <Flex
                            gap="0.75rem"
                            align="center"
                            className="text-muted-foreground text-xs"
                        >
                            <time dateTime={post.date} className="font-medium">
                                {format(new Date(post.date), "yyyy/MM/dd")}
                            </time>
                            <span>·</span>
                            <Flex gap="0.5rem" wrap="wrap">
                                {post.tags.slice(0, 3).map((tag) => (
                                    <span
                                        key={tag}
                                        className="bg-primary/10 text-primary border-primary/20 rounded border px-2 py-0.5 font-medium"
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </Flex>
                        </Flex>

                        {/* Title */}
                        <h3 className="text-foreground group-hover:text-primary line-clamp-2 text-xl font-bold transition-colors">
                            {post.title}
                        </h3>
                    </Stack>
                </CardHeader>

                {post.excerpt && (
                    <CardContent className="p-5 pt-0">
                        <p className="text-muted-foreground line-clamp-3 text-sm leading-relaxed">
                            {post.excerpt}
                        </p>
                    </CardContent>
                )}
            </Card>
        </Link>
    );
}
