"use client";

import { useState } from "react";

import { format } from "date-fns";

import { Card } from "@/components/ui/card";
import { Flex, Stack } from "@/components/ui/layout";

import { useCalendarStore } from "./useCalendarStore";

interface TodoDialogProps {
    isOpen: boolean;
    onClose: () => void;
    selectedDate: Date;
}

export function TodoDialog({ isOpen, onClose, selectedDate }: TodoDialogProps) {
    const { events, addEvent, deleteEvent } = useCalendarStore();
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");

    const dayEvents = events.filter((event) => {
        const eventDate = new Date(event.start);
        return (
            eventDate.getFullYear() === selectedDate.getFullYear() &&
            eventDate.getMonth() === selectedDate.getMonth() &&
            eventDate.getDate() === selectedDate.getDate()
        );
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim()) return;

        const start = new Date(selectedDate);
        start.setHours(9, 0, 0, 0);
        const end = new Date(selectedDate);
        end.setHours(10, 0, 0, 0);

        addEvent({
            title: title.trim(),
            description: description.trim(),
            start,
            end,
            allDay: true,
        });

        setTitle("");
        setDescription("");
    };

    const handleDelete = (eventId: string) => {
        if (confirm("确定要删除这个待办吗？")) {
            deleteEvent(eventId);
        }
    };

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
            onClick={onClose}
        >
            <Card
                className="khaki-card m-4 w-full max-w-md p-6"
                onClick={(e) => e.stopPropagation()}
            >
                <Stack gap="1.5rem">
                    {/* Header */}
                    <Flex align="center" justify="between">
                        <h3 className="text-xl font-bold">
                            {format(selectedDate, "yyyy年M月d日")}
                        </h3>
                        <button
                            onClick={onClose}
                            className="text-muted-foreground hover:text-foreground text-2xl leading-none"
                        >
                            ×
                        </button>
                    </Flex>

                    {/* Add Todo Form */}
                    <form onSubmit={handleSubmit}>
                        <Stack gap="1rem">
                            <input
                                type="text"
                                placeholder="待办标题..."
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="khaki-input w-full"
                                autoFocus
                            />
                            <textarea
                                placeholder="描述（可选）..."
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="khaki-input min-h-[80px] w-full resize-none"
                            />
                            <button type="submit" className="khaki-button w-full">
                                添加待办
                            </button>
                        </Stack>
                    </form>

                    {/* Existing Todos */}
                    {dayEvents.length > 0 && (
                        <Stack gap="0.75rem">
                            <h4 className="text-muted-foreground text-sm font-bold">
                                已有待办 ({dayEvents.length})
                            </h4>
                            {dayEvents.map((event) => (
                                <Flex
                                    key={event.id}
                                    align="start"
                                    justify="between"
                                    className="border-border bg-muted/20 rounded border-2 p-3"
                                >
                                    <Stack gap="0.25rem" className="flex-1">
                                        <div className="font-medium">{event.title}</div>
                                        {event.description && (
                                            <div className="text-muted-foreground text-sm">
                                                {event.description}
                                            </div>
                                        )}
                                    </Stack>
                                    <button
                                        onClick={() => handleDelete(event.id!)}
                                        className="text-destructive hover:text-destructive/80 ml-2"
                                    >
                                        删除
                                    </button>
                                </Flex>
                            ))}
                        </Stack>
                    )}
                </Stack>
            </Card>
        </div>
    );
}
