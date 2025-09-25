"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { AnimatedButton } from "@/components/ui/animated-button";
import { GradientText } from "@/components/ui/gradient-text";
import { cn } from "@/lib/utils";
import { Menu, X, Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";

interface NavigationProps {
  currentPage?: string;
}

export function NavigationClean({ currentPage }: NavigationProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { user, isAuthenticated } = useAuth();
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { href: "#features", label: "Features" },
    { href: "#pricing", label: "Pricing" },
    { href: "#about", label: "About" },
    { href: "#contact", label: "Contact" },
  ];

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
          <Link href="/" className="flex items-center space-x-3">
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
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "font-geist text-sm font-medium transition-colors duration-200",
                  "text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-300",
                  currentPage === item.href &&
                    "text-blue-600 dark:text-blue-300"
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

            {isAuthenticated ? (
              <AnimatedButton href="/dashboard">Dashboard</AnimatedButton>
            ) : (
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
            {navItems.map((item) => (
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
                  <AnimatedButton href="/dashboard" className="flex-1">
                    Dashboard
                  </AnimatedButton>
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
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

export default NavigationClean;
