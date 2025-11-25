/**
 * 主题系统配置文件
 * * 这个文件定义了所有主题变量，确保 dark 和 light 模式的属性一一对应
 * 所有业务代码应该使用这里定义的 CSS 变量，而不是直接使用颜色值
 */

/**
 * 主题颜色定义
 * 使用 HSL 格式：hue saturation lightness
 */

// 定义所有颜色值最终的类型：即 HSL 字符串
type HSLString = string;

// 定义递归的主题颜色值类型
// 如果值是 HSL 字符串，则返回 HSLString
// 如果值是对象，则递归应用 ThemeColorValues
export type ThemeColorValues<T> = {
    [K in keyof T]: T[K] extends HSLString
        ? HSLString
        : T[K] extends object
          ? ThemeColorValues<T[K]> // 递归调用自身处理嵌套对象
          : never; // 确保没有其他类型
};

export const lightTheme = {
    // ===== 基础颜色 =====
    background: "33 24% 97%", // #FBF8F4 米白色背景
    foreground: "30 15% 30%", // #5C4F3D 深棕色文字

    // ===== 卡片 =====
    card: "33 24% 97%", // 米白色卡片
    cardForeground: "30 15% 30%", // 深棕色文字

    // ===== 弹出层 =====
    popover: "33 24% 97%",
    popoverForeground: "30 15% 30%",

    // ===== 主色调 =====
    primary: "35 25% 65%", // #C9B896 卡其色
    primaryForeground: "30 15% 20%", // 深棕色

    // ===== 次要色 =====
    secondary: "35 20% 85%", // #E5DCC5 浅卡其
    secondaryForeground: "30 15% 30%",

    // ===== 静音色 =====
    muted: "35 20% 90%", // 更浅的卡其
    mutedForeground: "30 10% 50%",

    // ===== 强调色 =====
    accent: "35 25% 65%", // 卡其色强调
    accentForeground: "30 15% 20%",

    // ===== 危险/错误色 =====
    destructive: "0 70% 50%", // 红色
    destructiveForeground: "0 0% 98%",

    // ===== 边框和输入 =====
    border: "35 20% 80%", // #D9D2C8 卡其色边框
    input: "35 20% 85%",
    ring: "35 25% 65%",

    // ===== MDX 组件专用颜色 =====
    mdx: {
        // Alert 组件
        alertInfo: {
            bg: "210 100% 97%", // 浅蓝色背景
            border: "210 100% 85%", // 蓝色边框
            text: "210 100% 25%", // 深蓝色文字
        },
        alertWarning: {
            bg: "45 100% 97%", // 浅黄色背景
            border: "45 100% 75%", // 黄色边框
            text: "45 100% 25%", // 深黄色文字
        },
        alertError: {
            bg: "0 100% 97%", // 浅红色背景
            border: "0 100% 85%", // 红色边框
            text: "0 100% 30%", // 深红色文字
        },
        alertSuccess: {
            bg: "140 60% 97%", // 浅绿色背景
            border: "140 60% 75%", // 绿色边框
            text: "140 60% 25%", // 深绿色文字
        },

        // Callout 组件
        callout: {
            bg: "35 20% 92%", // 浅卡其背景
            border: "35 25% 65%", // 卡其色边框
            text: "30 15% 30%", // 深棕色文字
        },

        // 代码块
        code: {
            bg: "30 15% 95%", // 浅灰色背景
            text: "0 0% 20%", // 深灰色文字
            border: "30 15% 85%", // 灰色边框
        },

        // 引用块
        blockquote: {
            bg: "35 20% 95%",
            border: "35 25% 65%",
            text: "30 15% 35%",
        },
    },

    // ===== 文章内容专用颜色 =====
    article: {
        heading: "30 15% 30%", // 标题颜色
        text: "30 15% 30%", // 正文颜色
        muted: "30 10% 50%", // 次要文字
        link: "30 15% 30%", // 链接颜色
        linkHover: "35 25% 65%", // 链接悬停
        codeBg: "30 15% 95%", // 行内代码背景
        codeText: "0 0% 20%", // 行内代码文字
    },
} as const;

