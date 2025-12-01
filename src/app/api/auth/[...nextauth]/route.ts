import NextAuth, { NextAuthOptions } from "next-auth";
import GithubProvider from "next-auth/providers/github";

import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "~/src/lib/db/prisma";

/**
 * NextAuth.js v4 配置选项
 *
 * 学习点:
 * - v4 使用 NextAuthOptions 类型
 * - adapter 使用 PrismaAdapter 自动处理用户/会话存储
 * - session.strategy = "jwt" 使用 JWT 而不是数据库 session
 */
export const authOptions: NextAuthOptions = {
    adapter: PrismaAdapter(prisma),
    secret: process.env.NEXTAUTH_SECRET,
    providers: [
        GithubProvider({
            clientId: process.env.AUTH_GITHUB_ID!,
            clientSecret: process.env.AUTH_GITHUB_SECRET!,
        }),
    ],
    session: {
        strategy: "jwt", // 使用 JWT,不影响 SSG/ISR
    },
    callbacks: {
        /**
         * JWT callback: 将用户 ID 添加到 token
         * 在用户登录时调用
         */
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
            }
            return token;
        },
        /**
         * Session callback: 将用户 ID 从 token 添加到 session
         * 每次访问 session 时调用
         */
        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id as string;
            }
            return session;
        },
    },
    pages: {
        signIn: "/auth/signin", // 自定义登录页面(可选)
    },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
