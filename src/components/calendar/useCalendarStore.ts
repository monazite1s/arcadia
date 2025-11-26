"use client";

import { create } from "zustand";
import { ApiCalendarProvider } from "~/src/lib/calendar/ApiCalendarProvider";
import { CalendarEvent } from "~/src/lib/types";

const provider = new ApiCalendarProvider();

const getCacheKey = (start: Date, end: Date) =>
    `${start.toISOString().split("T")[0]}_${end.toISOString().split("T")[0]}`;

interface CalendarState {
    events: CalendarEvent[];
    currentDate: Date;
    isLoading: boolean;
    cache: Map<string, CalendarEvent[]>;

    getEvents: (start?: Date, end?: Date) => CalendarEvent[];
    setCurrentDate: (date: Date) => void;
    fetchEvents: (start: Date, end: Date) => Promise<void>;
    addEvent: (event: Omit<CalendarEvent, "id" | "createdAt" | "updatedAt">) => Promise<void>;
    updateEvent: (event: CalendarEvent) => Promise<void>;
    deleteEvent: (id: string) => Promise<void>;
}

export const useCalendarStore = create<CalendarState>((set, get) => ({
    events: [],
    currentDate: new Date(),
    isLoading: false,
    cache: new Map(),

    getEvents: (start?: Date, end?: Date) => {
        const { events } = get();
        if (!start || !end) return events;

        return events.filter((event) => {
            const eventDate = new Date(event.date);
            return eventDate >= start && eventDate <= end;
        });
    },

    setCurrentDate: (date) => {
        set({ currentDate: date });
    },

    fetchEvents: async (start: Date, end: Date) => {
        const { cache } = get();
        const cacheKey = getCacheKey(start, end);

        const cached = cache.get(cacheKey);
        if (cached) {
            set({ events: cached, isLoading: true });
        } else {
            set({ isLoading: true });
        }

        try {
            const events = await provider.getEvents(start, end);
            const newCache = new Map(cache);
            newCache.set(cacheKey, events);
            set({ events, isLoading: false, cache: newCache });
        } catch (error) {
            console.error("Failed to fetch events:", error);
            set({ isLoading: false });
        }
    },

    addEvent: async (eventData) => {
        try {
            const newEvent = await provider.createEvent(eventData);
            set((state) => ({ events: [...state.events, newEvent] }));
        } catch (error) {
            console.error("Failed to add event:", error);
            throw error;
        }
    },

    updateEvent: async (event) => {
        try {
            const updatedEvent = await provider.updateEvent(event);
            set((state) => ({
                events: state.events.map((e) => (e.id === event.id ? updatedEvent : e)),
            }));
        } catch (error) {
            console.error("Failed to update event:", error);
            throw error;
        }
    },

    deleteEvent: async (id) => {
        try {
            await provider.deleteEvent(id);
            set((state) => ({
                events: state.events.filter((e) => e.id !== id),
            }));
        } catch (error) {
            console.error("Failed to delete event:", error);
            throw error;
        }
    },
}));
