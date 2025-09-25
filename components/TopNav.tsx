"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  Menu,
  X,
  Bell,
  Search,
  User,
  LogOut,
  Settings,
  Bot,
  Home,
  PieChart,
  CreditCard,
  Target,
  BarChart3,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export default function TopNav() {

  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);

  const items = [
    { href: "/dashboard", label: "Dashboard", icon: Home },
    { href: "/ai", label: "AI Assistant", icon: Bot },
    { href: "/gst", label: "GST", icon: PieChart },
    { href: "/reports", label: "Reports", icon: Target },
    { href: "/transactions", label: "Transactions", icon: BarChart3 },
  ];
  return (
    <div className="sticky top-0 z-40 backdrop-blur glow-blue">
      <div className="mx-auto max-w-7xl px-4 py-3 flex items-center justify-between text-foreground">
        <Link
          href="/dashboard"
          className="text-lg font-semibold text-foreground"
        >
          CyFuture AI
        </Link>
        {/* Desktop menu */}
        <nav className="hidden md:flex items-center gap-1">
          {items.map((it) => (
            <Link
              key={it.href}
              href={it.href}
              className={`h-9 px-4 rounded-xl transition-colors flex items-center gap-2 ${
                pathname === it.href
                  ? "bg-foreground text-background"
                  : "bg-foreground/10 text-foreground hover:bg-foreground/20"
              }`}
            >
              <it.icon className="w-4 h-4" />
              {it.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <button className="hidden md:inline-flex h-9 px-3 rounded-xl bg-foreground/10 hover:bg-foreground/20">
            <Search className="w-4 h-4" />
          </button>
          <button className="hidden md:inline-flex h-9 px-3 rounded-xl bg-foreground/10 hover:bg-foreground/20">
            <Bell className="w-4 h-4" />
          </button>
          <button
            className="md:hidden h-9 w-9 inline-flex items-center justify-center rounded-xl bg-foreground/10"
            onClick={() => setOpen((v) => !v)}
            aria-label="Menu"
          >
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>
      {/* Mobile drawer */}
      {open && (
        <div className="md:hidden border-t border-border/60 px-3 pb-3">
          <div className="py-2 flex flex-col gap-2">
            {items.map((it) => (
              <Link
                key={it.href}
                href={it.href}
                className={`h-10 px-3 rounded-xl transition-colors flex items-center gap-2 ${
                  pathname === it.href
                    ? "bg-foreground text-background"
                    : "bg-foreground/10 text-foreground hover:bg-foreground/20"
                }`}
                onClick={() => setOpen(false)}
              >
                <it.icon className="w-4 h-4" />
                {it.label}
              </Link>
            ))}
          </div>
          <div className="mt-2 grid grid-cols-2 gap-2">
            <Link
              href="/settings"
              onClick={() => setOpen(false)}
              className="h-10 px-3 rounded-xl bg-foreground/10 text-foreground hover:bg-foreground/20 flex items-center gap-2"
            >
              <Settings className="w-4 h-4" /> Settings
            </Link>
            <button
              onClick={() => {
                logout();
              }}
              className="h-10 px-3 rounded-xl bg-foreground/10 text-foreground hover:bg-foreground/20 flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" /> Logout
            </button>
          </div>
          {user?.email && (
            <div className="mt-3 text-xs text-muted-foreground">
              Signed in as <span className="text-foreground">{user.email}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
