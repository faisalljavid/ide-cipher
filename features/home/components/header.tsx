import Link from "next/link";
import { ThemeToggle } from "@/components/ui/theme-toggle"
import UserButton from "@/features/auth/components/user-button"

export function Header() {
    return (
        <header className="sticky top-0 left-0 right-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-16 items-center justify-between px-6 max-w-7xl mx-auto">
                {/* Logo */}
                <Link
                    href="/"
                    className="flex items-center gap-2 hover:opacity-80 transition-opacity"
                >
                    <div className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-pink-500">
                        Cipher IDE
                    </div>
                </Link>

                {/* Navigation */}
                <nav className="hidden md:flex items-center gap-8">
                    <Link
                        href="#features"
                        className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                    >
                        Features
                    </Link>
                    <Link
                        href="/dashboard"
                        className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                    >
                        Dashboard
                    </Link>

                </nav>

                {/* Right side - User controls */}
                <div className="flex items-center gap-3">
                    <ThemeToggle />
                    <UserButton />
                </div>
            </div>
        </header>
    )
}