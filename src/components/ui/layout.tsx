import * as React from "react";

import { cn } from "~/src/lib/utils";

// Flex Component
export interface FlexProps extends React.HTMLAttributes<HTMLDivElement> {
    direction?: "row" | "column" | "row-reverse" | "column-reverse";
    align?: "start" | "center" | "end" | "stretch" | "baseline";
    justify?: "start" | "center" | "end" | "between" | "around" | "evenly";
    wrap?: "nowrap" | "wrap" | "wrap-reverse";
    gap?: number | string;
    as?: React.ElementType;
}

export const Flex = React.forwardRef<HTMLDivElement, FlexProps>(
    (
        {
            className,
            direction = "row",
            align,
            justify,
            wrap,
            gap,
            style,
            as: Component = "div",
            ...props
        },
        ref
    ) => {
        return (
            <Component
                ref={ref}
                className={cn(
                    "flex",
                    direction === "column" && "flex-col",
                    direction === "row-reverse" && "flex-row-reverse",
                    direction === "column-reverse" && "flex-col-reverse",
                    align === "start" && "items-start",
                    align === "center" && "items-center",
                    align === "end" && "items-end",
                    align === "stretch" && "items-stretch",
                    align === "baseline" && "items-baseline",
                    justify === "start" && "justify-start",
                    justify === "center" && "justify-center",
                    justify === "end" && "justify-end",
                    justify === "between" && "justify-between",
                    justify === "around" && "justify-around",
                    justify === "evenly" && "justify-evenly",
                    wrap === "wrap" && "flex-wrap",
                    wrap === "wrap-reverse" && "flex-wrap-reverse",
                    wrap === "nowrap" && "flex-nowrap",
                    className
                )}
                style={{ gap, ...style }}
                {...props}
            />
        );
    }
);
Flex.displayName = "Flex";

// Stack Component (Vertical Flex)
export type StackProps = Omit<FlexProps, "direction">;

export const Stack = React.forwardRef<HTMLDivElement, StackProps>(
    ({ className, align = "stretch", gap = "1rem", ...props }, ref) => {
        return (
            <Flex
                ref={ref}
                direction="column"
                align={align}
                gap={gap}
                className={className}
                {...props}
            />
        );
    }
);
Stack.displayName = "Stack";

// Grid Component
export interface GridProps extends React.HTMLAttributes<HTMLDivElement> {
    columns?: number | string;
    rows?: number | string;
    gap?: number | string;
    align?: "start" | "center" | "end" | "stretch";
    justify?: "start" | "center" | "end" | "stretch";
}

export const Grid = React.forwardRef<HTMLDivElement, GridProps>(
    ({ className, columns, rows, gap, align, justify, style, ...props }, ref) => {
        return (
            <div
                ref={ref}
                className={cn(
                    "grid",
                    align === "start" && "items-start",
                    align === "center" && "items-center",
                    align === "end" && "items-end",
                    align === "stretch" && "items-stretch",
                    justify === "start" && "justify-items-start",
                    justify === "center" && "justify-items-center",
                    justify === "end" && "justify-items-end",
                    justify === "stretch" && "justify-items-stretch",
                    className
                )}
                style={{
                    gridTemplateColumns:
                        typeof columns === "number"
                            ? `repeat(${columns}, minmax(0, 1fr))`
                            : columns,
                    gridTemplateRows:
                        typeof rows === "number" ? `repeat(${rows}, minmax(0, 1fr))` : rows,
                    gap,
                    ...style,
                }}
                {...props}
            />
        );
    }
);
Grid.displayName = "Grid";
