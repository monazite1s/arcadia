"use client";

import {
    addDays,
    eachDayOfInterval,
    format,
    isSameDay,
    setHours,
    setMinutes,
    startOfWeek,
} from "date-fns";

import { Grid, Stack } from "@/components/ui/layout";
import { cn } from "@/lib/utils";

import { EventBlock } from "./EventBlock";
import { useCalendarStore } from "./useCalendarStore";

export function CalendarGrid() {
    const { currentDate, events, addEvent } = useCalendarStore();
    const startDate = startOfWeek(currentDate, { weekStartsOn: 1 }); // Monday start
    const weekDays = eachDayOfInterval({
        start: startDate,
        end: addDays(startDate, 6),
    });

    const hours = Array.from({ length: 24 }, (_, i) => i);

    const handleGridClick = (day: Date, hour: number) => {
        const start = setMinutes(setHours(day, hour), 0);
        const end = setMinutes(setHours(day, hour + 1), 0);

        // Simple prompt for now
        const title = prompt("Enter event title:", "New Event");
        if (title) {
            addEvent({
                title,
                start,
                end,
                description: "",
                allDay: false,
            });
        }
    };

    return (
        <Stack className="h-full overflow-hidden" gap={0}>
            {/* Header Days */}
            <Grid columns={8} className="border-border bg-card/30 border-b">
                <div className="border-border text-muted-foreground w-16 border-r p-2 text-center text-xs">
                    GMT+8
                </div>
                {weekDays.map((day) => (
                    <div
                        key={day.toString()}
                        className={cn(
                            "border-border border-r p-2 text-center last:border-r-0",
                            isSameDay(day, new Date()) && "bg-primary/10"
                        )}
                    >
                        <div className="text-muted-foreground text-xs font-medium">
                            {format(day, "EEE")}
                        </div>
                        <div
                            className={cn(
                                "mx-auto mt-1 flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold",
                                isSameDay(day, new Date())
                                    ? "bg-primary text-primary-foreground"
                                    : "text-foreground"
                            )}
                        >
                            {format(day, "d")}
                        </div>
                    </div>
                ))}
            </Grid>

            {/* Time Grid */}
            <div className="flex-1 overflow-y-auto">
                <Grid columns={8} className="relative min-h-[1440px]">
                    {/* Time Labels */}
                    <div className="border-border bg-card/10 border-r">
                        {hours.map((hour) => (
                            <div
                                key={hour}
                                className="border-border/50 text-muted-foreground relative -top-2 h-[60px] border-b px-2 text-right text-xs"
                            >
                                {format(new Date().setHours(hour, 0, 0, 0), "h a")}
                            </div>
                        ))}
                    </div>
                    {/* Day Columns */}
                    {weekDays.map((day) => (
                        <div
                            key={day.toString()}
                            className="border-border relative border-r last:border-r-0"
                        >
                            {/* Grid Lines */}
                            {hours.map((hour) => (
                                <div
                                    key={hour}
                                    className="border-border/50 hover:bg-accent/20 h-[60px] cursor-pointer border-b transition-colors"
                                    onClick={() => handleGridClick(day, hour)}
                                />
                            ))}

                            {/* Events */}
                            {events
                                .filter((event) => isSameDay(new Date(event.start), day))
                                .map((event) => {
                                    const start = new Date(event.start);
                                    const end = new Date(event.end);
                                    const startMinutes = start.getHours() * 60 + start.getMinutes();
                                    const durationMinutes =
                                        (end.getTime() - start.getTime()) / (1000 * 60);

                                    return (
                                        <EventBlock
                                            key={event.id}
                                            event={event}
                                            style={{
                                                top: `${startMinutes}px`, // 1px per minute
                                                height: `${durationMinutes}px`,
                                            }}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                if (confirm(`Delete event "${event.title}"?`)) {
                                                    // delete logic would go here
                                                }
                                            }}
                                        />
                                    );
                                })}
                        </div>
                    ))}
                </Grid>
            </div>
        </Stack>
    );
}
