"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { NavBar as TubeNav } from "@/components/ui/tubelight-navbar";
import { cn } from "@/lib/utils";
import {
  Menu,
  LayoutDashboard,
  Bot,
  FileText,
  User,
  LogOut,
} from "lucide-react";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";

interface AppNavProps {
  currentPage?: string;
  children?: React.ReactNode;
}

export default function AppNavigation({ currentPage, children }: AppNavProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { user, logout, isAuthenticated } = useAuth();
  const { connected, publicKey, wallet } = useWallet();

  // Debug wallet connection state
  console.log("Wallet connection state:", { 
    connected, 
    publicKey: publicKey?.toBase58(), 
    walletName: wallet?.adapter?.name 
  });

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const appNavItems = [
    { name: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
    { name: "AI Assistant", url: "/ai", icon: Bot },
    { name: "GST", url: "/gst", icon: FileText },
  ];

  const handleLogout = () => {
    logout();
  };

  const handleMobileNavClick = (url: string) => {
    setIsMobileMenuOpen(false);
    // Navigate to the URL
    window.location.href = url;
  };

  return (
    <div className="min-h-screen w-full relative app-ambient no-scrollbar">
      {/* Top atmospheric blue glow layer */}
      <div className="pointer-events-none absolute inset-x-0 -top-24 h-[45vh] landing-skyglow z-0" />

      {/* Desktop Header */}
      <header
        className={cn(
          "sticky top-4 z-[9999] mx-auto hidden w-full flex-row items-center justify-between self-start rounded-full bg-background/80 md:flex backdrop-blur-sm border border-border/50 shadow-lg transition-all duration-300",
          isScrolled ? "max-w-3xl px-2" : "max-w-5xl px-4",
          "py-2"
        )}
        style={{
          willChange: "transform",
          transform: "translateZ(0)",
          backfaceVisibility: "hidden",
          perspective: "1000px",
        }}
      >
        <Link
          className={cn(
            "z-50 flex items-center justify-center gap-2 transition-all duration-300",
            isScrolled ? "ml-4" : ""
          )}
          href="/dashboard"
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-cyan-500 flex items-center justify-center">
            <span className="text-white font-bold text-sm">CF</span>
          </div>
          <span className="font-bold text-xl text-foreground">CyFuture</span>
        </Link>

        <div className="absolute inset-0 hidden flex-1 flex-row items-center justify-center md:flex">
          <TubeNav
            fixed={false}
            items={appNavItems}
          />
        </div>

        <div className="flex items-center gap-4">
          {/* Wallet Connection */}
          <div className="wallet-adapter-button-wrapper">
            <WalletMultiButton className="!bg-gradient-to-r !from-blue-600 !to-blue-500 !rounded-lg !text-sm !px-4 !py-2 !h-auto !transition-all" />
          </div>

          {/* User Menu */}
          {isAuthenticated && (
            <div className="relative group">
              <button className="flex items-center space-x-2 p-2 rounded-lg bg-background/50 border border-border/50 hover:bg-background/80 transition-colors">
                <User className="w-4 h-4 text-foreground" />
                <span className="text-sm text-foreground">
                  {user?.email?.split("@")[0] || user?.name || "User"}
                </span>
              </button>

              <div className="absolute right-0 top-full mt-2 w-48 bg-background/95 backdrop-blur-md rounded-lg border border-border/50 shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                <div className="p-2">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-foreground hover:text-red-600 hover:bg-red-500/10 rounded-lg transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {!isAuthenticated && (
            <>
              <Link
                href="/login"
                className="font-medium transition-colors hover:text-foreground text-muted-foreground text-sm cursor-pointer px-3 py-2 rounded-md hover:bg-background/50"
              >
                Log In
              </Link>

              <Link
                href="/signup"
                className="rounded-md font-bold relative cursor-pointer hover:-translate-y-0.5 transition duration-200 inline-block text-center bg-gradient-to-b from-primary to-primary/80 text-primary-foreground shadow-[0px_2px_0px_0px_rgba(255,255,255,0.3)_inset] px-4 py-2 text-sm"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </header>

      {/* Mobile Header */}
      <header className="sticky top-4 z-[9999] mx-4 flex w-auto flex-row items-center justify-between rounded-full bg-background/80 backdrop-blur-sm border border-border/50 shadow-lg md:hidden px-4 py-3 overflow-x-clip">
        <Link
          className="flex items-center justify-center gap-2"
          href="/dashboard"
        >
          <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-blue-600 to-cyan-500 flex items-center justify-center">
            <span className="text-white font-bold text-xs">CF</span>
          </div>
          <span className="font-bold text-lg text-foreground">CyFuture</span>
        </Link>

        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="flex items-center justify-center w-10 h-10 rounded-full bg-background/50 border border-border/50 transition-colors hover:bg-background/80"
          aria-label="Toggle menu"
        >
          <div className="flex flex-col items-center justify-center w-5 h-5 space-y-1">
            <span
              className={cn(
                "block w-4 h-0.5 bg-foreground transition-all duration-300",
                isMobileMenuOpen ? "rotate-45 translate-y-1.5" : ""
              )}
            ></span>
            <span
              className={cn(
                "block w-4 h-0.5 bg-foreground transition-all duration-300",
                isMobileMenuOpen ? "opacity-0" : ""
              )}
            ></span>
            <span
              className={cn(
                "block w-4 h-0.5 bg-foreground transition-all duration-300",
                isMobileMenuOpen ? "-rotate-45 -translate-y-1.5" : ""
              )}
            ></span>
          </div>
        </button>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 top-20 bg-background/90 backdrop-blur-md z-[9998] flex flex-col items-center justify-start pt-16 space-y-8">
            {appNavItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.url}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center space-x-3 text-foreground hover:text-primary transition-colors text-xl font-medium"
                >
                  <Icon className="w-6 h-6" />
                  <span>{item.name}</span>
                </Link>
              );
            })}

            <div className="border-t border-border/50 pt-8 mt-8 flex flex-col space-y-4 w-full px-8">
              {/* Wallet Button */}
              <div className="wallet-adapter-button-wrapper">
                <WalletMultiButton className="!bg-gradient-to-r !from-blue-600 !to-blue-500 !rounded-lg !text-sm !px-4 !py-2 !h-auto !w-full" />
              </div>

              {isAuthenticated ? (
                <button
                  onClick={handleLogout}
                  className="flex items-center justify-center space-x-2 px-4 py-3 text-lg font-medium text-red-600 hover:bg-red-500/10 rounded-lg transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Sign Out</span>
                </button>
              ) : (
                <div className="flex flex-col space-y-3">
                  <Link
                    href="/login"
                    className="px-4 py-3 text-lg font-medium text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-background/50 cursor-pointer text-center"
                  >
                    Log In
                  </Link>
                  <Link
                    href="/signup"
                    className="px-4 py-3 text-lg font-bold text-center bg-gradient-to-b from-primary to-primary/80 text-primary-foreground rounded-lg shadow-lg hover:-translate-y-0.5 transition-all duration-200"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      {children}
    </div>
  );
}