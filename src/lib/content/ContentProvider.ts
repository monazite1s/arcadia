import { About, DocCategory, DocPage, Post, Tag } from "~/src/lib/types";

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

    /**
     * Get the documentation tree structure.
     */
    getDocTree(): Promise<DocCategory[]>;

    /**
     * Get a single documentation page by its slug.
     * Note: slug is the full path or unique identifier.
     */
    getDocPageBySlug(slug: string): Promise<DocPage | null>;
}
