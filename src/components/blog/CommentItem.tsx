"use client";

import { useState } from "react";

import { useSession } from "next-auth/react";

import { formatDistanceToNow } from "date-fns";
import { zhCN } from "date-fns/locale";
import { Avatar } from "~/src/components/ui/Avatar";
import { Button } from "~/src/components/ui/button";
import { Stack } from "~/src/components/ui/layout";
import { Comment } from "~/src/lib/types";

import { CommentForm } from "./CommentForm";

interface CommentItemProps {
    comment: Comment;
    postSlug: string;
    onUpdate: () => void;
}

/**
 * 单条评论组件
 * 支持回复和删除
 */
export function CommentItem({ comment, postSlug, onUpdate }: CommentItemProps) {
    const { data: session } = useSession();
    const [isReplying, setIsReplying] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const isOwner = session?.user?.id === comment.userId;

    const handleDelete = async () => {
        if (!confirm("确定要删除这条评论吗?")) return;

        setIsDeleting(true);
        try {
            const response = await fetch(`/api/comments/user/${comment.id}`, {
                method: "DELETE",
            });

            if (!response.ok) {
                throw new Error("Failed to delete comment");
            }

            onUpdate();
        } catch (error) {
            console.error("Failed to delete comment:", error);
            alert("删除失败,请重试");
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <Stack gap="0.5rem" className="border-border border-l-2 pl-4">
            {/* 用户信息 */}
            <div className="flex items-center gap-2">
                <Avatar src={comment.user.image} alt={comment.user.name ?? "User"} size={32} />
                <div>
                    <div className="text-sm font-medium">{comment.user.name}</div>
                    <div className="text-muted-foreground text-xs">
                        {formatDistanceToNow(new Date(comment.createdAt), {
                            addSuffix: true,
                            locale: zhCN,
                        })}
                    </div>
                </div>
            </div>

            {/* 评论内容 */}
            <p className="text-sm">{comment.content}</p>

            {/* 操作按钮 */}
            <div className="flex gap-2">
                {session && (
                    <Button variant="ghost" size="sm" onClick={() => setIsReplying(!isReplying)}>
                        {isReplying ? "取消回复" : "回复"}
                    </Button>
                )}
                {isOwner && (
                    <Button variant="ghost" size="sm" onClick={handleDelete} disabled={isDeleting}>
                        {isDeleting ? "删除中..." : "删除"}
                    </Button>
                )}
            </div>

            {/* 回复表单 */}
            {isReplying && (
                <CommentForm
                    postSlug={postSlug}
                    parentId={comment.id}
                    onSuccess={() => {
                        setIsReplying(false);
                        onUpdate();
                    }}
                    onCancel={() => setIsReplying(false)}
                />
            )}

            {/* 嵌套回复 */}
            {comment.replies && comment.replies.length > 0 && (
                <Stack gap="1rem" className="mt-2">
                    {comment.replies.map((reply) => (
                        <CommentItem
                            key={reply.id}
                            comment={reply}
                            postSlug={postSlug}
                            onUpdate={onUpdate}
                        />
                    ))}
                </Stack>
            )}
        </Stack>
    );
}
