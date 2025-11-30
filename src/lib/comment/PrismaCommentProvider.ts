import { prisma } from "~/src/lib/db/prisma";
import { Comment, CreateCommentInput } from "~/src/lib/types";

import { CommentProvider } from "./CommentProvider";

/**
 * Prisma Comment Provider 实现
 * 直接从数据库读取评论数据
 */
export class PrismaCommentProvider implements CommentProvider {
    /**
     * 获取文章评论,构建嵌套结构
     */
    async getCommentsByPostSlug(postSlug: string): Promise<Comment[]> {
        // 查询所有评论(包括回复)
        const comments = await prisma.comment.findMany({
            where: { postSlug },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        image: true,
                    },
                },
            },
            orderBy: {
                createdAt: "desc", // 最新的在前面
            },
        });
        // 构建嵌套结构: 顶层评论 + 回复
        const commentMap = new Map<string, Comment>();
        const rootComments: Comment[] = [];
        // 第一遍: 创建所有评论对象
        comments.forEach((comment) => {
            commentMap.set(comment.id, {
                ...comment,
                replies: [],
            });
        });
        // 第二遍: 构建父子关系
        comments.forEach((comment) => {
            const commentObj = commentMap.get(comment.id)!;
            if (comment.parentId) {
                // 这是一个回复,添加到父评论的 replies 中
                const parent = commentMap.get(comment.parentId);
                if (parent) {
                    parent.replies!.push(commentObj);
                }
            } else {
                // 这是顶层评论
                rootComments.push(commentObj);
            }
        });
        return rootComments;
    }
    /**
     * 创建评论
     */
    async createComment(data: CreateCommentInput): Promise<Comment> {
        const comment = await prisma.comment.create({
            data: {
                postSlug: data.postSlug,
                userId: data.userId,
                content: data.content,
                parentId: data.parentId,
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        image: true,
                    },
                },
            },
        });
        return {
            ...comment,
            replies: [],
        };
    }
    /**
     * 删除评论(仅允许删除自己的评论)
     */
    async deleteComment(id: string, userId: string): Promise<void> {
        // 先查询评论,验证所有权
        const comment = await prisma.comment.findUnique({
            where: { id },
        });
        if (!comment) {
            throw new Error("Comment not found");
        }
        if (comment.userId !== userId) {
            throw new Error("Unauthorized: You can only delete your own comments");
        }
        // 删除评论(级联删除回复)
        await prisma.comment.delete({
            where: { id },
        });
    }
}
