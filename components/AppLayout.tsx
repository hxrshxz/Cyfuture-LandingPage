"use client"

import { ReactNode } from "react"
import AppNavigation from "@/components/AppNavigation"

interface AppLayoutProps {
  children: ReactNode
}

export default function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-black text-white">
      <AppNavigation />
      
      {/* Main Content */}
      <div className="lg:pl-80">
        {/* Mobile spacing */}
        <div className="lg:hidden h-16"></div>
        
        {/* Content Area */}
        <main className="min-h-screen">
          {children}
        </main>
      </div>
    </div>
  )
}
