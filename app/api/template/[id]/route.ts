import { scanTemplateDirectory } from "@/features/playground/libs/path-to-json"
import { db } from "@/lib/db"
import { templatePaths } from "@/lib/template"
import path from "path"
import { NextRequest } from "next/server"

// Disable caching for this API route
export const dynamic = 'force-dynamic'
export const revalidate = 0

// Helper function to ensure valid JSON
function validateJsonStructure(data: unknown): boolean {
    try {
        JSON.parse(JSON.stringify(data)); // Ensures it's serializable
        return true;
    } catch (error) {
        console.error("Invalid JSON structure:", error);
        return false;
    }
}


export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const param = await params
    const id = param.id

    if (!id) {
        return Response.json({ error: "Missing playground ID" }, { status: 400 })
    }

    try {
        const playground = await db.playground.findUnique({
            where: { id },
        });

        if (!playground) {
            return Response.json({ error: "Playground not found" }, { status: 404 })
        }

        const templateKey = playground.template as keyof typeof templatePaths
        const templatePath = templatePaths[templateKey]

        if (!templatePath) {
            return Response.json({ error: "Invalid template" }, { status: 404 })
        }

        // Process template structure in-memory (no file system writes needed)
        const inputPath = path.join(process.cwd(), templatePath)

        console.log("[Template API] Processing template:", templateKey)
        console.log("[Template API] Input Path:", inputPath)

        // Scan the template directory directly without writing to disk
        const result = await scanTemplateDirectory(inputPath)

        // Validate the JSON structure
        if (!validateJsonStructure(result.items)) {
            return Response.json({ error: "Invalid JSON structure" }, { status: 500 })
        }

        console.log("[Template API] Successfully processed template:", templateKey)

        return Response.json({ success: true, templateJson: result }, { status: 200 })
    } catch (error) {
        console.error("[Template API] Error generating template JSON:", error);
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        return Response.json({
            error: "Failed to generate template",
            details: errorMessage
        }, { status: 500 })
    }
}