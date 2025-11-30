import Image from "next/image";

interface AvatarProps {
    src: string | null | undefined;
    alt: string;
    size?: number;
    className?: string;
}

/**
 * 用户头像组件
 * 封装 Next.js Image,提供统一的头像显示
 *
 * @param src 头像 URL
 * @param alt 替代文本
 * @param size 尺寸(默认 32px)
 * @param className 额外的 CSS 类名
 */
export function Avatar({ src, alt, size = 32, className = "" }: AvatarProps) {
    const avatarSrc = src || "/default-avatar.png";

    return (
        <Image
            src={avatarSrc}
            alt={alt}
            width={size}
            height={size}
            className={`rounded-full ${className}`}
            unoptimized={avatarSrc.startsWith("http")} // 外部图片不优化
        />
    );
}
