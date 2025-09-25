"use client";

import { ProtectedRoute } from "@/contexts/AuthContext";
import AppLayout from "@/components/AppLayout";
import AppSection from "@/components/AppSection";
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
        <AppSection
          title="Analytics"
          subtitle="Deep insights into your financial performance"
          actions={
            <Badge variant="outline" className="border-gray-700 text-gray-300">
              AI Powered
            </Badge>
          }
        >
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-black/40 border-gray-800/60">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-300">
                  Total Revenue
                </CardTitle>
                <DollarSign className="h-4 w-4 text-gray-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">₹12,45,678</div>
                <div className="flex items-center text-gray-400 text-sm">
                  <ArrowUp className="h-4 w-4 mr-1" />
                  <span>+12.5% from last month</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-black/40 border-gray-800/60">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-300">
                  Expenses
                </CardTitle>
                <TrendingUp className="h-4 w-4 text-gray-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">₹8,76,543</div>
                <div className="flex items-center text-gray-400 text-sm">
                  <ArrowUp className="h-4 w-4 mr-1" />
                  <span>+3.2% from last month</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-black/40 border-gray-800/60">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-300">
                  Net Profit
                </CardTitle>
                <PieChart className="h-4 w-4 text-gray-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">₹3,69,135</div>
                <div className="flex items-center text-gray-400 text-sm">
                  <ArrowUp className="h-4 w-4 mr-1" />
                  <span>+8.7% from last month</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-black/40 border-gray-800/60">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-300">
                  Growth Rate
                </CardTitle>
                <TrendingUp className="h-4 w-4 text-gray-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">15.3%</div>
                <div className="flex items-center text-gray-400 text-sm">
                  <ArrowUp className="h-4 w-4 mr-1" />
                  <span>+2.1% from last month</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
            <Card className="bg-black/40 border-gray-800/60">
              <CardHeader>
                <CardTitle className="text-white">Revenue Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 bg-black/40 rounded-lg flex items-center justify-center border border-gray-800/60">
                  <p className="text-gray-400">Interactive Revenue Chart</p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-black/40 border-gray-800/60">
              <CardHeader>
                <CardTitle className="text-white">Expense Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 bg-black/40 rounded-lg flex items-center justify-center border border-gray-800/60">
                  <p className="text-gray-400">Interactive Expense Chart</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* AI Insights */}
          <Card className="bg-black/40 border-gray-800/60 mt-6">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Badge
                  variant="outline"
                  className="border-gray-700 text-gray-300"
                >
                  AI
                </Badge>
                Financial Insights
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-black/40 rounded-lg border border-gray-800/60">
                <h4 className="font-semibold text-white mb-2">
                  Revenue Optimization
                </h4>
                <p className="text-gray-300">
                  Your Q4 revenue shows strong growth. Consider increasing
                  marketing spend in the next quarter to capitalize on this
                  trend.
                </p>
              </div>
              <div className="p-4 bg-black/40 rounded-lg border border-gray-800/60">
                <h4 className="font-semibold text-white mb-2">
                  Cost Management
                </h4>
                <p className="text-gray-300">
                  Office expenses have increased by 15%. Review recurring
                  subscriptions and negotiate better rates with vendors.
                </p>
              </div>
              <Button className="btn-metallic">Generate Detailed Report</Button>
            </CardContent>
          </Card>
        </AppSection>
      </AppLayout>
    </ProtectedRoute>
  );
}
