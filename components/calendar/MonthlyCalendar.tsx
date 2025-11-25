"use client";

import { useEffect, useState } from "react";

import {
    addMonths,
    eachDayOfInterval,
    endOfMonth,
    endOfWeek,
    format,
    isBefore,
    isSameDay,
    isSameMonth,
    isToday,
    startOfDay,
    startOfMonth,
    startOfWeek,
    subMonths,
} from "date-fns";

import { Card } from "@/components/ui/card";
import { Flex, Grid, Stack } from "@/components/ui/layout";
import { cn } from "@/lib/utils";

import { TodoDialog } from "./TodoDialog";
import { useCalendarStore } from "./useCalendarStore";

// Khaki-themed colors for todos
const TODO_COLORS = [
    { bg: "bg-primary/20", text: "text-primary", border: "border-primary/40" },
    {
        bg: "bg-amber-100 dark:bg-amber-900/30",
        text: "text-amber-700 dark:text-amber-300",
        border: "border-amber-300 dark:border-amber-700",
    },
    {
        bg: "bg-stone-100 dark:bg-stone-900/30",
        text: "text-stone-700 dark:text-stone-300",
        border: "border-stone-300 dark:border-stone-700",
    },
    {
        bg: "bg-yellow-100 dark:bg-yellow-900/30",
        text: "text-yellow-700 dark:text-yellow-300",
        border: "border-yellow-300 dark:border-yellow-700",
    },
    {
        bg: "bg-orange-100 dark:bg-orange-900/30",
        text: "text-orange-700 dark:text-orange-300",
        border: "border-orange-300 dark:border-orange-700",
    },
];

export function MonthlyCalendar() {
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const { events, fetchEvents } = useCalendarStore();

    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);

    // Fetch events when month changes
    useEffect(() => {
        // Fetch a bit more buffer (previous and next month) to handle edge cases if needed
        // For now, fetching the current month view range is sufficient
        const start = startOfWeek(monthStart, { weekStartsOn: 0 });
        const end = endOfWeek(monthEnd, { weekStartsOn: 0 });
        fetchEvents(start, end);
    }, [currentMonth, fetchEvents, monthStart, monthEnd]);
    const calendarStart = startOfWeek(monthStart, { weekStartsOn: 0 });
    const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });

    const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });
    const weekDays = ["日", "一", "二", "三", "四", "五", "六"];

    const handlePrevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
    const handleNextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
    const handleToday = () => setCurrentMonth(new Date());

    const handleDayClick = (day: Date) => {
        setSelectedDate(day);
        setIsDialogOpen(true);
    };

    const getDayEvents = (day: Date) => {
        return events.filter((event) => {
            const eventDate = new Date(event.date);
            return isSameDay(eventDate, day);
        });
    };

    const getColorForEvent = (index: number) => {
        return TODO_COLORS[index % TODO_COLORS.length];
    };

    const today = startOfDay(new Date());

    return (
        <Stack gap="0.75rem" className="h-full p-3">
            {/* Header Controls - Ultra Compact */}
            <Card className="khaki-card p-2">
                <Flex align="center" justify="between">
                    <button
                        onClick={handlePrevMonth}
                        className="border-border hover:bg-muted/50 rounded border-2 px-2 py-1 text-xs font-bold transition-colors"
                    >
                        ←
                    </button>

                    <Flex align="center" gap="0.5rem">
                        <h2 className="text-foreground font-mono text-lg font-bold">
                            {format(currentMonth, "yyyy年 M月")}
                        </h2>
                        <button
                            onClick={handleToday}
                            className="khaki-button px-1.5 py-0.5 text-[10px]"
                        >
                            今天
                        </button>
                    </Flex>

                    <button
                        onClick={handleNextMonth}
                        className="border-border hover:bg-muted/50 rounded border-2 px-2 py-1 text-xs font-bold transition-colors"
                    >
                        →
                    </button>
                </Flex>
            </Card>

            {/* Calendar Grid - Ultra Compact */}
            <Card className="khaki-card p-2">
                <Stack gap="0">
                    {/* Week Day Headers */}
                    <Grid columns={7} gap="0" className="border-border mb-0.5 border-b-2 pb-0.5">
                        {weekDays.map((day) => (
                            <div
                                key={day}
                                className="text-muted-foreground py-0.5 text-center text-[10px] font-bold"
                            >
                                {day}
                            </div>
                        ))}
                    </Grid>

                    {/* Days Grid */}
                    <Grid columns={7} gap="0.25rem">
                        {days.map((day) => {
                            const dayEvents = getDayEvents(day);
                            const isCurrentMonth = isSameMonth(day, currentMonth);
                            const isCurrentDay = isToday(day);
                            const isPast = isBefore(day, today) && !isCurrentDay;

                            return (
                                <button
                                    key={day.toString()}
                                    onClick={() => handleDayClick(day)}
                                    className={cn(
                                        "relative rounded border-2 p-1 transition-all",
                                        "hover:border-primary hover:shadow-md",
                                        "aspect-[4/3]",
                                        // Non-current month: very gray (opacity-30)
                                        !isCurrentMonth &&
                                            "border-border/30 bg-muted/10 opacity-30",
                                        // Current month styling
                                        isCurrentMonth && "border-border bg-card",
                                        // Past days in current month: slightly grayed (opacity-60)
                                        isPast && isCurrentMonth && "opacity-60",
                                        // Today - special highlight
                                        isCurrentDay &&
                                            "border-primary bg-primary/20 ring-primary/30 border-3 opacity-100 shadow-lg ring-1"
                                    )}
                                    style={{
                                        minHeight: "40px",
                                    }}
                                >
                                    <Stack gap="0.25rem" align="start" className="h-full">
                                        <span
                                            className={cn(
                                                "text-[10px] font-medium",
                                                isCurrentDay && "text-primary text-xs font-bold",
                                                !isCurrentMonth && "text-muted-foreground"
                                            )}
                                        >
                                            {format(day, "d")}
                                        </span>

                                        {dayEvents.length > 0 && (
                                            <div className="w-full flex-1 overflow-hidden">
                                                {dayEvents.slice(0, 2).map((event, idx) => {
                                                    const color = getColorForEvent(idx);
                                                    return (
                                                        <div
                                                            key={idx}
                                                            className={cn(
                                                                "mb-0.5 truncate rounded border px-0.5 py-0.5 text-[9px] leading-tight",
                                                                color.bg,
                                                                color.text,
                                                                color.border
                                                            )}
                                                        >
                                                            {event.title}
                                                        </div>
                                                    );
                                                })}
                                                {dayEvents.length > 2 && (
                                                    <div className="text-muted-foreground text-[9px] font-medium">
                                                        +{dayEvents.length - 2}
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </Stack>
                                </button>
                            );
                        })}
                    </Grid>
                </Stack>
            </Card>

            {/* Todo Dialog */}
            {selectedDate && (
                <TodoDialog
                    isOpen={isDialogOpen}
                    onClose={() => setIsDialogOpen(false)}
                    selectedDate={selectedDate}
                />
            )}
        </Stack>
    );
}
