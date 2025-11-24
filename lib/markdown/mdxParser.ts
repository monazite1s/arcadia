import { compileMDX } from "next-mdx-remote/rsc";

import rehypePrettyCode from "rehype-pretty-code";
import remarkGfm from "remark-gfm";

import { Post } from "@/lib/types";

// Custom components for MDX
const components = {
    // Add custom components here (e.g., Callout, Tweet)
};

export async function parseMDX(source: string) {
    const { content, frontmatter } = await compileMDX<Omit<Post, "content" | "slug">>({
        source,
        options: {
            parseFrontmatter: true,
            mdxOptions: {
                remarkPlugins: [remarkGfm],
                rehypePlugins: [
                    [
                        rehypePrettyCode,
                        {
                            theme: "github-dark",
                            keepBackground: false,
                        },
                    ],
                ],
            },
        },
        components,
    });

    return { content, frontmatter };
}
