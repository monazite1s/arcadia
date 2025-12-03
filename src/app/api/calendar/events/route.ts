import { NextRequest, NextResponse } from "next/server";

import { getCurrentUser } from "~/src/lib/auth";
import { CalendarService } from "~/src/lib/services/calendar.service";

const service = new CalendarService();

// 🚨 解决 Hydration/Static Export 问题的关键：
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const start = new Date(searchParams.get("start") || "");
    const end = new Date(searchParams.get("end") || "");

    try {
        // 获取当前用户
        const user = await getCurrentUser();

        // 如果用户已登录,只返回该用户的事件;否则返回空数组
        const events = user ? await service.getEvents(start, end, user.id) : [];

        return NextResponse.json(events);
    } catch (error) {
        console.error("Failed to fetch events:", error);
        return NextResponse.json({ error: "Failed to fetch events" }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        // 要求用户登录
        const user = await getCurrentUser();
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json();
        const eventData = {
            title: body.title,
            description: body.description,
            date: new Date(body.date),
            user: {
                connect: { id: user.id }, // 关联到当前用户
            },
        };

        const event = await service.createEvent(eventData);
        return NextResponse.json(event);
    } catch (error) {
        console.error("Failed to create event:", error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : "Failed to create event" },
            { status: 500 }
        );
    }
}
