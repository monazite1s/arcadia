import { CalendarEvent } from "@/lib/types";

export interface CalendarProvider {
    getEvents(start: Date, end: Date): Promise<CalendarEvent[]>;
    createEvent(event: Omit<CalendarEvent, "id">): Promise<CalendarEvent>;
    updateEvent(event: CalendarEvent): Promise<CalendarEvent>;
    deleteEvent(id: string): Promise<void>;
}
