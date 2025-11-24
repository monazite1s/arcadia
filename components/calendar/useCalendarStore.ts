import { create } from "zustand";

import { LocalCalendarProvider } from "@/lib/calendar/LocalCalendarProvider";
import { CalendarEvent } from "@/lib/types";

// import { startOfMonth, endOfMonth } from "date-fns";

// Initialize provider lazily
let provider: LocalCalendarProvider;
if (typeof window !== "undefined") {
    provider = new LocalCalendarProvider();
}

interface CalendarState {
    events: CalendarEvent[];
    currentDate: Date;
    isLoading: boolean;

    // Actions
    setCurrentDate: (date: Date) => void;
    fetchEvents: () => Promise<void>;
    addEvent: (event: Omit<CalendarEvent, "id">) => Promise<void>;
    updateEvent: (event: CalendarEvent) => Promise<void>;
    deleteEvent: (id: string) => Promise<void>;
}

export const useCalendarStore = create<CalendarState>((set, get) => ({
    events: [],
    currentDate: new Date(),
    isLoading: false,

    setCurrentDate: (date) => {
        set({ currentDate: date });
        get().fetchEvents();
    },

    fetchEvents: async () => {
        if (!provider) return;
        set({ isLoading: true });

        // const start = startOfMonth(currentDate);
        // const end = endOfMonth(currentDate);

        // Fetch a bit more buffer if needed, but month view is standard
        // Actually, let's fetch all for now to be safe with cross-month events or just simple implementation
        // The provider filter implementation above filters strictly by range.
        // Let's fetch a wide range for now.
        const events = await provider.getEvents(new Date(0), new Date("2100-01-01"));

        set({ events, isLoading: false });
    },

    addEvent: async (eventData) => {
        if (!provider) return;
        const newEvent = await provider.createEvent(eventData);
        set((state) => ({ events: [...state.events, newEvent] }));
    },

    updateEvent: async (event) => {
        if (!provider) return;
        await provider.updateEvent(event);
        set((state) => ({
            events: state.events.map((e) => (e.id === event.id ? event : e)),
        }));
    },

    deleteEvent: async (id) => {
        if (!provider) return;
        await provider.deleteEvent(id);
        set((state) => ({
            events: state.events.filter((e) => e.id !== id),
        }));
    },
}));
