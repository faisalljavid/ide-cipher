"use client"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import { Moon, Sun } from "lucide-react"

function ThemeToggle() {
    const { theme, setTheme } = useTheme()
    const [mounted, setMounted] = useState(false)

    useEffect(() => setMounted(true), [])

    if (!mounted) return null

    return (
        <div
            className="cursor-pointer p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
        >
            {
                theme === "dark" ? (
                    <Sun className="size-5 text-yellow-500 drop-shadow-md" />
                ) : (
                    <Moon className="size-5 text-slate-700 drop-shadow-sm" />
                )
            }
        </div>
    )
}

export { ThemeToggle }