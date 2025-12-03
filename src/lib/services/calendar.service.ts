import { Prisma } from "@prisma/client";
import { prisma } from "~/src/lib/db/prisma";

export class CalendarService {
    /**
     * 获取日历事件（按时间范围和用户）
     * @param start 开始时间
     * @param end 结束时间
     * @param userId 用户ID,用于多用户隔离
     */
    async getEvents(start: Date, end: Date, userId?: string) {
        return prisma.calendarEvent.findMany({
            where: {
                date: {
                    gte: start,
                    lte: end,
                },
                ...(userId && { userId }), // 如果提供userId则过滤
            },
            orderBy: { date: "asc" },
        });
    }

    /**
     * 创建日历事件
     * @param data 事件数据,必须包含userId
     */
    async createEvent(data: Prisma.CalendarEventCreateInput) {
        return prisma.calendarEvent.create({ data });
    }

    /**
     * 更新日历事件
     * @param id 事件ID
     * @param userId 用户ID,用于验证所有权
     * @param data 更新数据
     */
    async updateEvent(id: string, userId: string, data: Prisma.CalendarEventUpdateInput) {
        // 先检查事件是否属于该用户
        const event = await prisma.calendarEvent.findUnique({ where: { id } });
        if (!event) {
            throw new Error("Event not found");
        }
        if (event.userId !== userId) {
            throw new Error("Unauthorized: You can only update your own events");
        }

        return prisma.calendarEvent.update({
            where: { id },
            data,
        });
    }

    /**
     * 删除日历事件
     * @param id 事件ID
     * @param userId 用户ID,用于验证所有权
     */
    async deleteEvent(id: string, userId: string) {
        // 先检查事件是否属于该用户
        const event = await prisma.calendarEvent.findUnique({ where: { id } });
        if (!event) {
            throw new Error("Event not found");
        }
        if (event.userId !== userId) {
            throw new Error("Unauthorized: You can only delete your own events");
        }

        return prisma.calendarEvent.delete({ where: { id } });
    }
}
