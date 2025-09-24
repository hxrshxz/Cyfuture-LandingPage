"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  Home,
  Layout,
  Bot,
  Menu,
  X,
  LogIn,
  UserPlus,
} from "lucide-react";

interface NavigationProps {
  currentPage?: string;
}

export default function Navigation({ currentPage }: NavigationProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { href: "/", label: "Home", icon: Home },
    { href: "/dashboard", label: "Dashboard", icon: Layout },
    { href: "/ai", label: "AI Assistant", icon: Bot },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-black/80 backdrop-blur-md border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">CF</span>
            </div>
            <span className="text-white font-bold text-xl">CyFuture AI</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.href;
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? "text-orange-500 bg-orange-500/10"
                      : "text-gray-300 hover:text-white hover:bg-gray-800"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Link href="/login">
              <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white">
                <LogIn className="w-4 h-4 mr-2" />
                Login
              </Button>
            </Link>
            <Link href="/signup">
              <Button 
                size="sm" 
                className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700"
              >
                <UserPlus className="w-4 h-4 mr-2" />
                Sign Up
              </Button>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-300 hover:text-white"
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-800">
            <div className="space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentPage === item.href;
                
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive
                        ? "text-orange-500 bg-orange-500/10"
                        : "text-gray-300 hover:text-white hover:bg-gray-800"
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
              
              <div className="pt-4 border-t border-gray-800 space-y-2">
                <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button variant="ghost" size="sm" className="w-full justify-start text-gray-300 hover:text-white">
                    <LogIn className="w-4 h-4 mr-2" />
                    Login
                  </Button>
                </Link>
                <Link href="/signup" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button 
                    size="sm" 
                    className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700"
                  >
                    <UserPlus className="w-4 h-4 mr-2" />
                    Sign Up
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
