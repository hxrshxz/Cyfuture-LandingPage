import type React from "react";
import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { appFontsClass } from "@/lib/fonts";
import ErrorBoundary from "@/components/ErrorBoundary";
import SolanaWalletProvider from "@/components/WalletProvider";
import { AuthProvider } from "@/contexts/AuthContext";
import { StorageProvider } from "@/contexts/StorageContext";
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
    <html
      lang="en"
      className={`dark ${appFontsClass} ${GeistSans.variable} ${GeistMono.variable}`}
    >
      <head>
        {/* External variable fonts for app pages (landing keeps Geist) */}
        <link rel="preconnect" href="https://cdn.jsdelivr.net" />
        <link
          href="https://cdn.jsdelivr.net/npm/@fontsource-variable/satoshi@5.1.0/index.css"
          rel="stylesheet"
        />
        <link
          href="https://cdn.jsdelivr.net/npm/@fontsource-variable/general-sans@5.1.0/index.css"
          rel="stylesheet"
        />
        <link
          href="https://cdn.jsdelivr.net/npm/@fontsource-variable/supreme@5.1.0/index.css"
          rel="stylesheet"
        />
      </head>
      <body className=" w-full max-w-full overflow-x-hidden">
        <ClientRouteClass>
          <ServiceWorkerGuard />
          <ErrorBoundary>
            <StorageProvider>
              <AuthProvider>
                <SolanaWalletProvider>{children}</SolanaWalletProvider>
              </AuthProvider>
            </StorageProvider>
          </ErrorBoundary>
        </ClientRouteClass>
      </body>
    </html>
  );
}
