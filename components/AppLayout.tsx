"use client";

import { ReactNode } from "react";
import AppNavigation from "@/components/AppNavigation";
import { StorageProvider } from "@/contexts/StorageContext";

interface AppLayoutProps {
  children: ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  return (
    <StorageProvider>
      <div className="min-h-screen text-foreground ambient-glow app-ambient relative z-10">
        <AppNavigation />
        {/* Content Area */}
        <main className="min-h-screen px-4 sm:px-6 lg:px-8 py-6 pt-20">
          <div className="mx-auto w-full max-w-7xl">{children}</div>
        </main>
      </div>
    </StorageProvider>
  );
}
