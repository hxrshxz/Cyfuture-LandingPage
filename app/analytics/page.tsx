"use client";

import { ProtectedRoute } from "@/contexts/AuthContext";
import AppLayout from "@/components/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  PieChart,
  TrendingUp,
  DollarSign,
  ArrowUp,
  ArrowDown,
} from "lucide-react";

export default function AnalyticsPage() {
  return (
    <ProtectedRoute>
      <AppLayout>
        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white">Analytics</h1>
              <p className="text-slate-400 mt-2">
                Deep insights into your financial performance
              </p>
            </div>
            <Badge variant="secondary" className="bg-cyan-500/20 text-cyan-300">
              AI Powered
            </Badge>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-300">
                  Total Revenue
                </CardTitle>
                <DollarSign className="h-4 w-4 text-green-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">₹12,45,678</div>
                <div className="flex items-center text-green-400 text-sm">
                  <ArrowUp className="h-4 w-4 mr-1" />
                  <span>+12.5% from last month</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-300">
                  Expenses
                </CardTitle>
                <TrendingUp className="h-4 w-4 text-red-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">₹8,76,543</div>
                <div className="flex items-center text-red-400 text-sm">
                  <ArrowUp className="h-4 w-4 mr-1" />
                  <span>+3.2% from last month</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-300">
                  Net Profit
                </CardTitle>
                <PieChart className="h-4 w-4 text-cyan-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">₹3,69,135</div>
                <div className="flex items-center text-green-400 text-sm">
                  <ArrowUp className="h-4 w-4 mr-1" />
                  <span>+8.7% from last month</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-300">
                  Growth Rate
                </CardTitle>
                <TrendingUp className="h-4 w-4 text-purple-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">15.3%</div>
                <div className="flex items-center text-green-400 text-sm">
                  <ArrowUp className="h-4 w-4 mr-1" />
                  <span>+2.1% from last month</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Revenue Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 bg-slate-900/50 rounded-lg flex items-center justify-center">
                  <p className="text-slate-400">Interactive Revenue Chart</p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Expense Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 bg-slate-900/50 rounded-lg flex items-center justify-center">
                  <p className="text-slate-400">Interactive Expense Chart</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* AI Insights */}
          <Card className="bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border-cyan-500/30">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Badge
                  variant="secondary"
                  className="bg-cyan-500/20 text-cyan-300"
                >
                  AI
                </Badge>
                Financial Insights
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-slate-800/50 rounded-lg">
                <h4 className="font-semibold text-white mb-2">
                  Revenue Optimization
                </h4>
                <p className="text-slate-300">
                  Your Q4 revenue shows strong growth. Consider increasing
                  marketing spend in the next quarter to capitalize on this
                  trend.
                </p>
              </div>
              <div className="p-4 bg-slate-800/50 rounded-lg">
                <h4 className="font-semibold text-white mb-2">
                  Cost Management
                </h4>
                <p className="text-slate-300">
                  Office expenses have increased by 15%. Review recurring
                  subscriptions and negotiate better rates with vendors.
                </p>
              </div>
              <Button className="bg-cyan-500 hover:bg-cyan-600 text-white">
                Generate Detailed Report
              </Button>
            </CardContent>
          </Card>
        </div>
      </AppLayout>
    </ProtectedRoute>
  );
}
