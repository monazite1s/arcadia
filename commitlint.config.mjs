const config = {
    extends: ["@commitlint/config-conventional"],
    rules: {
        "type-enum": [
            2,
            "always",
            [
                "feat", // 新功能
                "fix", // 修复bug
                "docs", // 文档更新
                "style", // 代码格式(不影响代码运行的变动)
                "refactor", // 重构
                "perf", // 性能优化
                "test", // 测试
                "chore", // 构建过程或辅助工具的变动
                "revert", // 回滚
                "build", // 构建系统或外部依赖项的更改
                "ci", // CI配置文件和脚本的更改
            ],
        ],
        "type-case": [2, "always", "lower-case"],
        "type-empty": [2, "never"],
        "subject-empty": [2, "never"],
        "subject-case": [0], // 不限制subject的大小写
    },
};

export default config;

