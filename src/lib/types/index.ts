import { ReactNode } from "react";

import { User } from "next-auth";

import { GuestbookEntry } from "@prisma/client";

export interface Post {
    slug: string;
    title: string;
    date: string;
    tags: string[];
    content: ReactNode; // MDX content or compiled HTML
    excerpt?: string;
    series?: string; // 专栏名称
}

export interface About {
    slug: string;
    title: string;
    content: ReactNode; // MDX content or compiled HTML
}

export interface Tag {
    name: string;
    count: number;
}

/**
 * Next Auth Provider
 */
export interface AuthProvider {
    getCurrentUser(): Promise<User | null>;
    signIn(provider: "github" | "wechat"): Promise<void>;
    signOut(): Promise<void>;
}

/**
 * Comment
 */
export interface Comment {
    id: string;
    postSlug: string;
    userId: string;
    content: string;
    parentId?: string | null;
    user: {
        id: string;
        name: string | null;
        image: string | null;
    };
    replies?: Comment[]; // 回复
    createdAt: Date;
    updatedAt: Date;
}

export interface CreateCommentInput {
    userId: string;
    postSlug: string;
    content: string;
    parentId?: string;
}

export interface CommentProvider {
    getCommentsByPostSlug(slug: string): Promise<Comment[]>;
    createComment(data: CreateCommentInput): Promise<Comment>;
    deleteComment(id: string): Promise<void>;
}

/**
 * Guestbook Provider
 */
export interface GuestbookProvider {
    getEntries(): Promise<GuestbookEntry[]>;
    createEntry(content: string): Promise<GuestbookEntry>;
    deleteEntry(id: string): Promise<void>;
}

/**
 * Documentation System Types
 */
export interface DocPage {
    slug: string;
    title: string;
    content: ReactNode;
    order: number;
}

export interface DocCategory {
    title: string;
    slug: string;
    order: number;
    children?: DocCategory[];
    pages?: DocPage[];
}
