import { ReactNode } from "react";

export interface Post {
    slug: string;
    title: string;
    date: string;
    tags: string[];
    content: ReactNode; // MDX content or compiled HTML
    excerpt?: string;
}

export interface Tag {
    name: string;
    count: number;
}

export interface CalendarEvent {
    id: string;
    title: string;
    start: Date;
    end: Date;
    description?: string;
    allDay?: boolean;
}
