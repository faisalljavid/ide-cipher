import { SidebarProvider } from "@/components/ui/sidebar";
import { getAllPlaygroundForUser } from "@/features/dashboard/actions";
import { DashboardSidebar } from "@/features/dashboard/actions/dashboard-sidebar";

export default async function DashboardLayout(
    { children }: { children: React.ReactNode }) {

    const playgroundData = await getAllPlaygroundForUser();

    const technologyIconMap: Record<string, string> = {
        REACT: "Zap",
        EXPRESS: "Database",
    }

    const formattedPlaygroundData = playgroundData?.map((playground) => ({
        id: playground.id,
        name: playground.title,
        starred: playground.starMarks?.[0]?.isMarked || false,
        icon: technologyIconMap[playground.template] || "Code2",
    })) || []

    return (
        <SidebarProvider>
            <div className="flex min-h-screen w-full overflow-x-hidden">
                <DashboardSidebar initialPlaygroundData={formattedPlaygroundData} />
                <main className="flex-1">
                    {children}
                </main>
            </div>
        </SidebarProvider>
    )
}