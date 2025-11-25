import { ReactNode } from "react";

interface AlertProps {
    /** 提示类型：info(信息)、warning(警告)、error(错误)、success(成功) */
    type?: "info" | "warning" | "error" | "success";
    /** 提示标题（可选） */
    title?: string;
    /** 提示内容 */
    children: ReactNode;
}

/**
 * Alert 组件 - 提示框
 *
 * 用于在文章中显示重要提示、警告、错误或成功信息
 *
 * 🎨 主题支持：
 * - 自动适配 dark/light 模式
 * - 使用 CSS 变量，无需手动处理主题切换
 * - 所有颜色在 globals.css 中统一管理
 *
 * @example
 * ```mdx
 * <Alert type="info" title="提示">
 *   这是一个信息提示框
 * </Alert>
 *
 * <Alert type="warning" title="注意">
 *   这是一个警告提示框
 * </Alert>
 * ```
 */
export function Alert({ type = "info", title, children }: AlertProps) {
    // 🎨 使用 CSS 变量，自动适配主题
    // 所有颜色定义在 globals.css 中：
    // --mdx-alert-{type}-bg
    // --mdx-alert-{type}-border
    // --mdx-alert-{type}-text
    const typeClass = `alert-${type}`;

    const icons = {
        info: "💡",
        warning: "⚠️",
        error: "❌",
        success: "✅",
    };

    return (
        <div className={`my-2 rounded-lg border-2 p-4 ${typeClass}`}>
            {title && (
                <div className="mb-2 flex items-center gap-2 font-bold">
                    <span>{icons[type]}</span>
                    <span>{title}</span>
                </div>
            )}
            <div className="prose-sm dark:prose-invert">{children}</div>
        </div>
    );
}

interface CalloutProps {
    /** 自定义 emoji 图标，默认为 📌 */
    emoji?: string;
    /** 标注内容 */
    children: ReactNode;
}

/**
 * Callout 组件 - 标注框
 *
 * 用于突出显示重要内容或补充说明
 *
 * 🎨 主题支持：
 * - 自动适配 dark/light 模式
 * - 使用 --mdx-callout-* CSS 变量
 *
 * @example
 * ```mdx
 * <Callout emoji="📌">
 *   这是一个重点标注
 * </Callout>
 *
 * <Callout emoji="💡">
 *   这是一个提示
 * </Callout>
 * ```
 */
export function Callout({ emoji = "📌", children }: CalloutProps) {
    return (
        <div className="callout my-2 rounded-lg border-l-4 p-4">
            <div className="flex items-center gap-3">
                <span className="text-2xl">{emoji}</span>
                <div className="prose-sm dark:prose-invert flex-1">{children}</div>
            </div>
        </div>
    );
}

interface CodeSandboxProps {
    /** CodeSandbox 项目 ID */
    id: string;
    /** iframe 标题，用于可访问性 */
    title?: string;
}

/**
 * CodeSandbox 组件 - 嵌入 CodeSandbox
 *
 * 用于在文章中嵌入可交互的代码示例
 *
 * @example
 * ```mdx
 * <CodeSandbox id="react-new" title="React 示例" />
 * ```
 */
export function CodeSandbox({ id, title = "CodeSandbox" }: CodeSandboxProps) {
    return (
        <div className="my-2">
            <iframe
                src={`https://codesandbox.io/embed/${id}?fontsize=14&hidenavigation=1&theme=dark`}
                style={{
                    width: "100%",
                    height: "500px",
                    border: 0,
                    borderRadius: "8px",
                    overflow: "hidden",
                }}
                title={title}
                allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
                sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
            />
        </div>
    );
}

interface YouTubeProps {
    /** YouTube 视频 ID（URL 中 v= 后面的部分） */
    id: string;
    /** 视频标题，用于可访问性 */
    title?: string;
}

/**
 * YouTube 组件 - 嵌入 YouTube 视频
 *
 * 用于在文章中嵌入 YouTube 视频
 *
 * @example
 * ```mdx
 * <YouTube id="dQw4w9WgXcQ" title="视频标题" />
 * ```
 */
export function YouTube({ id, title = "YouTube video" }: YouTubeProps) {
    return (
        <div className="my-2 aspect-video">
            <iframe
                className="h-full w-full rounded-lg"
                src={`https://www.youtube.com/embed/${id}`}
                title={title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
            />
        </div>
    );
}

interface TweetProps {
    /** 推文 ID（URL 中 status/ 后面的数字） */
    id: string;
}

/**
 * Tweet 组件 - 嵌入推文
 *
 * 用于在文章中嵌入 Twitter/X 推文
 *
 * @example
 * ```mdx
 * <Tweet id="1234567890" />
 * ```
 *
 * @note 需要在页面中加载 Twitter 的嵌入脚本才能正常显示
 */
export function Tweet({ id }: TweetProps) {
    return (
        <div className="my-2 flex justify-center">
            <blockquote className="twitter-tweet">
                <a href={`https://twitter.com/x/status/${id}`}>Loading tweet...</a>
            </blockquote>
        </div>
    );
}
