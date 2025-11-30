import { NextRequest, NextResponse } from "next/server";

import { requireAuth } from "~/src/lib/auth";
import { getGuestbookProvider } from "~/src/lib/guestbook";

const guestbookProvider = getGuestbookProvider();
/**
 * DELETE /api/guestbook/[id]
 * 删除留言(仅允许删除自己的留言)
 */
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        // 验证用户登录
        const user = await requireAuth();
        const { id } = await params;
        // 删除留言(Provider 会验证所有权)
        await guestbookProvider.deleteEntry(id, user.id);
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Failed to delete guestbook entry:", error);
        if (error instanceof Error) {
            if (error.message === "Unauthorized") {
                return NextResponse.json(
                    { error: "Please login to delete entries" },
                    { status: 401 }
                );
            }
            if (error.message.includes("Unauthorized:")) {
                return NextResponse.json({ error: error.message }, { status: 403 });
            }
        }
        return NextResponse.json({ error: "Failed to delete entry" }, { status: 500 });
    }
}
