import { NextRequest, NextResponse } from "next/server";

import { getCurrentUser } from "~/src/lib/auth";
import { CalendarService } from "~/src/lib/services/calendar.service";

const service = new CalendarService();

// 🚨 解决 Build Error: 强制动态渲染
export const dynamic = "force-dynamic";

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        // 要求用户登录
        const user = await getCurrentUser();
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id } = await params;
        const body = await request.json();
        const eventData = {
            ...body,
            ...(body.date && { date: new Date(body.date) }),
        };

        // 更新事件,service会验证所有权
        const event = await service.updateEvent(id, user.id, eventData);
        return NextResponse.json(event);
    } catch (error) {
        console.error("Failed to update event:", error);
        const status = error instanceof Error && error.message.includes("Unauthorized") ? 403 : 500;
        return NextResponse.json(
            { error: error instanceof Error ? error.message : "Failed to update event" },
            { status }
        );
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        // 要求用户登录
        const user = await getCurrentUser();
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id } = await params;

        // 删除事件,service会验证所有权
        await service.deleteEvent(id, user.id);
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Failed to delete event:", error);
        const status = error instanceof Error && error.message.includes("Unauthorized") ? 403 : 500;
        return NextResponse.json(
            { error: error instanceof Error ? error.message : "Failed to delete event" },
            { status }
        );
    }
}
