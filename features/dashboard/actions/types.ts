export interface User {
    id: string
    name: string | null
    email: string
    image: string | null
}

export interface Project {
    id: string
    title: string
    description: string | null
    template: string
    createdAt: Date
    updatedAt: Date
    userId: string
    user: User
    starMarks: { isMarked: boolean }[]
}
