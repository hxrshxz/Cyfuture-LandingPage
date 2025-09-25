"use client";

import { ProtectedRoute } from "@/contexts/AuthContext";
import AppLayout from "@/components/AppLayout";
import AppSection from "@/components/AppSection";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Settings,
  User,
  Bell,
  Shield,
  Palette,
  Database,
  CreditCard,
  Smartphone,
  Eye,
  EyeOff,
  Save,
  Trash2,
  Link,
  Globe,
} from "lucide-react";
import { useState } from "react";

export default function SettingsPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    sms: false,
    weeklyReport: true,
    goalReminders: true,
    priceAlerts: false,
  });

  const settingsCategories = [
    {
      id: "profile",
      title: "Profile Settings",
      icon: User,
      description: "Manage your personal information and preferences",
    },
    {
      id: "security",
      title: "Security & Privacy",
      icon: Shield,
      description: "Password, 2FA, and privacy settings",
    },
    {
      id: "notifications",
      title: "Notifications",
      icon: Bell,
      description: "Email, push, and alert preferences",
    },
    {
      id: "appearance",
      title: "Appearance",
      icon: Palette,
      description: "Theme, layout, and display options",
    },
    {
      id: "data",
      title: "Data & Storage",
      icon: Database,
      description: "Backup, export, and data management",
    },
    {
      id: "billing",
      title: "Billing & Subscription",
      icon: CreditCard,
      description: "Payment methods and subscription details",
    },
  ];

  return (
    <ProtectedRoute>
      <AppLayout>
        <AppSection
          title="Settings"
          subtitle="Manage your account and application preferences"
        >
          {/* Settings Categories */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {settingsCategories.map((category) => (
              <Card
                key={category.id}
                className="bg-black/40 border-gray-800/60 hover:border-gray-700 transition-colors cursor-pointer group"
              >
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-gray-600 to-gray-400 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                      <category.icon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-white text-lg">
                        {category.title}
                      </CardTitle>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-400 text-sm">
                    {category.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Profile Settings */}
          <Card className="bg-black/40 border-gray-800/60 mt-6">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <User className="w-5 h-5" />
                Profile Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="text-gray-300">
                    First Name
                  </Label>
                  <Input
                    id="firstName"
                    defaultValue="John"
                    className="bg-black/40 border-gray-700 text-white placeholder-gray-400"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName" className="text-gray-300">
                    Last Name
                  </Label>
                  <Input
                    id="lastName"
                    defaultValue="Doe"
                    className="bg-black/40 border-gray-700 text-white placeholder-gray-400"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-300">
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    defaultValue="john.doe@example.com"
                    className="bg-black/40 border-gray-700 text-white placeholder-gray-400"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-gray-300">
                    Phone Number
                  </Label>
                  <Input
                    id="phone"
                    defaultValue="+91 98765 43210"
                    className="bg-black/40 border-gray-700 text-white placeholder-gray-400"
                  />
                </div>
              </div>
              <div className="flex gap-3">
                <Button className="btn-metallic">
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </Button>
                <Button variant="outline" className="btn-outline-metallic">
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Security Settings */}
          <Card className="bg-black/40 border-gray-800/60 mt-6">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Security Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword" className="text-gray-300">
                    Current Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="currentPassword"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter current password"
                      className="bg-black/40 border-gray-700 text-white placeholder-gray-400 pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="newPassword" className="text-gray-300">
                    New Password
                  </Label>
                  <Input
                    id="newPassword"
                    type="password"
                    placeholder="Enter new password"
                    className="bg-black/40 border-gray-700 text-white placeholder-gray-400"
                  />
                </div>
              </div>

              <div className="p-4 bg-black/40 rounded-lg border border-gray-800/60">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-white">
                      Two-Factor Authentication
                    </h4>
                    <p className="text-gray-400 text-sm">
                      Add an extra layer of security to your account
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant="secondary"
                      className="bg-green-500/20 text-green-300"
                    >
                      Enabled
                    </Badge>
                    <Button
                      size="sm"
                      variant="outline"
                      className="btn-outline-metallic"
                    >
                      <Smartphone className="w-4 h-4 mr-2" />
                      Manage
                    </Button>
                  </div>
                </div>
              </div>

              <Button className="btn-metallic">
                <Save className="w-4 h-4 mr-2" />
                Update Security Settings
              </Button>
            </CardContent>
          </Card>

          {/* Notification Preferences */}
          <Card className="bg-black/40 border-gray-800/60 mt-6">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Bell className="w-5 h-5" />
                Notification Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-semibold text-white">Communication</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-white">Email Notifications</p>
                        <p className="text-gray-400 text-sm">
                          Receive updates via email
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        checked={notifications.email}
                        onChange={(e) =>
                          setNotifications({
                            ...notifications,
                            email: e.target.checked,
                          })
                        }
                        className="w-4 h-4 text-cyan-500"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-white">Push Notifications</p>
                        <p className="text-gray-400 text-sm">
                          Browser and mobile alerts
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        checked={notifications.push}
                        onChange={(e) =>
                          setNotifications({
                            ...notifications,
                            push: e.target.checked,
                          })
                        }
                        className="w-4 h-4 text-cyan-500"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-white">SMS Notifications</p>
                        <p className="text-gray-400 text-sm">
                          Text message alerts
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        checked={notifications.sms}
                        onChange={(e) =>
                          setNotifications({
                            ...notifications,
                            sms: e.target.checked,
                          })
                        }
                        className="w-4 h-4 text-cyan-500"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold text-white">Financial Alerts</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-white">Weekly Reports</p>
                        <p className="text-gray-400 text-sm">
                          Financial summary emails
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        checked={notifications.weeklyReport}
                        onChange={(e) =>
                          setNotifications({
                            ...notifications,
                            weeklyReport: e.target.checked,
                          })
                        }
                        className="w-4 h-4 text-cyan-500"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-white">Goal Reminders</p>
                        <p className="text-gray-400 text-sm">
                          Progress and deadline alerts
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        checked={notifications.goalReminders}
                        onChange={(e) =>
                          setNotifications({
                            ...notifications,
                            goalReminders: e.target.checked,
                          })
                        }
                        className="w-4 h-4 text-cyan-500"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-white">Price Alerts</p>
                        <p className="text-gray-400 text-sm">
                          Crypto and stock price changes
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        checked={notifications.priceAlerts}
                        onChange={(e) =>
                          setNotifications({
                            ...notifications,
                            priceAlerts: e.target.checked,
                          })
                        }
                        className="w-4 h-4 text-cyan-500"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Connected Accounts */}
          <Card className="bg-black/40 border-gray-800/60 mt-6">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Link className="w-5 h-5" />
                Connected Accounts
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-black/40 rounded-lg border border-gray-800/60">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-gray-600 to-gray-400 rounded-lg flex items-center justify-center">
                      <span className="text-white font-bold text-sm">B</span>
                    </div>
                    <div>
                      <p className="text-white font-semibold">
                        Bank Account (HDFC)
                      </p>
                      <p className="text-gray-400 text-sm">••••••••••••3456</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant="secondary"
                      className="bg-green-500/20 text-green-300"
                    >
                      Connected
                    </Badge>
                    <Button
                      size="sm"
                      variant="outline"
                      className="btn-outline-metallic"
                    >
                      Manage
                    </Button>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-black/40 rounded-lg border border-gray-800/60">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-gray-600 to-gray-400 rounded-lg flex items-center justify-center">
                      <span className="text-white font-bold text-sm">W</span>
                    </div>
                    <div>
                      <p className="text-white font-semibold">Solana Wallet</p>
                      <p className="text-gray-400 text-sm">7xKs...9mR2</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant="secondary"
                      className="bg-green-500/20 text-green-300"
                    >
                      Connected
                    </Badge>
                    <Button
                      size="sm"
                      variant="outline"
                      className="btn-outline-metallic"
                    >
                      Manage
                    </Button>
                  </div>
                </div>
              </div>

              <Button className="w-full btn-metallic">
                <Link className="w-4 h-4 mr-2" />
                Connect New Account
              </Button>
            </CardContent>
          </Card>

          {/* Data Export & Privacy */}
          <Card className="bg-black/40 border-gray-800/60 mt-6">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Database className="w-5 h-5" />
                Data & Privacy
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button variant="outline" className="btn-outline-metallic">
                  <Database className="w-4 h-4 mr-2" />
                  Export My Data
                </Button>
                <Button variant="outline" className="btn-outline-metallic">
                  <Globe className="w-4 h-4 mr-2" />
                  Privacy Settings
                </Button>
              </div>
              <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                <h4 className="font-semibold text-red-300 mb-2">Danger Zone</h4>
                <p className="text-gray-300 text-sm mb-3">
                  Permanently delete your account and all associated data. This
                  action cannot be undone.
                </p>
                <Button
                  variant="outline"
                  className="border-red-500 text-red-300 hover:bg-red-500/20"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Account
                </Button>
              </div>
            </CardContent>
          </Card>
        </AppSection>
      </AppLayout>
    </ProtectedRoute>
  );
}
