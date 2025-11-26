import { format, isBefore, isSameMonth, isToday, startOfDay } from "date-fns";
import { Stack } from "~/src/components/ui/layout";
import { CalendarEvent } from "~/src/lib/types";
import { cn } from "~/src/lib/utils";

import { CalendarEventList } from "./CalendarEventList";

interface CalendarDayCellProps {
    day: Date;
    currentMonth: Date;
    events: CalendarEvent[];
    onClick: (day: Date) => void;
}

/**
 * 日历日期单元格组件
 * 显示日期数字和该日的事件列表
 */
export function CalendarDayCell({ day, currentMonth, events, onClick }: CalendarDayCellProps) {
    const today = startOfDay(new Date());
    const isCurrentMonth = isSameMonth(day, currentMonth);
    const isCurrentDay = isToday(day);
    const isPast = isBefore(day, today) && !isCurrentDay;

    return (
        <button
            onClick={() => onClick(day)}
            className={cn(
                "relative rounded border-2 p-1 transition-all",
                "hover:border-primary hover:shadow-md",
                "aspect-[4/3]",
                // 非当前月份:浅灰色
                !isCurrentMonth && "border-border/30 bg-muted/10 opacity-30",
                // 当前月份样式
                isCurrentMonth && "border-border bg-card",
                // 过去的日期:稍微变灰
                isPast && isCurrentMonth && "opacity-60",
                // 今天:特殊高亮
                isCurrentDay &&
                    "border-primary bg-primary/20 ring-primary/30 border-3 opacity-100 shadow-lg ring-1"
            )}
            style={{ minHeight: "40px" }}
            aria-label={`${format(day, "yyyy年M月d日")}${events.length > 0 ? `, ${events.length}个事件` : ""}`}
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

                <CalendarEventList events={events} maxVisible={2} />
            </Stack>
        </button>
    );
}
