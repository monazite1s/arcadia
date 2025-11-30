"use client";

import { useCallback, useEffect, useState } from "react";

import { Stack } from "~/src/components/ui/layout";
import { Comment } from "~/src/lib/types";

import { CommentForm } from "./CommentForm";
import { CommentList } from "./CommentList";

interface CommentSectionProps {
    postSlug: string;
}

/**
 * 评论区容器组件
 * 负责加载和管理评论数据
 */
export function CommentSection({ postSlug }: CommentSectionProps) {
    const [comments, setComments] = useState<Comment[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const loadComments = useCallback(async () => {
        try {
            const response = await fetch(`/api/comments/${postSlug}`);
            if (!response.ok) {
                throw new Error("Failed to load comments");
            }
            const data = await response.json();
            setComments(data);
        } catch (error) {
            console.error("Failed to load comments:", error);
        } finally {
            setIsLoading(false);
        }
    }, [postSlug]);

    useEffect(() => {
        loadComments();
    }, [loadComments]);

    return (
        <Stack gap="2rem">
            <h2 className="font-mono text-2xl font-bold">评论</h2>

            {/* 评论输入框 */}
            <CommentForm postSlug={postSlug} onSuccess={loadComments} />

            {/* 评论列表 */}
            {isLoading ? (
                <div className="text-muted-foreground text-sm">加载评论中...</div>
            ) : (
                <CommentList comments={comments} postSlug={postSlug} onUpdate={loadComments} />
            )}
        </Stack>
    );
}
