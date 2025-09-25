import type React from "react";
import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import ErrorBoundary from "@/components/ErrorBoundary";
import SolanaWalletProvider from "@/components/WalletProvider";
import { AuthProvider } from "@/contexts/AuthContext";
import "./globals.css";
import ClientRouteClass from "./route-class-client";
import ServiceWorkerGuard from "@/components/ServiceWorkerGuard";

export const metadata: Metadata = {
  title: "CyFuture AI - AI Accountant for GST Reconciliation",
  description:
    "AI-powered invoice processing and GST reconciliation platform with blockchain security and IPFS storage",
  generator: "CyFuture AI Accountant",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <style>{`
html {
  font-family: ${GeistSans.style.fontFamily};
  --font-sans: ${GeistSans.variable};
  --font-mono: ${GeistMono.variable};
}
        `}</style>
      </head>
      <body>
        <ClientRouteClass>
          <ServiceWorkerGuard />
          <ErrorBoundary>
            <AuthProvider>
              <SolanaWalletProvider>{children}</SolanaWalletProvider>
            </AuthProvider>
          </ErrorBoundary>
        </ClientRouteClass>
      </body>
    </html>
  );
}
