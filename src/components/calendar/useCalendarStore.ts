import { create } from "zustand";
import { ApiCalendarProvider } from "~/src/lib/calendar/ApiCalendarProvider";
import { LocalCalendarProvider } from "~/src/lib/calendar/LocalCalendarProvider";
import { CalendarEvent } from "~/src/lib/types";

// import { startOfMonth, endOfMonth } from "date-fns";

// Initialize provider lazily
const USE_API = process.env.NEXT_PUBLIC_USE_CALENDAR_API === "true";
let provider: LocalCalendarProvider | ApiCalendarProvider;
if (typeof window !== "undefined") {
    provider = USE_API ? new ApiCalendarProvider() : new LocalCalendarProvider();
}

interface CalendarState {
    events: CalendarEvent[];
    currentDate: Date;
    isLoading: boolean;

    // Actions
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

    setCurrentDate: (date) => {
        set({ currentDate: date });
        // fetchEvents will be called by the component effect when date changes
    },

    fetchEvents: async (start: Date, end: Date) => {
        if (!provider) return;
        set({ isLoading: true });

        try {
            const events = await provider.getEvents(start, end);
            set({ events, isLoading: false });
        } catch (error) {
            console.error("Failed to fetch events:", error);
            set({ isLoading: false });
        }
    },

    addEvent: async (eventData) => {
        if (!provider) return;
        try {
            const newEvent = await provider.createEvent(eventData);
            set((state) => ({ events: [...state.events, newEvent] }));
        } catch (error) {
            console.error("Failed to add event:", error);
            throw error;
        }
    },

    updateEvent: async (event) => {
        if (!provider) return;
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
        if (!provider) return;
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
