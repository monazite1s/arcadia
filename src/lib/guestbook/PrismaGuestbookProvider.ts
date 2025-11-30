import { GuestbookEntry } from "@prisma/client";
import { prisma } from "~/src/lib/db/prisma";

import { GuestbookProvider } from "./GuestbookProvider";

/**
 * Prisma Guestbook Provider 实现
 */
export class PrismaGuestbookProvider implements GuestbookProvider {
    /**
     * 获取所有留言,包含用户信息
     */
    async getEntries(): Promise<GuestbookEntry[]> {
        const entries = await prisma.guestbookEntry.findMany({
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        image: true,
                    },
                },
            },
            orderBy: {
                createdAt: "desc", // 最新的在前面
            },
        });
        return entries;
    }
    /**
     * 创建留言
     */
    async createEntry(userId: string, content: string): Promise<GuestbookEntry> {
        const entry = await prisma.guestbookEntry.create({
            data: {
                userId,
                content,
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        image: true,
                    },
                },
            },
        });
        return entry;
    }
    /**
     * 删除留言(仅允许删除自己的留言)
     */
    async deleteEntry(id: string, userId: string): Promise<void> {
        // 先查询留言,验证所有权
        const entry = await prisma.guestbookEntry.findUnique({
            where: { id },
        });
        if (!entry) {
            throw new Error("Entry not found");
        }
        if (entry.userId !== userId) {
            throw new Error("Unauthorized: You can only delete your own entries");
        }
        // 删除留言
        await prisma.guestbookEntry.delete({
            where: { id },
        });
    }
}
