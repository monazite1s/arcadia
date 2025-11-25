import { openDB } from "idb";

import { CalendarEvent } from "@/lib/types";

import { CalendarProvider } from "./CalendarProvider";

const DB_NAME = "arcadia-calendar";
const STORE_NAME = "events";

export class LocalCalendarProvider implements CalendarProvider {
    private async getDB() {
        return openDB(DB_NAME, 1, {
            upgrade(db) {
                if (!db.objectStoreNames.contains(STORE_NAME)) {
                    const store = db.createObjectStore(STORE_NAME, {
                        keyPath: "id",
                        autoIncrement: true,
                    });
                    store.createIndex("date", "date");
                }
            },
        });
    }

    async getEvents(start: Date, end: Date): Promise<CalendarEvent[]> {
        const db = await this.getDB();
        const allEvents = (await db.getAll(STORE_NAME)) as CalendarEvent[];
        return allEvents.filter((event) => {
            const eventDate = new Date(event.date);
            return eventDate >= start && eventDate <= end;
        });
    }

    async createEvent(
        event: Omit<CalendarEvent, "id" | "createdAt" | "updatedAt">
    ): Promise<CalendarEvent> {
        const db = await this.getDB();
        const newEvent = {
            ...event,
            id: crypto.randomUUID(),
            createdAt: new Date(),
            updatedAt: new Date(),
        };
        await db.add(STORE_NAME, newEvent);
        return newEvent;
    }

    async updateEvent(event: CalendarEvent): Promise<CalendarEvent> {
        const db = await this.getDB();
        const updatedEvent = {
            ...event,
            updatedAt: new Date(),
        };
        await db.put(STORE_NAME, updatedEvent);
        return updatedEvent;
    }

    async deleteEvent(id: string): Promise<void> {
        const db = await this.getDB();
        await db.delete(STORE_NAME, id);
    }
}