export const darkTheme = {
    // ===== 基础颜色 =====
    background: "30 15% 12%", // 深棕色背景
    foreground: "33 24% 90%", // 浅米色文字

    // ===== 卡片 =====
    card: "30 15% 15%",
    cardForeground: "33 24% 90%",

    // ===== 弹出层 =====
    popover: "30 15% 15%",
    popoverForeground: "33 24% 90%",

    // ===== 主色调 =====
    primary: "35 25% 55%", // 深色模式下的卡其色
    primaryForeground: "33 24% 95%",

    // ===== 次要色 =====
    secondary: "30 15% 20%",
    secondaryForeground: "33 24% 90%",

    // ===== 静音色 =====
    muted: "30 15% 18%",
    mutedForeground: "30 10% 60%",

    // ===== 强调色 =====
    accent: "35 25% 55%",
    accentForeground: "33 24% 95%",

    // ===== 危险/错误色 =====
    destructive: "0 60% 40%",
    destructiveForeground: "0 0% 98%",

    // ===== 边框和输入 =====
    border: "30 15% 25%",
    input: "30 15% 20%",
    ring: "35 25% 55%",

    // ===== MDX 组件专用颜色 =====
    mdx: {
        // Alert 组件
        alertInfo: {
            bg: "210 50% 15%", // 深蓝色背景
            border: "210 50% 35%", // 蓝色边框
            text: "210 100% 85%", // 浅蓝色文字
        },
        alertWarning: {
            bg: "45 50% 15%", // 深黄色背景
            border: "45 50% 35%", // 黄色边框
            text: "45 100% 85%", // 浅黄色文字
        },
        alertError: {
            bg: "0 50% 15%", // 深红色背景
            border: "0 50% 35%", // 红色边框
            text: "0 100% 85%", // 浅红色文字
        },
        alertSuccess: {
            bg: "140 40% 15%", // 深绿色背景
            border: "140 40% 35%", // 绿色边框
            text: "140 60% 85%", // 浅绿色文字
        },

        // Callout 组件
        callout: {
            bg: "30 15% 18%", // 深卡其背景
            border: "35 25% 55%", // 卡其色边框
            text: "33 24% 90%", // 浅米色文字
        },

        // 代码块
        code: {
            bg: "30 15% 18%", // 深灰色背景
            text: "0 0% 85%", // 浅灰色文字
            border: "30 15% 25%", // 灰色边框
        },

        // 引用块
        blockquote: {
            bg: "30 15% 18%",
            border: "35 25% 55%",
            text: "33 24% 85%",
        },
    },

    // ===== 文章内容专用颜色 =====
    article: {
        heading: "35 40% 95%", // 标题颜色（提高亮度）
        text: "32 20% 92%", // 正文颜色（提高亮度）
        muted: "30 15% 75%", // 次要文字（提高亮度）
        link: "35 60% 85%", // 链接颜色（提高亮度）
        linkHover: "35 70% 90%", // 链接悬停（提高亮度）
        codeBg: "30 15% 18%", // 行内代码背景
        codeText: "0 0% 88%", // 行内代码文字（提高亮度）
    },
} as const;

/**
 * 主题类型定义
 * 使用 ThemeColorValues 递归提取类型
 */
export type ThemeColors = ThemeColorValues<typeof lightTheme>;
export type ThemeMode = "light" | "dark";

/**
 * 获取主题配置
 */
export function getThemeConfig(mode: ThemeMode): ThemeColors {
    // 这里使用类型断言，因为我们已经在 TypeScript 中确保了 lightTheme 和 darkTheme 结构的一致性
    return (mode === "dark" ? darkTheme : lightTheme) as ThemeColors;
}

/**
 * 验证主题完整性
 * 确保 dark 和 light 主题的所有属性都存在
 *
 * 注意：Object.keys 只能获取顶层键，对于嵌套对象的深度比较需要额外的逻辑，
 * 但对于这种配置文件来说，检查顶层键的同步性通常就足够了。
 */
// export function validateTheme() {
//     const lightKeys = Object.keys(lightTheme);
//     const darkKeys = Object.keys(darkTheme);

//     const missingInDark = lightKeys.filter(key => !darkKeys.includes(key));
//     const missingInLight = darkKeys.filter(key => !lightKeys.includes(key));

//     if (missingInDark.length > 0) {
//         console.error('Dark theme missing keys:', missingInDark);
//     }

//     if (missingInLight.length > 0) {
//         console.error('Light theme missing keys:', missingInLight);
//     }

//     return missingInDark.length === 0 && missingInLight.length === 0;
// }

// // 开发环境下验证主题
// if (process.env.NODE_ENV === 'development') {
//     validateTheme();
// }
