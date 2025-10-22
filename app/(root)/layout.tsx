import { Header } from "@/features/home/components/header"
import React from "react"

export default function HomeLayout({
    children
}: {
    children: React.ReactNode
}) {
    return (
        <>
            <Header />
            <main className="z-20 relative w-full pt-0 md:pt-0">
                {children}
            </main>
        </>
    )
}