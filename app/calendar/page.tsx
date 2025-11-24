import { MonthlyCalendar } from "@/components/calendar/MonthlyCalendar";

export const metadata = {
    title: "日历 | Arcadia",
    description: "个人日历与待办管理",
};

export default function CalendarPage() {
    return (
        <div className="mx-auto h-full max-w-5xl">
            <MonthlyCalendar />
        </div>
    );
}
