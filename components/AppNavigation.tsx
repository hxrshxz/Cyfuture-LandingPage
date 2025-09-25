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
  ChevronDown,
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
    { href: "/dashboard", label: "Dashboard" },
    { href: "/ai", label: "AI Assistant" },
    { href: "/gst", label: "GST" },
    { href: "/analytics", label: "Analytics" },
    { href: "/transactions", label: "Transactions" },
    { href: "/reports", label: "Reports" },
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
          ? "bg-white/80 dark:bg-gray-950/80 backdrop-blur-md border-b border-black/5 dark:border-white/5 shadow-lg"
          : "bg-transparent"
      )}
    >
      <div className="max-w-screen-xl mx-auto px-4 md:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href={isAuthenticated ? "/dashboard" : "/"} className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-cyan-500 flex items-center justify-center">
              <span className="text-white font-geist font-bold text-sm">
                CF
              </span>
            </div>
            <span className="font-geist font-bold text-xl">
              <GradientText variant="primary">CyFuture</GradientText>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {appNavItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "font-geist text-sm font-medium transition-colors duration-200",
                  "text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-300",
                  pathname === item.href && "text-blue-600 dark:text-blue-300"
                )}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Theme Toggle */}
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="p-2 rounded-lg bg-gradient-to-tr from-zinc-300/20 via-gray-400/20 to-transparent dark:from-zinc-300/5 dark:via-gray-400/5 border-[1px] border-black/5 dark:border-white/5 hover:scale-105 transition-transform"
            >
              {theme === "dark" ? (
                <Sun className="w-4 h-4 text-yellow-500" />
              ) : (
                <Moon className="w-4 h-4 text-blue-600" />
              )}
            </button>

            {/* Wallet Button */}
            <div className="wallet-adapter-button-wrapper">
              <WalletMultiButton className="!bg-gradient-to-r !from-blue-600 !to-blue-500 !rounded-lg !font-geist !text-sm !px-4 !py-2 !h-auto !transition-all" />
            </div>

            {/* Authentication */}
            {isAuthenticated ? (
              /* User Menu */
              <div className="relative group">
                <button className="flex items-center space-x-2 p-2 rounded-lg bg-gradient-to-tr from-zinc-300/20 via-gray-400/20 to-transparent dark:from-zinc-300/5 dark:via-gray-400/5 border-[1px] border-black/5 dark:border-white/5 hover:scale-105 transition-transform">
                  <User className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                  <span className="font-geist text-sm text-gray-600 dark:text-gray-300">
                    {user?.email?.split("@")[0] || user?.name || "User"}
                  </span>
                  <ChevronDown className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                </button>

                <div className="absolute right-0 top-full mt-2 w-48 bg-white/95 dark:bg-gray-950/95 backdrop-blur-md rounded-lg border-[1px] border-black/5 dark:border-white/5 shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  <div className="p-2">
                    <Link
                      href="/settings"
                      className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-300 hover:bg-blue-500/10 rounded-lg transition-colors"
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
            ) : (
              /* Login/Signup Buttons */
              <div className="flex items-center space-x-2">
                <Link
                  href="/login"
                  className="font-geist text-sm font-medium text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-300 transition-colors px-4 py-2"
                >
                  Sign In
                </Link>
                <AnimatedButton href="/signup">Get Started</AnimatedButton>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-lg bg-gradient-to-tr from-zinc-300/20 via-gray-400/20 to-transparent dark:from-zinc-300/5 dark:via-gray-400/5 border-[1px] border-black/5 dark:border-white/5"
          >
            {isMobileMenuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 space-y-4 bg-white/95 dark:bg-gray-950/95 backdrop-blur-md rounded-b-2xl border-[1px] border-black/5 dark:border-white/5 mt-2">
            {appNavItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="block font-geist text-sm font-medium text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-300 transition-colors px-4 py-2"
              >
                {item.label}
              </Link>
            ))}

            <div className="px-4 pt-4 border-t border-black/5 dark:border-white/5">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                  className="p-2 rounded-lg bg-gradient-to-tr from-zinc-300/20 via-gray-400/20 to-transparent dark:from-zinc-300/5 dark:via-gray-400/5 border-[1px] border-black/5 dark:border-white/5"
                >
                  {theme === "dark" ? (
                    <Sun className="w-4 h-4 text-yellow-500" />
                  ) : (
                    <Moon className="w-4 h-4 text-blue-600" />
                  )}
                </button>

                {isAuthenticated ? (
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-2 px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                ) : (
                  <div className="flex space-x-2 flex-1">
                    <Link
                      href="/login"
                      className="flex-1 text-center font-geist text-sm font-medium text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-300 transition-colors px-4 py-2 rounded-lg border border-black/5 dark:border-white/5"
                    >
                      Sign In
                    </Link>
                    <AnimatedButton href="/signup" className="flex-1">
                      Get Started
                    </AnimatedButton>
                  </div>
                )}
              </div>

              <div className="wallet-adapter-button-wrapper mt-4">
                <WalletMultiButton className="!bg-gradient-to-r !from-blue-600 !to-blue-500 !rounded-lg !font-geist !text-sm !px-4 !py-2 !h-auto !w-full" />
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
