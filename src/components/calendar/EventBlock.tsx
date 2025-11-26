import { format } from "date-fns";
import { CalendarEvent } from "~/src/lib/types";
import { cn } from "~/src/lib/utils";

interface EventBlockProps {
    event: CalendarEvent;
    onClick?: (e: React.MouseEvent) => void;
    style?: React.CSSProperties;
    className?: string;
}

export function EventBlock({ event, onClick, style, className }: EventBlockProps) {
    return (
        <div
            className={cn(
                "bg-primary/80 text-primary-foreground border-primary-foreground/20 hover:bg-primary absolute right-1 left-1 cursor-pointer overflow-hidden rounded-md border p-1 text-xs shadow-sm transition-colors",
                className
            )}
            style={style}
            onClick={onClick}
        >
            <div className="truncate text-sm font-semibold">{event.title}</div>
            <div className="truncate text-xs opacity-80">
                {format(new Date(event.date), "MMM d, yyyy")}
            </div>
        </div>
    );
}
