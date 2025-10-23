"use server"

import { db } from "@/lib/db"
import { Templates } from "@/lib/generated/prisma/client"
import { revalidatePath } from "next/cache"
import { currentUser } from "@/features/auth/actions"

// Using real auth via NextAuth (see features/auth/actions)

export const createPlayground = async (data: {
    title: string,
    template: Templates,
    description?: string,
}) => {
    const { template, title, description } = data
    try {
        const user = await currentUser()
        if (!user?.id) {
            throw new Error("Unauthorized")
        }

        // Normalize template value defensively
        const normalizedTemplate: Templates =
            (typeof template === 'string'
                ? (template.toUpperCase() as Templates)
                : template)
            || 'REACT'

        const playground = await db.playground.create({
            data: {
                title,
                description,
                template: normalizedTemplate,
                userId: user.id,
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
    if (!user?.id) {
        return []
    }

    try {
        // Disable Prisma query caching by using a unique timestamp
        const playground = await db.playground.findMany({
            where: {
                userId: user.id,
            },
            include: {
                user: true,
                starMarks: {
                    where: {
                        userId: user.id,
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