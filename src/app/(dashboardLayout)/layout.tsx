
import { AppSidebar } from "@/components/app-sidebar";
import { DynamicBreadcrumb } from "@/components/common/DynamicBreadcrumb";
import { Separator } from "@/components/ui/separator"
import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
} from "@/components/ui/sidebar"
import React from "react";

export default async function DashboardLayout({ admin, user, provider }: {
    children: React.ReactNode;
    admin: React.ReactNode;
    user: React.ReactNode;
    provider: React.ReactNode;
}) {
    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
                <header className="bg-background sticky top-0 flex h-16 shrink-0 items-center gap-2 border-b px-4">
                    <SidebarTrigger className="-ml-1" />
                    <Separator orientation="vertical" className="mr-2 h-4" />
                    <DynamicBreadcrumb />
                </header>
                <div className="flex flex-1 flex-col gap-4 p-4">
                    {/* {children} */}
                    {admin}
                    {user}
                    {provider}
                </div>
            </SidebarInset>
        </SidebarProvider>
    )
}
