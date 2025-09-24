import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import ErrorBoundary from "@/components/ErrorBoundary"
import SolanaWalletProvider from "@/components/WalletProvider"
import "./globals.css"

export const metadata: Metadata = {
  title: "CyFuture AI - Your AI Financial Assistant",
  description: "Advanced AI-powered financial assistant for document analysis, calculations, and insights",
  generator: "CyFuture AI",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <style>{`
html {
  font-family: ${GeistSans.style.fontFamily};
  --font-sans: ${GeistSans.variable};
  --font-mono: ${GeistMono.variable};
}
        `}</style>
      </head>
      <body className="dark">
        <ErrorBoundary>
          <SolanaWalletProvider>
            {children}
          </SolanaWalletProvider>
        </ErrorBoundary>
      </body>
    </html>
  )
}
