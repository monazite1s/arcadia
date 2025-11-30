"use client";
import { useState } from "react";

import { useSession } from "next-auth/react";

import { Button } from "~/src/components/ui/button";
import { Stack } from "~/src/components/ui/layout";

interface GuestbookFormProps {
    onSuccess?: () => void;
}
const MAX_MESSAGE_LENGTH = 500;
/**
 * 留言输入表单
 */
export function GuestbookForm({ onSuccess }: GuestbookFormProps) {
    const { data: session } = useSession();
    const [content, setContent] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        const trimmedContent = content.trim();

        if (!trimmedContent) {
            setError("留言内容不能为空");
            return;
        }
        if (trimmedContent.length > MAX_MESSAGE_LENGTH) {
            setError(`留言内容不能超过 ${MAX_MESSAGE_LENGTH} 个字符`);
            return;
        }
        setIsSubmitting(true);
        try {
            const response = await fetch("/api/guestbook", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ content: trimmedContent }),
            });
            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || "Failed to post message");
            }
            setContent("");
            onSuccess?.();
        } catch (error) {
            console.error("Failed to post message:", error);
            setError(error instanceof Error ? error.message : "发表留言失败,请重试");
        } finally {
            setIsSubmitting(false);
        }
    };
    if (!session) {
        return <div className="text-muted-foreground text-center text-sm">请先登录后再留言</div>;
    }
    return (
        <form onSubmit={handleSubmit}>
            <Stack gap="0.5rem">
                <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="写下你的留言..."
                    className="border-border focus:border-primary min-h-[120px] w-full rounded-md border p-3 text-sm outline-none"
                    disabled={isSubmitting}
                    maxLength={MAX_MESSAGE_LENGTH}
                />

                <div className="text-muted-foreground text-right text-xs">
                    {content.length} / {MAX_MESSAGE_LENGTH}
                </div>
                {error && <div className="text-destructive text-sm">{error}</div>}
                <Button type="submit" disabled={isSubmitting || !content.trim()}>
                    {isSubmitting ? "发表中..." : "发表留言"}
                </Button>
            </Stack>
        </form>
    );
}
