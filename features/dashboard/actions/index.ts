"use server"

import { db } from "@/lib/db"
import { Templates } from "@/lib/generated/prisma/client"
import { revalidatePath } from "next/cache"

// Temporarily adding "fake auth"
const DEV_USER_ID = "dev-user-id"

type DevUser = { id: string; email?: string; name?: string }

export async function currentUser(): Promise<DevUser | null> {
    return { id: DEV_USER_ID, email: "dev@example.com" }
}

export const createPlayground = async (data: {
    title: string,
    template: Templates,
    description?: string,
}) => {
    const { template, title, description } = data
    try {
        const user = await currentUser()

        // Ensure user exists in database
        await db.user.upsert({
            where: { id: user?.id ?? DEV_USER_ID },
            update: {},
            create: {
                id: user?.id ?? DEV_USER_ID,
                email: user?.email ?? "dev@example.com",
                name: user?.name ?? "Dev User",
            }
        })

        const playground = await db.playground.create({
            data: {
                title,
                description,
                template,
                userId: user?.id ?? DEV_USER_ID,
            }
        })

        revalidatePath("/dashboard")
        return playground

    } catch (error) {
        console.error("Error creating playground:", error)
        return null
    }
}

export const getAllPlaygroundForUser = async () => {
    const user = await currentUser()

    try {
        const playground = await db.playground.findMany({
            where: {
                userId: user?.id,
            },
            include: {
                user: true,
                starMarks: {
                    where: {
                        userId: user?.id,
                    },
                    select: {
                        isMarked: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        })

        return playground

    } catch (error) {
        console.error("Error fetching playgrounds:", error)
        return []
    }
}

export const deleteProjectById = async (id: string) => {
    try {
        await db.playground.delete({
            where: { id }
        })

        revalidatePath("/dashboard")

    } catch (error) {
        console.error(error)
    }
}

export const editProjectById = async (id: string, data: { title: string, description: string }) => {
    try {
        await db.playground.update({
            where: { id },
            data: data
        })
        revalidatePath("/dashboard")
    } catch (error) {
        console.error(error)
    }
}

export const duplicateProjectById = async (id: string) => {
    try {
        const originalPlayground = await db.playground.findUnique({
            where: { id },
        })
        if (!originalPlayground) {
            throw new Error("Playground not found")
        }

        await db.playground.create({
            data: {
                title: `${originalPlayground.title} (Copy)`,
                description: originalPlayground.description,
                template: originalPlayground.template,
                userId: originalPlayground.userId
            }
        })
        revalidatePath("/dashboard")
    } catch (error) {
        console.error(error)
    }
}