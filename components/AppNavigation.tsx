"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { AnimatedButton } from "@/components/ui/animated-button";
import { GradientText } from "@/components/ui/gradient-text";
import { cn } from "@/lib/utils";
import {
  Menu,
  X,
  Sun,
  Moon,
  LayoutDashboard,
  Bot,
  CreditCard,
  BarChart3,
  Settings,
  User,
  LogOut,
  PieChart,
  Target,
  FileText,
} from "lucide-react";
import { useTheme } from "next-themes";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";

interface AppNavProps {
  currentPage?: string;
}

export default function AppNavigation({ currentPage }: AppNavProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { user, logout, isAuthenticated } = useAuth();
  const { theme, setTheme } = useTheme();
  const { connected, publicKey } = useWallet();
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const appNavItems = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/ai", label: "AI Assistant", icon: Bot },
    { href: "/transactions", label: "Transactions", icon: CreditCard },
    { href: "/analytics", label: "Analytics", icon: BarChart3 },
    { href: "/gst", label: "GST", icon: PieChart },
    { href: "/reports", label: "Reports", icon: Target },
    { href: "/portfolio", label: "Portfolio", icon: FileText },
    { href: "/settings", label: "Settings", icon: Settings },
  ];

  const handleLogout = () => {
    logout();
    // Redirect will be handled by AuthContext
  };

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled
          ? "bg-white/95 dark:bg-gray-950/95 backdrop-blur-md border-b border-blue-500/20 shadow-lg shadow-blue-500/5"
          : "bg-white/80 dark:bg-gray-950/80 backdrop-blur-md border-b border-blue-500/10"
      )}
    >
      <div className="max-w-screen-xl mx-auto px-4 md:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/dashboard" className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-blue-400 flex items-center justify-center shadow-lg shadow-blue-500/25">
              <span className="text-white font-geist font-bold text-sm">
                CF
              </span>
            </div>
            <span className="font-geist font-bold text-xl">
              <GradientText variant="primary">CyFuture</GradientText>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {appNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center space-x-2 font-geist text-sm font-medium transition-all duration-200 px-3 py-2 rounded-lg",
                    "text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400",
                    "hover:bg-blue-500/10",
                    isActive &&
                      "text-blue-600 dark:text-blue-400 bg-blue-500/10 shadow-sm shadow-blue-500/20"
                  )}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Theme Toggle */}
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="p-2 rounded-lg bg-gradient-to-tr from-blue-500/20 via-blue-400/20 to-transparent dark:from-blue-500/10 dark:via-blue-400/10 border border-blue-500/20 hover:scale-105 transition-transform shadow-sm shadow-blue-500/10"
            >
              {theme === "dark" ? (
                <Sun className="w-4 h-4 text-yellow-500" />
              ) : (
                <Moon className="w-4 h-4 text-blue-600" />
              )}
            </button>

            {/* Wallet Button */}
            <div className="wallet-adapter-button-wrapper">
              <WalletMultiButton className="!bg-gradient-to-r !from-blue-600 !to-blue-500 !rounded-full !font-geist !text-sm !px-4 !py-2 !h-auto !shadow-lg !shadow-blue-500/25 hover:!shadow-blue-500/40 !transition-all" />
            </div>

            {/* User Menu */}
            {isAuthenticated && (
              <div className="relative group">
                <button className="flex items-center space-x-2 p-2 rounded-lg bg-gradient-to-tr from-blue-500/20 via-blue-400/20 to-transparent border border-blue-500/20 hover:scale-105 transition-transform shadow-sm shadow-blue-500/10">
                  <User className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <span className="font-geist text-sm text-gray-600 dark:text-gray-300">
                    {user?.email?.split("@")[0] || user?.name || "User"}
                  </span>
                </button>

                <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-gray-950 rounded-lg border border-blue-500/20 shadow-lg shadow-blue-500/10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  <div className="p-2">
                    <Link
                      href="/settings"
                      className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors"
                    >
                      <Settings className="w-4 h-4" />
                      <span>Settings</span>
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-gray-600 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-lg bg-gradient-to-tr from-blue-500/20 via-blue-400/20 to-transparent border border-blue-500/20 shadow-sm shadow-blue-500/10"
          >
            {isMobileMenuOpen ? (
              <X className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            ) : (
              <Menu className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 space-y-2 bg-white/95 dark:bg-gray-950/95 backdrop-blur-md rounded-b-2xl border border-blue-500/20 mt-2 shadow-lg shadow-blue-500/5">
            {appNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={cn(
                    "flex items-center space-x-3 font-geist text-sm font-medium transition-colors px-4 py-3 hover:bg-blue-500/10 rounded-lg mx-2",
                    "text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400",
                    isActive &&
                      "text-blue-600 dark:text-blue-400 bg-blue-500/10"
                  )}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}

            <div className="px-4 pt-4 border-t border-blue-500/20">
              <div className="flex items-center justify-between mb-4">
                <button
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                  className="p-2 rounded-lg bg-gradient-to-tr from-blue-500/20 via-blue-400/20 to-transparent border border-blue-500/20 shadow-sm shadow-blue-500/10"
                >
                  {theme === "dark" ? (
                    <Sun className="w-4 h-4 text-yellow-500" />
                  ) : (
                    <Moon className="w-4 h-4 text-blue-600" />
                  )}
                </button>

                {isAuthenticated && (
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-2 px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                )}
              </div>

              <div className="wallet-adapter-button-wrapper">
                <WalletMultiButton className="!bg-gradient-to-r !from-blue-600 !to-blue-500 !rounded-full !font-geist !text-sm !px-4 !py-2 !h-auto !w-full !shadow-lg !shadow-blue-500/25" />
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
