import { CalendarEvent } from "~/src/lib/types";
import { cn } from "~/src/lib/utils";

// 事件颜色主题配置
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

interface CalendarEventListProps {
    events: CalendarEvent[];
    maxVisible?: number;
}

/**
 * 日历事件列表组件 - 显示某一天的事件
 * @param events - 事件列表
 * @param maxVisible - 最多显示的事件数量,默认为 2
 */
export function CalendarEventList({ events, maxVisible = 2 }: CalendarEventListProps) {
    if (events.length === 0) return null;

    const visibleEvents = events.slice(0, maxVisible);
    const remainingCount = events.length - maxVisible;

    return (
        <div className="w-full flex-1 overflow-hidden">
            {visibleEvents.map((event, idx) => {
                const color = TODO_COLORS[idx % TODO_COLORS.length];
                return (
                    <div
                        key={event.id || idx}
                        className={cn(
                            "mb-0.5 truncate rounded border px-1 py-0.5 text-[11px] leading-tight",
                            color.bg,
                            color.text,
                            color.border
                        )}
                        title={event.title}
                    >
                        {event.title}
                    </div>
                );
            })}
            {remainingCount > 0 && (
                <div className="text-muted-foreground text-[9px] font-medium">
                    +{remainingCount}
                </div>
            )}
        </div>
    );
}
