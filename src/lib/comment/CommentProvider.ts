import { Comment, CreateCommentInput } from "~/src/lib/types";

/**
 * Comment Provider 接口
 * 抽象评论数据访问,支持多种实现(Prisma, API 等)
 */
export interface CommentProvider {
    /**
     * 获取文章的所有评论(包括嵌套回复)
     * @param postSlug 文章 slug
     */
    getCommentsByPostSlug(slug: string): Promise<Comment[]>;
    /**
     * 创建新评论
     * @param data 评论数据
     */
    createComment(data: CreateCommentInput): Promise<Comment>;
    /**
     * 删除评论
     * @param id 评论 ID
     * @param userId 当前用户 ID (用于权限验证)
     */
    deleteComment(id: string, userId: string): Promise<void>;
}
