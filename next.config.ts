import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    /* config options here */
    reactCompiler: true,
    trailingSlash: true,
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "typora-image-mrz.oss-cn-beijing.aliyuncs.com",
            },
            {
                protocol: "https",
                hostname: "cdn.sanity.io",
            },
            {
                protocol: "https",
                hostname: "*.githubusercontent.com",
                port: "",
                pathname: "/u/**",
            },
        ],
    },
};

export default nextConfig;
