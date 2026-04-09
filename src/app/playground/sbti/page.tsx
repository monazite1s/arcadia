import type { Metadata } from "next";

import SBTIPageClient from "./SBTIPageClient";

export const metadata: Metadata = {
    title: "SBTI 人格图鉴 | Arcadia",
    description: "SBTI 人格测试图鉴 — 全 27 种人格类型完整展示",
};

export default function SBTIPage() {
    return <SBTIPageClient />;
}
