"use client";

import { ProtectedRoute } from "@/contexts/AuthContext";
import AppLayout from "@/components/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  PieChart,
  TrendingUp,
  TrendingDown,
  ArrowUp,
  ArrowDown,
  Plus,
} from "lucide-react";

export default function PortfolioPage() {
  const holdings = [
    {
      symbol: "BTCUSDT",
      name: "Bitcoin",
      amount: "0.5821",
      value: "₹12,45,789",
      change: "+5.67%",
      changeType: "positive",
    },
    {
      symbol: "ETHUSDT",
      name: "Ethereum",
      amount: "3.2154",
      value: "₹6,78,432",
      change: "+3.21%",
      changeType: "positive",
    },
    {
      symbol: "SOLUSDT",
      name: "Solana",
      amount: "125.67",
      value: "₹2,34,567",
      change: "-1.45%",
      changeType: "negative",
    },
  ];

  const totalValue = "₹21,58,788";
  const totalChange = "+4.23%";

  return (
    <ProtectedRoute>
      <AppLayout>
        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white">Portfolio</h1>
              <p className="text-slate-400 mt-2">
                Track your investments and crypto holdings
              </p>
            </div>
            <Button className="bg-cyan-500 hover:bg-cyan-600 text-white">
              <Plus className="w-4 h-4 mr-2" />
              Add Investment
            </Button>
          </div>

          {/* Portfolio Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-300">
                  Total Portfolio Value
                </CardTitle>
                <PieChart className="h-4 w-4 text-cyan-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">
                  {totalValue}
                </div>
                <div className="flex items-center text-green-400 text-sm">
                  <ArrowUp className="h-4 w-4 mr-1" />
                  <span>{totalChange} from last week</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-300">
                  Best Performer
                </CardTitle>
                <TrendingUp className="h-4 w-4 text-green-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">Bitcoin</div>
                <div className="flex items-center text-green-400 text-sm">
                  <ArrowUp className="h-4 w-4 mr-1" />
                  <span>+5.67% today</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-300">
                  Total Holdings
                </CardTitle>
                <Badge
                  variant="secondary"
                  className="bg-purple-500/20 text-purple-300"
                >
                  3 Assets
                </Badge>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">3</div>
                <div className="text-slate-400 text-sm">Crypto assets</div>
              </CardContent>
            </Card>
          </div>

          {/* Holdings List */}
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Current Holdings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {holdings.map((holding, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 bg-slate-900/50 rounded-lg border border-slate-700"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-sm">
                          {holding.symbol.slice(0, 2)}
                        </span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-white">
                          {holding.name}
                        </h4>
                        <p className="text-slate-400 text-sm">
                          {holding.amount} {holding.symbol.replace("USDT", "")}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-white">
                        {holding.value}
                      </div>
                      <div
                        className={`text-sm flex items-center ${
                          holding.changeType === "positive"
                            ? "text-green-400"
                            : "text-red-400"
                        }`}
                      >
                        {holding.changeType === "positive" ? (
                          <ArrowUp className="w-3 h-3 mr-1" />
                        ) : (
                          <ArrowDown className="w-3 h-3 mr-1" />
                        )}
                        {holding.change}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Portfolio Chart */}
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">
                Portfolio Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 bg-slate-900/50 rounded-lg flex items-center justify-center">
                <p className="text-slate-400">Interactive Portfolio Chart</p>
              </div>
            </CardContent>
          </Card>

          {/* AI Recommendations */}
          <Card className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-purple-500/30">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Badge
                  variant="secondary"
                  className="bg-purple-500/20 text-purple-300"
                >
                  AI
                </Badge>
                Investment Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-slate-800/50 rounded-lg">
                <h4 className="font-semibold text-white mb-2">
                  Diversification Opportunity
                </h4>
                <p className="text-slate-300">
                  Consider adding some traditional assets or stablecoins to
                  balance your crypto-heavy portfolio.
                </p>
              </div>
              <div className="p-4 bg-slate-800/50 rounded-lg">
                <h4 className="font-semibold text-white mb-2">
                  Rebalancing Suggestion
                </h4>
                <p className="text-slate-300">
                  Your Bitcoin allocation is at 57%. Consider taking some
                  profits and diversifying into other assets.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </AppLayout>
    </ProtectedRoute>
  );
}
