import { CalendarEvent } from "~/src/lib/types";

import { CalendarProvider } from "./CalendarProvider";

export class ApiCalendarProvider implements CalendarProvider {
    private baseUrl = "/api/calendar";

    async getEvents(start: Date, end: Date): Promise<CalendarEvent[]> {
        const params = new URLSearchParams({
            start: start.toISOString(),
            end: end.toISOString(),
        });

        const res = await fetch(`${this.baseUrl}/events?${params}`);
        if (!res.ok) throw new Error("Failed to fetch events");
        return res.json();
    }

    async createEvent(
        event: Omit<CalendarEvent, "id" | "createdAt" | "updatedAt">
    ): Promise<CalendarEvent> {
        const res = await fetch(`${this.baseUrl}/events`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(event),
        });
        if (!res.ok) throw new Error("Failed to create event");
        return res.json();
    }

    async updateEvent(event: CalendarEvent): Promise<CalendarEvent> {
        const res = await fetch(`${this.baseUrl}/events/${event.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(event),
        });
        if (!res.ok) throw new Error("Failed to update event");
        return res.json();
    }

    async deleteEvent(id: string): Promise<void> {
        const res = await fetch(`${this.baseUrl}/events/${id}`, {
            method: "DELETE",
        });
        if (!res.ok) throw new Error("Failed to delete event");
    }
}
