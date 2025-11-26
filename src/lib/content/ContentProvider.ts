import { About, Post, Tag } from "~/src/lib/types";

export interface ContentProvider {
    /**
     * Get all blog posts.
     */
    getPosts(): Promise<Post[]>;

    /**
     * Get a single post by its slug.
     */
    getPostBySlug(slug: string): Promise<Post | null>;

    /**
     * Get all tags with their counts.
     */
    getTags(): Promise<Tag[]>;

    /**
     * Get posts associated with a specific tag.
     */
    getPostsByTag(tag: string): Promise<Post[]>;

    /**
     * Get the About page content.
     */
    getAboutPage(): Promise<About | null>;
}
