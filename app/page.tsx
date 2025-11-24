import Link from "next/link";

export default function Home() {
    return (
        <div className="bg-background text-foreground flex min-h-screen flex-col items-center justify-center">
            <main className="flex flex-col items-center gap-8 text-center">
                <div className="space-y-4">
                    <h1 className="from-primary animate-pulse bg-gradient-to-r via-amber-300 to-yellow-600 bg-clip-text text-6xl font-bold tracking-tighter text-transparent sm:text-7xl">
                        ARCADIA
                    </h1>
                    <p className="text-muted-foreground max-w-[600px] md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                        Next.js Full-Stack Engineering Starter
                    </p>
                </div>

                <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
                    <Link
                        href="/blog"
                        className="group border-border bg-card hover:border-primary relative flex h-24 w-32 flex-col items-center justify-center rounded-xl border p-4 transition-all hover:shadow-[0_0_30px_-10px_var(--color-primary)]"
                    >
                        <span className="group-hover:text-primary text-lg font-bold transition-colors">
                            秘笈
                        </span>
                        <span className="text-muted-foreground mt-1 text-xs">Blog</span>
                    </Link>

                    <Link
                        href="/archives"
                        className="group border-border bg-card hover:border-primary relative flex h-24 w-32 flex-col items-center justify-center rounded-xl border p-4 transition-all hover:shadow-[0_0_30px_-10px_var(--color-primary)]"
                    >
                        <span className="group-hover:text-primary text-lg font-bold transition-colors">
                            书橱
                        </span>
                        <span className="text-muted-foreground mt-1 text-xs">Archives</span>
                    </Link>

                    <Link
                        href="/calendar"
                        className="group border-border bg-card hover:border-primary relative flex h-24 w-32 flex-col items-center justify-center rounded-xl border p-4 transition-all hover:shadow-[0_0_30px_-10px_var(--color-primary)]"
                    >
                        <span className="group-hover:text-primary text-lg font-bold transition-colors">
                            日历
                        </span>
                        <span className="text-muted-foreground mt-1 text-xs">Calendar</span>
                    </Link>
                </div>

                <div className="text-muted-foreground mt-12 flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-2">
                        <div className="h-2 w-2 animate-pulse rounded-full bg-green-500" />
                        <span>System Online</span>
                    </div>
                    <span>•</span>
                    <span>v0.1.0</span>
                </div>
            </main>
        </div>
    );
}
