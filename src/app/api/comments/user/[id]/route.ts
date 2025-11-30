import { NextRequest, NextResponse } from "next/server";

import { requireAuth } from "~/src/lib/auth";
import { getCommentProvider } from "~/src/lib/comment";

const commentProvider = getCommentProvider();
/**
 * DELETE /api/comments/user/[id]
 * 删除评论(仅允许删除自己的评论)
 */
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        // 验证用户登录
        const user = await requireAuth();
        const { id } = await params;
        // 删除评论(Provider 会验证所有权)
        await commentProvider.deleteComment(id, user.id);
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Failed to delete comment:", error);
        if (error instanceof Error) {
            if (error.message === "Unauthorized") {
                return NextResponse.json(
                    { error: "Please login to delete comments" },
                    { status: 401 }
                );
            }
            if (error.message.includes("Unauthorized:")) {
                return NextResponse.json({ error: error.message }, { status: 403 });
            }
        }
        return NextResponse.json({ error: "Failed to delete comment" }, { status: 500 });
    }
}
