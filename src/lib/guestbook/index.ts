import { GuestbookProvider } from "./GuestbookProvider";
import { PrismaGuestbookProvider } from "./PrismaGuestbookProvider";

/**
 * Guestbook Provider 工厂函数
 */
export function getGuestbookProvider(): GuestbookProvider {
    return new PrismaGuestbookProvider();
}
export type { GuestbookProvider };
