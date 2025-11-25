"use client";

import { Card, CardContent, CardHeader, CardTitle } from "~/src/components/ui/card";
import { Flex, Stack } from "~/src/components/ui/layout";

interface StatsWidgetProps {
    totalPosts: number;
    totalTags: number;
}

export function StatsWidget({ totalPosts, totalTags }: StatsWidgetProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="font-mono text-lg">创作统计</CardTitle>
            </CardHeader>
            <CardContent>
                <Stack gap="1rem">
                    <Flex direction="column" gap="0.25rem">
                        <span className="font-mono text-3xl font-bold">{totalPosts}</span>
                        <span className="text-muted-foreground text-sm">文章总数</span>
                    </Flex>
                    <div className="bg-border h-px" />
                    <Flex direction="column" gap="0.25rem">
                        <span className="font-mono text-3xl font-bold">{totalTags}</span>
                        <span className="text-muted-foreground text-sm">标签分类</span>
                    </Flex>
                </Stack>
            </CardContent>
        </Card>
    );
}
