"use client";

import { signIn, signOut, useSession } from "next-auth/react";

import { Avatar } from "~/src/components/ui/Avatar";
import { Button } from "~/src/components/ui/button";

/**
 * 认证按钮组件
 * 未登录显示"登录",已登录显示用户信息和"登出"
 */
export function AuthButton() {
    const { data: session, status } = useSession();

    // 加载中状态
    if (status === "loading") {
        return <Button disabled>加载中...</Button>;
    }

    // 未登录
    if (!session) {
        return (
            <Button onClick={() => signIn("github")} variant="outline">
                GitHub 登录
            </Button>
        );
    }

    // 已登录
    return (
        <div className="flex items-center gap-2">
            <Avatar src={session.user.image} alt={session.user.name ?? "User"} size={28} />
            <span className="max-w-[100px] truncate text-sm">{session.user.name}</span>
            <Button onClick={() => signOut()} variant="ghost" size="sm">
                登出
            </Button>
        </div>
    );
}
