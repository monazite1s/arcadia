"use client";

import { useState } from "react";

import { useSession } from "next-auth/react";

import { GuestbookEntry } from "@prisma/client";
import { formatDistanceToNow } from "date-fns";
import { zhCN } from "date-fns/locale";
import { Avatar } from "~/src/components/ui/Avatar";
import { Button } from "~/src/components/ui/button";
import { Stack } from "~/src/components/ui/layout";

interface GuestbookItemProps {
    entry: GuestbookEntry & {
        user: {
            id: string;
            name: string | null;
            image: string | null;
        };
    };
    onUpdate: () => void;
}

/**
 * 单条留言组件
 */
export function GuestbookItem({ entry, onUpdate }: GuestbookItemProps) {
    const { data: session } = useSession();
    const [isDeleting, setIsDeleting] = useState(false);

    const isOwner = session?.user?.id === entry.userId;

    const handleDelete = async () => {
        if (!confirm("确定要删除这条留言吗?")) return;

        setIsDeleting(true);
        try {
            const response = await fetch(`/api/guestbook/${entry.id}`, {
                method: "DELETE",
            });

            if (!response.ok) {
                throw new Error("Failed to delete entry");
            }

            onUpdate();
        } catch (error) {
            console.error("Failed to delete entry:", error);
            alert("删除失败,请重试");
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <Stack gap="0.5rem" className="border-border rounded-md border p-4">
            {/* 用户信息 */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Avatar src={entry.user.image} alt={entry.user.name ?? "User"} size={40} />
                    <div>
                        <div className="text-sm font-medium">{entry.user.name}</div>
                        <div className="text-muted-foreground text-xs">
                            {formatDistanceToNow(new Date(entry.createdAt), {
                                addSuffix: true,
                                locale: zhCN,
                            })}
                        </div>
                    </div>
                </div>

                {/* 删除按钮 */}
                {isOwner && (
                    <Button variant="ghost" size="sm" onClick={handleDelete} disabled={isDeleting}>
                        {isDeleting ? "删除中..." : "删除"}
                    </Button>
                )}
            </div>

            {/* 留言内容 */}
            <p className="text-sm">{entry.content}</p>
        </Stack>
    );
}
