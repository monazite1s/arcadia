"use client";

import { ReactNode } from "react";

import { SessionProvider } from "next-auth/react";

/**
 * Auth Provider 包装器
 * 使用 NextAuth 的 SessionProvider 提供客户端 session 访问
 */
export function AuthProvider({ children }: { children: ReactNode }) {
    return <SessionProvider>{children}</SessionProvider>;
}
