import { Card } from "~/src/components/ui/card";
import { Flex, Stack } from "~/src/components/ui/layout";

interface ConfirmDialogProps {
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
}

/**
 * 确认对话框组件
 */
export function ConfirmDialog({ isOpen, title, message, onConfirm, onCancel }: ConfirmDialogProps) {
    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm"
            onClick={onCancel}
        >
            <Card
                className="khaki-card m-4 w-full max-w-sm p-6"
                onClick={(e) => e.stopPropagation()}
            >
                <Stack gap="1.5rem">
                    <Stack gap="0.5rem">
                        <h3 className="text-lg font-bold">{title}</h3>
                        <p className="text-muted-foreground text-sm">{message}</p>
                    </Stack>

                    <Flex gap="0.75rem" justify="end">
                        <button
                            onClick={onCancel}
                            className="border-border hover:bg-muted/50 rounded border-2 px-4 py-2 text-sm font-medium transition-colors"
                        >
                            取消
                        </button>
                        <button
                            onClick={onConfirm}
                            className="border-border hover:bg-destructive/50 rounded border-2 px-4 py-2 text-sm font-medium transition-colors"
                        >
                            确定删除
                        </button>
                    </Flex>
                </Stack>
            </Card>
        </div>
    );
}
