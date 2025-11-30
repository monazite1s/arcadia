import { NextRequest, NextResponse } from "next/server";

import { requireAuth } from "~/src/lib/auth";
import { getGuestbookProvider } from "~/src/lib/guestbook";

const guestbookProvider = getGuestbookProvider();
/**
 * 清理和验证留言内容
 */
function sanitizeContent(content: string): string {
    let sanitized = content.trim();

    const MAX_LENGTH = 500; // 留言板限制更短
    if (sanitized.length > MAX_LENGTH) {
        throw new Error(`Message too long (max ${MAX_LENGTH} characters)`);
    }

    if (sanitized.length === 0) {
        throw new Error("Message cannot be empty");
    }

    // 移除控制字符
    sanitized = sanitized.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "");

    return sanitized;
}
/**
 * GET /api/guestbook
 * 获取所有留言
 */
export async function GET() {
    try {
        const entries = await guestbookProvider.getEntries();
        return NextResponse.json(entries);
    } catch (error) {
        console.error("Failed to fetch guestbook entries:", error);
        return NextResponse.json({ error: "Failed to fetch entries" }, { status: 500 });
    }
}
/**
 * POST /api/guestbook
 * 创建新留言(需要登录)
 */
export async function POST(request: NextRequest) {
    try {
        // 验证用户登录
        const user = await requireAuth();
        const body = await request.json();
        // 验证和清理输入
        const sanitizedContent = sanitizeContent(body.content);
        // 创建留言
        const entry = await guestbookProvider.createEntry(user.id, sanitizedContent);
        return NextResponse.json(entry, { status: 201 });
    } catch (error) {
        console.error("Failed to create guestbook entry:", error);
        if (error instanceof Error) {
            if (error.message === "Unauthorized") {
                return NextResponse.json(
                    { error: "Please login to leave a message" },
                    { status: 401 }
                );
            }
            if (error.message.includes("Message")) {
                return NextResponse.json({ error: error.message }, { status: 400 });
            }
        }
        return NextResponse.json({ error: "Failed to create entry" }, { status: 500 });
    }
}
