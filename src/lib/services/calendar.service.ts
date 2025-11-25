import { Prisma } from "@prisma/client";
import { prisma } from "~/src/lib/db/prisma";

export class CalendarService {
    /**
     * 获取日历事件（按时间范围）
     */
    async getEvents(start: Date, end: Date) {
        return prisma.calendarEvent.findMany({
            where: {
                date: {
                    gte: start,
                    lte: end,
                },
            },
            orderBy: { date: "asc" },
        });
    }

    /**
     * 创建日历事件
     */
    async createEvent(data: Prisma.CalendarEventCreateInput) {
        return prisma.calendarEvent.create({ data });
    }

    /**
     * 更新日历事件
     */
    async updateEvent(id: string, data: Prisma.CalendarEventUpdateInput) {
        return prisma.calendarEvent.update({
            where: { id },
            data,
        });
    }

    /**
     * 删除日历事件
     */
    async deleteEvent(id: string) {
        return prisma.calendarEvent.delete({ where: { id } });
    }
}
