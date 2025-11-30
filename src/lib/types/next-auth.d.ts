import { DefaultSession } from "next-auth";

declare module "next-auth" {
    /**
     * 扩展 Session 类型,添加用户 ID
     */
    interface Session {
        user: {
            id: string;
        } & DefaultSession["user"];
    }

    /**
     * 扩展 User 类型
     */
    interface User {
        id: string;
    }
}

// 使用 declare module 可以扩展第三方库的类型定义
declare module "next-auth/jwt" {
    /**
     * 扩展 JWT 类型,添加用户 ID
     */
    interface JWT {
        id: string;
    }
}
