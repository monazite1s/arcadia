"use client";

import { useEffect, useState } from "react";

import {
    addMonths,
    eachDayOfInterval,
    endOfMonth,
    endOfWeek,
    isSameDay,
    startOfMonth,
    startOfWeek,
    subMonths,
} from "date-fns";
import { Card } from "~/src/components/ui/card";
import { Grid, Stack } from "~/src/components/ui/layout";

import { CalendarDayCell } from "./CalendarDayCell";
import { CalendarHeader } from "./CalendarHeader";
import { TodoDialog } from "./TodoDialog";
import { useCalendarStore } from "./useCalendarStore";

// 星期标题
const WEEK_DAYS = ["日", "一", "二", "三", "四", "五", "六"];

/**
 * 月度日历组件
 * 显示月视图的日历,支持事件管理
 */
export function MonthlyCalendar() {
    // 本地状态
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    // Store 状态
    const { events, fetchEvents } = useCalendarStore();

    // 计算日历范围
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    const calendarStart = startOfWeek(monthStart, { weekStartsOn: 0 });
    const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });
    const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

    /**
     * 获取某一天的所有事件
     */
    const getDayEvents = (day: Date) => {
        return events.filter((event) => {
            const eventDate = new Date(event.date);
            return isSameDay(eventDate, day);
        });
    };

    /**
     * 当月份变化时,获取该月的事件数据
     */
    useEffect(() => {
        const start = startOfWeek(monthStart, { weekStartsOn: 0 });
        const end = endOfWeek(monthEnd, { weekStartsOn: 0 });
        fetchEvents(start, end);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentMonth]);

    // 事件处理函数
    const handlePrevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
    const handleNextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
    const handleToday = () => setCurrentMonth(new Date());
    const handleDayClick = (day: Date) => {
        setSelectedDate(day);
        setIsDialogOpen(true);
    };

    return (
        <Stack gap="0.75rem" className="h-full p-3">
            {/* 月份导航头部 */}
            <Card className="khaki-card p-2">
                <CalendarHeader
                    currentMonth={currentMonth}
                    onPrevMonth={handlePrevMonth}
                    onNextMonth={handleNextMonth}
                    onToday={handleToday}
                />
            </Card>

            {/* 日历网格 */}
            <Card className="khaki-card p-2">
                <Stack gap="0">
                    {/* 星期标题行 */}
                    <Grid columns={7} gap="0" className="border-border mb-0.5 border-b-2 pb-0.5">
                        {WEEK_DAYS.map((day) => (
                            <div
                                key={day}
                                className="text-muted-foreground py-0.5 text-center text-[10px] font-bold"
                            >
                                {day}
                            </div>
                        ))}
                    </Grid>

                    {/* 日期网格 */}
                    <Grid columns={7} gap="0.25rem">
                        {days.map((day) => (
                            <CalendarDayCell
                                key={day.toString()}
                                day={day}
                                currentMonth={currentMonth}
                                events={getDayEvents(day)}
                                onClick={handleDayClick}
                            />
                        ))}
                    </Grid>
                </Stack>
            </Card>

            {/* 事件管理对话框 */}
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
