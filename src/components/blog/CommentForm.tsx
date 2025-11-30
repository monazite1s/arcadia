"use client";
import { useState } from "react";

import { useSession } from "next-auth/react";

import { Button } from "~/src/components/ui/button";
import { Stack } from "~/src/components/ui/layout";

interface CommentFormProps {
    postSlug: string;
    parentId?: string;
    onSuccess?: () => void;
    onCancel?: () => void;
}
/**
 * 评论输入表单
 * 支持顶层评论和嵌套回复
 */
export function CommentForm({ postSlug, parentId, onSuccess, onCancel }: CommentFormProps) {
    const { data: session } = useSession();
    const [content, setContent] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!content.trim()) return;
        setIsSubmitting(true);
        try {
            const response = await fetch(`/api/comments/${postSlug}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ content, parentId }),
            });
            if (!response.ok) {
                throw new Error("Failed to post comment");
            }
            setContent("");
            onSuccess?.();
        } catch (error) {
            console.error("Failed to post comment:", error);
            alert("发表评论失败,请重试");
        } finally {
            setIsSubmitting(false);
        }
    };
    if (!session) {
        return <div className="text-muted-foreground text-sm">请先登录后再发表评论</div>;
    }
    return (
        <form onSubmit={handleSubmit}>
            <Stack gap="0.5rem">
                <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder={parentId ? "写下你的回复..." : "写下你的评论..."}
                    className="border-border focus:border-primary min-h-[100px] w-full rounded-md border p-3 text-sm outline-none"
                    disabled={isSubmitting}
                />
                <div className="flex gap-2">
                    <Button type="submit" disabled={isSubmitting || !content.trim()}>
                        {isSubmitting ? "发表中..." : parentId ? "回复" : "发表评论"}
                    </Button>
                    {onCancel && (
                        <Button type="button" variant="ghost" onClick={onCancel}>
                            取消
                        </Button>
                    )}
                </div>
            </Stack>
        </form>
    );
}
