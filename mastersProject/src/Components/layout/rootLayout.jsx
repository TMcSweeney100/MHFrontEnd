import { Outlet } from "react-router-dom"
import { SidebarProvider, SidebarInset,SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"



export default function RootLayout() {
  return (
   <SidebarProvider>
  <div className="flex min-h-screen w-full">
    <AppSidebar />
    <SidebarInset className="flex flex-col flex-1 w-full">
      <SidebarTrigger />
      <Outlet />
    </SidebarInset>
  </div>
</SidebarProvider>

  )
}