"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter, usePathname } from "next/navigation";
import {
  Home,
  BarChart3,
  Bot,
  TrendingUp,
  Wallet,
  Settings,
  FileText,
  PieChart,
  CreditCard,
  Target,
  Bell,
  Search,
  Menu,
  X,
  LogOut,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";

interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
  description: string;
  badge?: string;
}

const navigationItems: NavItem[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: Home,
    href: "/dashboard",
    description: "Invoice processing overview",
  },
  {
    id: "ai-assistant",
    label: "AI Assistant",
    icon: Bot,
    href: "/ai",
    description: "Smart invoice processing",
    badge: "AI",
  },
  {
    id: "processing",
    label: "Processing Queue",
    icon: BarChart3,
    href: "/processing",
    description: "Invoice processing status",
  },
  {
    id: "gst-reconciliation",
    label: "GST Reconciliation",
    icon: PieChart,
    href: "/gst",
    description: "GST compliance and matching",
  },
  {
    id: "blockchain-records",
    label: "Blockchain Records",
    icon: CreditCard,
    href: "/records",
    description: "Secured invoice records",
  },
  {
    id: "reports",
    label: "Reports",
    icon: Target,
    href: "/reports",
    description: "GST and compliance reports",
  },
  {
    id: "ai-command",
    label: "AI Command Center",
    icon: FileText,
    href: "/ai-command",
    description: "Chat with your invoice data",
  },
];

export default function AppNavigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const handleNavigation = (href: string) => {
    router.push(href);
    setIsMobileMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const filteredItems = navigationItems.filter(
    (item) =>
      item.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className="hidden lg:flex lg:w-80 lg:flex-col lg:fixed lg:inset-y-0 border-r gradient-border backdrop-blur-md"
        style={{
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.04), rgba(255,255,255,0.02))",
          borderColor: "rgba(255,255,255,0.08)",
        }}
      >
        <div className="flex flex-col flex-1 min-h-0">
          {/* Header */}
          <div
            className="flex items-center justify-between h-16 px-6 border-b"
            style={{ borderColor: "rgba(255,255,255,0.08)" }}
          >
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center btn-metallic shine">
                <svg
                  className="w-4 h-4 text-black"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                </svg>
              </div>
              <h1 className="text-lg font-semibold text-foreground">
                CyFuture AI
              </h1>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="text-muted-foreground hover:text-foreground"
            >
              <Bell className="w-4 h-4" />
            </Button>
          </div>

          {/* Search */}
          <div className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search sections..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg text-foreground placeholder-muted-foreground outline-none focus:ring-2"
                style={{
                  background:
                    "linear-gradient(180deg, rgba(255,255,255,0.03), rgba(255,255,255,0.01))",
                  border: "1px solid rgba(255,255,255,0.12)",
                  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.04)",
                }}
              />
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="flex-1 px-4 pb-4 space-y-2">
            {filteredItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <button
                  key={item.id}
                  onClick={() => handleNavigation(item.href)}
                  className={`nav-item w-full flex items-center justify-between px-4 py-3 text-left rounded-lg transition-all duration-200 group ${
                    isActive
                      ? "bg-white/5 text-foreground border border-white/15"
                      : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Icon
                      className={`w-5 h-5 ${
                        isActive
                          ? "text-foreground"
                          : "text-muted-foreground group-hover:text-foreground"
                      }`}
                    />
                    <div>
                      <div className="font-medium">{item.label}</div>
                      <div className="text-xs text-muted-foreground group-hover:text-foreground/80">
                        {item.description}
                      </div>
                    </div>
                  </div>
                  {item.badge && (
                    <Badge variant="secondary" className="bg-white/10 text-foreground border-white/15">
                      {item.badge}
                    </Badge>
                  )}
                </button>
              );
            })}
          </nav>

          {/* User Profile */}
          <div className="p-4 border-t" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full flex items-center justify-center btn-metallic">
                  <User className="w-4 h-4 text-black" />
                </div>
                <div>
                  <div className="text-sm font-medium text-foreground">
                    {user?.name}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {user?.email}
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleNavigation("/settings")}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <Settings className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Navigation */}
      <div className="lg:hidden">
        {/* Mobile Header */}
        <header
          className="backdrop-blur-md border-b px-4 py-3 gradient-border"
          style={{
            background:
              "linear-gradient(180deg, rgba(255,255,255,0.04), rgba(255,255,255,0.02))",
            borderColor: "rgba(255,255,255,0.08)",
          }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center btn-metallic">
                <svg className="w-4 h-4 text-black" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                </svg>
              </div>
              <h1 className="text-lg font-semibold text-foreground">
                CyFuture AI
              </h1>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                className="text-muted-foreground hover:text-foreground"
              >
                <Bell className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-muted-foreground hover:text-foreground"
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>
            </div>
          </div>
        </header>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden backdrop-blur-md border-b gradient-border"
              style={{
                background:
                  "linear-gradient(180deg, rgba(255,255,255,0.04), rgba(255,255,255,0.02))",
                borderColor: "rgba(255,255,255,0.08)",
              }}
            >
              <div className="px-4 py-4 space-y-2 max-h-[70vh] overflow-y-auto">
                {filteredItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;

                  return (
                    <button
                      key={item.id}
                      onClick={() => handleNavigation(item.href)}
                      className={`nav-item w-full flex items-center justify-between px-4 py-3 text-left rounded-lg transition-all duration-200 ${
                        isActive
                          ? "bg-white/5 text-foreground border border-white/15"
                          : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <Icon className={`w-5 h-5 ${isActive ? "text-foreground" : "text-muted-foreground"}`} />
                        <div>
                          <div className="font-medium">{item.label}</div>
                          <div className="text-xs text-muted-foreground">{item.description}</div>
                        </div>
                      </div>
                      {item.badge && (
                        <Badge variant="secondary" className="bg-white/10 text-foreground border-white/15">
                          {item.badge}
                        </Badge>
                      )}
                    </button>
                  );
                })}

                {/* Mobile User Section */}
                <div className="pt-4 mt-4 border-t" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
                  <div className="flex items-center justify-between px-4 py-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center btn-metallic">
                        <User className="w-4 h-4 text-black" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-foreground">{user?.name}</div>
                        <div className="text-xs text-muted-foreground">{user?.email}</div>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" onClick={handleLogout} className="text-muted-foreground hover:text-foreground">
                      <LogOut className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
