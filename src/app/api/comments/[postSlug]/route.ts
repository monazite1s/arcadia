import { NextRequest, NextResponse } from "next/server";

import { requireAuth } from "~/src/lib/auth";
import { getCommentProvider } from "~/src/lib/comment";

const commentProvider = getCommentProvider();
/**
 * GET /api/comments/[postSlug]
 * 获取文章的所有评论
 */
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ postSlug: string }> }
) {
    try {
        const { postSlug } = await params;
        const comments = await commentProvider.getCommentsByPostSlug(postSlug);
        return NextResponse.json(comments);
    } catch (error) {
        console.error("Failed to fetch comments:", error);
        return NextResponse.json({ error: "Failed to fetch comments" }, { status: 500 });
    }
}
/**
 * POST /api/comments/[postSlug]
 * 创建新评论(需要登录)
 */
export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ postSlug: string }> }
) {
    try {
        // 验证用户登录
        const user = await requireAuth();
        const { postSlug } = await params;
        const body = await request.json();

        // ✅ 验证和清理输入
        const sanitizedContent = sanitizeCommentContent(body.content);

        // 创建评论
        const comment = await commentProvider.createComment({
            postSlug,
            userId: user.id,
            content: sanitizedContent,
            parentId: body.parentId,
        });
        return NextResponse.json(comment, { status: 201 });
    } catch (error) {
        console.error("Failed to create comment:", error);

        if (error instanceof Error) {
            if (error.message === "Unauthorized") {
                return NextResponse.json({ error: "Please login to comment" }, { status: 401 });
            }
            // 返回验证错误
            if (error.message.includes("Comment")) {
                return NextResponse.json({ error: error.message }, { status: 400 });
            }
        }

        return NextResponse.json({ error: "Failed to create comment" }, { status: 500 });
    }
}

function sanitizeCommentContent(content: string): string {
    // 1. 移除首尾空白
    let sanitized = content.trim();

    // 2. 限制长度 (防止超长内容攻击)
    const MAX_LENGTH = 2000;
    if (sanitized.length > MAX_LENGTH) {
        throw new Error(`Comment too long (max ${MAX_LENGTH} characters)`);
    }

    // 3. 检查是否为空
    if (sanitized.length === 0) {
        throw new Error("Comment cannot be empty");
    }

    // 4. 移除控制字符 (可选,保留换行符)
    sanitized = sanitized.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "");

    return sanitized;
}
