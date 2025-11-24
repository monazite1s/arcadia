import { DBSchema, IDBPDatabase, openDB } from "idb";

import { CalendarEvent } from "@/lib/types";

import { CalendarProvider } from "./CalendarProvider";

interface ArcadiaDB extends DBSchema {
    events: {
        key: string;
        value: CalendarEvent;
        indexes: { "by-start": Date };
    };
}

export class LocalCalendarProvider implements CalendarProvider {
    private dbPromise: Promise<IDBPDatabase<ArcadiaDB>>;

    constructor() {
        this.dbPromise = Promise.resolve() as unknown as Promise<IDBPDatabase<ArcadiaDB>>; // SSR safe

        this.dbPromise = openDB<ArcadiaDB>("arcadia-calendar", 1, {
            upgrade(db) {
                const store = db.createObjectStore("events", { keyPath: "id" });
                store.createIndex("by-start", "start");
            },
        });
    }

    async getEvents(start: Date, end: Date): Promise<CalendarEvent[]> {
        if (typeof window === "undefined") return [];
        const db = await this.dbPromise;
        const allEvents = await db.getAll("events");

        // Filter in memory for simplicity (IndexedDB ranges can be complex with date objects)
        return allEvents.filter(
            (event) => new Date(event.start) >= start && new Date(event.end) <= end
        );
    }

    async createEvent(event: Omit<CalendarEvent, "id">): Promise<CalendarEvent> {
        const db = await this.dbPromise;
        const newEvent: CalendarEvent = {
            ...event,
            id: crypto.randomUUID(),
        };
        await db.put("events", newEvent);
        return newEvent;
    }

    async updateEvent(event: CalendarEvent): Promise<CalendarEvent> {
        const db = await this.dbPromise;
        await db.put("events", event);
        return event;
    }

    async deleteEvent(id: string): Promise<void> {
        const db = await this.dbPromise;
        await db.delete("events", id);
    }
}
