"use client";
import { GuestbookEntry } from "@prisma/client";
import { Stack } from "~/src/components/ui/layout";

import { GuestbookItem } from "./GuestbookItem";

interface GuestbookListProps {
    entries: (GuestbookEntry & {
        user: {
            id: string;
            name: string | null;
            image: string | null;
        };
    })[];
    onUpdate: () => void;
}
/**
 * 留言列表组件
 */
export function GuestbookList({ entries, onUpdate }: GuestbookListProps) {
    if (entries.length === 0) {
        return (
            <div className="text-muted-foreground text-center text-sm">
                还没有留言,来发表第一条吧!
            </div>
        );
    }
    return (
        <Stack gap="1rem">
            {entries.map((entry) => (
                <GuestbookItem key={entry.id} entry={entry} onUpdate={onUpdate} />
            ))}
        </Stack>
    );
}
