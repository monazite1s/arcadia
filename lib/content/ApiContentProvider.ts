import { Post, Tag } from "@/lib/types";

import { ContentProvider } from "./ContentProvider";

export class ApiContentProvider implements ContentProvider {
    async getPosts(): Promise<Post[]> {
        // TODO: Implement API call
        return [];
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async getPostBySlug(slug: string): Promise<Post | null> {
        // TODO: Implement API call
        return null;
    }

    async getTags(): Promise<Tag[]> {
        // TODO: Implement API call
        return [];
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async getPostsByTag(tag: string): Promise<Post[]> {
        // TODO: Implement API call
        return [];
    }
}
