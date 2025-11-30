import { getServerSession } from "next-auth";

import { authOptions } from "~/src/app/api/auth/[...nextauth]/route";

/**
 * 获取当前登录用户 (服务端)
 *
 * 使用场景:
 * - Server Components: 在页面中获取用户信息
 * - API Routes: 验证用户身份
 *
 * 学习点:
 * - getServerSession 只能在服务端使用
 * - 需要传入 authOptions 配置
 * - 返回 session?.user 或 null
 */
export async function getCurrentUser() {
    const session = await getServerSession(authOptions);
    return session?.user ?? null;
}

/**
 * 要求用户登录,否则抛出错误
 *
 * 使用场景:
 * - 保护需要认证的 API Routes
 *
 * 示例:
 * ```typescript
 * export async function POST(req: Request) {
 *     const user = await requireAuth(); // 未登录会抛出错误
 *     // ... 处理请求
 * }
 * ```
 */
export async function requireAuth() {
    const user = await getCurrentUser();
    if (!user) {
        throw new Error("Unauthorized");
    }
    return user;
}
