import { format } from "date-fns";
import { Flex } from "~/src/components/ui/layout";

interface CalendarHeaderProps {
    currentMonth: Date;
    onPrevMonth: () => void;
    onNextMonth: () => void;
    onToday: () => void;
}

/**
 * 日历头部组件 - 月份导航控制
 */
export function CalendarHeader({
    currentMonth,
    onPrevMonth,
    onNextMonth,
    onToday,
}: CalendarHeaderProps) {
    return (
        <Flex align="center" justify="between">
            <button
                onClick={onPrevMonth}
                className="border-border hover:bg-muted/50 rounded border-2 px-2 py-1 text-xs font-bold transition-colors"
                aria-label="上一月"
            >
                ←
            </button>

            <Flex align="center" gap="0.5rem">
                <h2 className="text-foreground font-mono text-lg font-bold">
                    {format(currentMonth, "yyyy年 M月")}
                </h2>
                <button
                    onClick={onToday}
                    className="khaki-button px-1.5 py-0.5 text-[10px]"
                    aria-label="回到今天"
                >
                    今天
                </button>
            </Flex>

            <button
                onClick={onNextMonth}
                className="border-border hover:bg-muted/50 rounded border-2 px-2 py-1 text-xs font-bold transition-colors"
                aria-label="下一月"
            >
                →
            </button>
        </Flex>
    );
}
