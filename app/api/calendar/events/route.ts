import { NextRequest, NextResponse } from "next/server";

import { CalendarService } from "@/lib/services/calendar.service";

const service = new CalendarService();

// 🚨 解决 Hydration/Static Export 问题的关键：
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const start = new Date(searchParams.get("start") || "");
    const end = new Date(searchParams.get("end") || "");
    try {
        const events = await service.getEvents(start, end);
        return NextResponse.json(events);
    } catch (error) {
        console.error("Failed to fetch events:", error);
        return NextResponse.json({ error: "Failed to fetch events" }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const eventData = {
            title: body.title,
            description: body.description,
            date: new Date(body.date),
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
