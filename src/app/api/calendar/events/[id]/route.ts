import { NextRequest, NextResponse } from "next/server";

import { CalendarService } from "~/src/lib/services/calendar.service";

const service = new CalendarService();

// 🚨 解决 Build Error: 强制动态渲染
export const dynamic = "force-dynamic";

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const body = await request.json();
        const eventData = {
            ...body,
            ...(body.date && { date: new Date(body.date) }),
        };

        const event = await service.updateEvent(id, eventData);
        return NextResponse.json(event);
    } catch (error) {
        console.error("Failed to update event:", error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : "Failed to update event" },
            { status: 500 }
        );
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        await service.deleteEvent(id);
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Failed to delete event:", error);
        return NextResponse.json({ error: "Failed to delete event" }, { status: 500 });
    }
}
