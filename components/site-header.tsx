"use client"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { usePathname } from "next/navigation"

export function SiteHeader() {
  const pathname = usePathname()
  
  // Function to get page title based on current path
  const getPageTitle = () => {
    switch (pathname) {
      case "/dashboard":
        return "Dashboard"
      case "/ai":
        return "AI Accountant"
      case "/wallet":
        return "Wallet"
      case "/transactions":
        return "Transactions"
      case "/ocr":
        return "OCR Processing"
      case "/analytics":
        return "Analytics"
      case "/reports":
        return "Reports"
      case "/settings":
        return "Settings"
      case "/gst":
        return "GST Assistant"
      case "/invoices":
        return "Invoices"
      case "/portfolio":
        return "Portfolio"
      case "/goals":
        return "Goals"
      default:
        // Fallback for dynamic routes or unknown paths
        const segments = pathname.split('/').filter(Boolean)
        if (segments.length > 0) {
          return segments[0].charAt(0).toUpperCase() + segments[0].slice(1)
        }
        return "Dashboard"
    }
  }

  return (
    <header className="flex h-[--header-height] shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-[--header-height] bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1 h-9 w-9 bg-white/90 hover:bg-white text-black border-2 border-gray-300 shadow-lg backdrop-blur-sm transition-all duration-200 hover:shadow-xl" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <h1 className="text-base font-medium">{getPageTitle()}</h1>
      </div>
    </header>
  )
}