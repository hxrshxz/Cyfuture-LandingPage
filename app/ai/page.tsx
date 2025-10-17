"use client";

import { ProtectedRoute } from "@/contexts/AuthContext";
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar";
import AIAccountant from "@/components/AIAccountant";

function AIContent() {
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min">
            <AIAccountant embedded={true} />
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

export default function AIPage() {
  return (
    <ProtectedRoute>
      <AIContent />
    </ProtectedRoute>
  );
}
