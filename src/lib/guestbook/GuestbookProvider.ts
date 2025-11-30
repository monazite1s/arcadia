import { GuestbookEntry } from "@prisma/client";

/**
 * Guestbook Provider 接口
 * 抽象留言板数据访问
 */
export interface GuestbookProvider {
    /**
     * 获取所有留言
     */
    getEntries(): Promise<GuestbookEntry[]>;
    /**
     * 创建新留言
     * @param userId 用户 ID
     * @param content 留言内容
     */
    createEntry(userId: string, content: string): Promise<GuestbookEntry>;
    /**
     * 删除留言
     * @param id 留言 ID
     * @param userId 当前用户 ID (用于权限验证)
     */
    deleteEntry(id: string, userId: string): Promise<void>;
}
