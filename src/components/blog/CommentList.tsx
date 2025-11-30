"use client";
import { Stack } from "~/src/components/ui/layout";
import { Comment } from "~/src/lib/types";

import { CommentItem } from "./CommentItem";

interface CommentListProps {
    comments: Comment[];
    postSlug: string;
    onUpdate: () => void;
}
/**
 * 评论列表组件
 * 显示所有顶层评论
 */
export function CommentList({ comments, postSlug, onUpdate }: CommentListProps) {
    if (comments.length === 0) {
        return (
            <div className="text-muted-foreground text-center text-sm">
                还没有评论,来发表第一条吧!
            </div>
        );
    }
    return (
        <Stack gap="1.5rem">
            {comments.map((comment) => (
                <CommentItem
                    key={comment.id}
                    comment={comment}
                    postSlug={postSlug}
                    onUpdate={onUpdate}
                />
            ))}
        </Stack>
    );
}
