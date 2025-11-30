import { CommentProvider } from "./CommentProvider";
import { PrismaCommentProvider } from "./PrismaCommentProvider";

/**
 * Comment Provider 工厂函数
 * 默认使用 Prisma 实现
 */
export function getCommentProvider(): CommentProvider {
    return new PrismaCommentProvider();
}
export type { CommentProvider };
