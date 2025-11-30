"use client";

import { useEffect, useState } from "react";

import { GuestbookForm } from "~/src/components/guestbook/GuestbookForm";
import { GuestbookList } from "~/src/components/guestbook/GuestbookList";
import { Stack } from "~/src/components/ui/layout";

type GuestbookEntryWithUser = {
    id: string;
    userId: string;
    content: string;
    createdAt: Date;
    updatedAt: Date;
    user: {
        id: string;
        name: string | null;
        image: string | null;
    };
};

export default function GuestbookPage() {
    const [entries, setEntries] = useState<GuestbookEntryWithUser[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const loadEntries = async () => {
        try {
            const response = await fetch("/api/guestbook");
            if (!response.ok) {
                throw new Error("Failed to load entries");
            }
            const data = await response.json();
            setEntries(data);
        } catch (error) {
            console.error("Failed to load guestbook entries:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadEntries();
    }, []);

    return (
        <div className="container mx-auto max-w-3xl px-4 py-12">
            <Stack gap="2rem">
                {/* 页面标题 */}
                <Stack gap="1rem">
                    <h1 className="font-mono text-4xl font-bold">留言板</h1>
                    <p className="text-muted-foreground text-lg">在这里留下你的足迹吧 ✨</p>
                </Stack>

                {/* 留言输入框 */}
                <GuestbookForm onSuccess={loadEntries} />

                <div className="bg-border h-px" />

                {/* 留言列表 */}
                <Stack gap="1rem">
                    <h2 className="font-mono text-2xl font-bold">所有留言 ({entries.length})</h2>
                    {isLoading ? (
                        <div className="text-muted-foreground text-sm">加载留言中...</div>
                    ) : (
                        <GuestbookList entries={entries} onUpdate={loadEntries} />
                    )}
                </Stack>
            </Stack>
        </div>
    );
}
