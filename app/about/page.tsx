import Link from "next/link";

import { ArticleBody } from "@/components/blog/ArticleBody";
import { Stack } from "@/components/ui/layout";

export const metadata = {
    title: "关于 | Arcadia",
    description: "关于 Arcadia 博客",
};

const aboutContent = `
# 关于 Arcadia

欢迎来到 Arcadia！这是一个基于 Next.js 构建的现代化全栈博客系统。

## 项目特点

- 🎨 **卡其色主题** - 复古游戏风格的视觉设计
- 📝 **Markdown 支持** - 使用 MDX 编写文章
- 📅 **日历管理** - 内置待办事项管理
- 🏷️ **标签系统** - 灵活的文章分类
- 📚 **时间线归档** - 按时间浏览所有文章
- 🌓 **深色模式** - 支持明暗主题切换

## 技术栈

- **框架**: Next.js 16 (App Router)
- **样式**: Tailwind CSS + shadcn/ui
- **内容**: MDX + Gray-matter
- **状态管理**: Zustand
- **日期处理**: date-fns
- **代码规范**: ESLint + Prettier + Husky

## 架构设计

Arcadia 采用高度模块化的架构设计：

- **Provider 模式** - 统一的内容获取接口
- **组件化** - 可复用的 UI 组件
- **主题系统** - 可插拔的主题支持
- **工程化** - 完整的代码规范和 CI/CD

## 开始使用

\`\`\`bash
# 安装依赖
yarn install

# 开发模式
yarn dev

# 构建生产版本
yarn build
\`\`\`

## 联系方式

如有任何问题或建议，欢迎通过以下方式联系：

- GitHub: [Your GitHub](https://github.com)
- Email: your@email.com

---

*Built with ❤️ using Next.js*
`;

export default function AboutPage() {
    return (
        <div className="container mx-auto max-w-4xl px-4 py-12">
            <Stack gap="2rem">
                <Link
                    href="/"
                    className="text-muted-foreground hover:text-foreground border-border hover:border-foreground inline-flex items-center border px-3 py-1.5 font-mono text-sm transition-colors"
                >
                    ← 返回首页
                </Link>

                <ArticleBody>{aboutContent}</ArticleBody>
            </Stack>
        </div>
    );
}
