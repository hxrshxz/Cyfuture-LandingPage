"use client";

import { ProtectedRoute } from "@/contexts/AuthContext";
import AppLayout from "@/components/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ArrowUpRight,
  ArrowDownLeft,
  Search,
  Filter,
  Clock,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

export default function TransactionsPage() {
  const transactions = [
    {
      id: "TXN001",
      type: "buy",
      asset: "Bitcoin",
      symbol: "BTC",
      amount: "0.1245",
      value: "₹2,45,678",
      price: "₹19,74,532",
      date: "2024-01-15",
      time: "14:32:18",
      status: "completed",
      fee: "₹245",
    },
    {
      id: "TXN002",
      type: "sell",
      asset: "Ethereum",
      symbol: "ETH",
      amount: "1.5432",
      value: "₹3,24,567",
      price: "₹2,10,234",
      date: "2024-01-14",
      time: "09:15:42",
      status: "completed",
      fee: "₹324",
    },
    {
      id: "TXN003",
      type: "buy",
      asset: "Solana",
      symbol: "SOL",
      amount: "25.67",
      value: "₹45,678",
      price: "₹1,779",
      date: "2024-01-13",
      time: "16:45:23",
      status: "pending",
      fee: "₹45",
    },
    {
      id: "TXN004",
      type: "sell",
      asset: "Cardano",
      symbol: "ADA",
      amount: "1250.00",
      value: "₹78,432",
      price: "₹62.75",
      date: "2024-01-12",
      time: "11:22:07",
      status: "failed",
      fee: "₹78",
    },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-4 h-4 text-green-400" />;
      case "pending":
        return <Clock className="w-4 h-4 text-yellow-400" />;
      case "failed":
        return <AlertCircle className="w-4 h-4 text-red-400" />;
      default:
        return <Clock className="w-4 h-4 text-slate-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-500/20 text-green-300";
      case "pending":
        return "bg-yellow-500/20 text-yellow-300";
      case "failed":
        return "bg-red-500/20 text-red-300";
      default:
        return "bg-slate-500/20 text-slate-300";
    }
  };

  return (
    <ProtectedRoute>
      <AppLayout>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="display-3 mt-0 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-blue-300 to-blue-200 blue-glow-text font-geist">
                Transactions
              </h1>
              <p className="text-gray-400 text-lg md:text-xl mt-2 font-geist">
                View and manage your trading history
              </p>
            </div>
            <Button className="bg-cyan-500 hover:bg-cyan-600 text-white">
              Export History
            </Button>
          </div>

          {/* Transaction Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="card-glow hover:shadow-blue-500/20 transition-all duration-300 rounded-2xl">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-300">
                  Total Transactions
                </CardTitle>
                <Badge
                  variant="secondary"
                  className="bg-blue-500/20 text-blue-300"
                >
                  All Time
                </Badge>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">1,247</div>
                <p className="text-blue-400 text-sm">+23 this month</p>
              </CardContent>
            </Card>

            <Card className="card-glow hover:shadow-blue-500/20 transition-all duration-300 rounded-2xl">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-300">
                  Total Volume
                </CardTitle>
                <ArrowUpRight className="h-4 w-4 text-green-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">₹45,67,890</div>
                <p className="text-green-400 text-sm">+12.5% vs last month</p>
              </CardContent>
            </Card>

            <Card className="card-glow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-300">
                  Average Trade Size
                </CardTitle>
                <Badge
                  variant="secondary"
                  className="bg-purple-500/20 text-purple-300"
                >
                  AVG
                </Badge>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">₹36,678</div>
                <p className="text-slate-400 text-sm">Last 30 days</p>
              </CardContent>
            </Card>

            <Card className="card-glow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-300">
                  Total Fees Paid
                </CardTitle>
                <ArrowDownLeft className="h-4 w-4 text-orange-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">₹12,456</div>
                <p className="text-slate-400 text-sm">0.27% of volume</p>
              </CardContent>
            </Card>
          </div>

          {/* Filters and Search */}
          <Card className="card-glow">
            <CardHeader>
              <CardTitle className="text-white">Filter Transactions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <Input
                    placeholder="Search transactions..."
                    className="pl-10 bg-slate-900/50 border-slate-600 text-white placeholder-slate-400"
                  />
                </div>
                <Button
                  variant="outline"
                  className="border-slate-600 text-slate-300 hover:bg-slate-700"
                >
                  <Filter className="w-4 h-4 mr-2" />
                  Filter
                </Button>
                <select className="px-4 py-2 bg-slate-900/50 border border-slate-600 rounded-md text-white">
                  <option value="all">All Types</option>
                  <option value="buy">Buy Orders</option>
                  <option value="sell">Sell Orders</option>
                </select>
                <select className="px-4 py-2 bg-slate-900/50 border border-slate-600 rounded-md text-white">
                  <option value="all">All Status</option>
                  <option value="completed">Completed</option>
                  <option value="pending">Pending</option>
                  <option value="failed">Failed</option>
                </select>
              </div>
            </CardContent>
          </Card>

          {/* Transactions List */}
          <Card className="card-glow">
            <CardHeader>
              <CardTitle className="text-white">Recent Transactions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {transactions.map((tx) => (
                  <div
                    key={tx.id}
                    className="flex items-center justify-between p-4 bg-slate-900/50 rounded-lg border border-slate-700 hover:border-slate-600 transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          tx.type === "buy"
                            ? "bg-green-500/20"
                            : "bg-red-500/20"
                        }`}
                      >
                        {tx.type === "buy" ? (
                          <ArrowDownLeft className="w-5 h-5 text-green-400" />
                        ) : (
                          <ArrowUpRight className="w-5 h-5 text-red-400" />
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold text-white">
                            {tx.type.toUpperCase()} {tx.asset}
                          </h4>
                          <Badge
                            variant="secondary"
                            className={getStatusColor(tx.status)}
                          >
                            {getStatusIcon(tx.status)}
                            <span className="ml-1">{tx.status}</span>
                          </Badge>
                        </div>
                        <p className="text-slate-400 text-sm">
                          {tx.amount} {tx.symbol} • {tx.date} at {tx.time}
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="font-semibold text-white">{tx.value}</div>
                      <div className="text-slate-400 text-sm">
                        @ {tx.price} • Fee: {tx.fee}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-center mt-6">
                <Button
                  variant="outline"
                  className="border-slate-600 text-slate-300 hover:bg-slate-700"
                >
                  Load More Transactions
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* AI Transaction Insights */}
          <Card className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border-blue-500/30">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Badge
                  variant="secondary"
                  className="bg-blue-500/20 text-blue-300"
                >
                  AI
                </Badge>
                Transaction Insights
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-slate-800/50 rounded-lg">
                <h4 className="font-semibold text-white mb-2">
                  Trading Pattern Analysis
                </h4>
                <p className="text-slate-300">
                  You tend to make more buy orders during market dips. Consider
                  setting up automated DCA strategies.
                </p>
              </div>
              <div className="p-4 bg-slate-800/50 rounded-lg">
                <h4 className="font-semibold text-white mb-2">
                  Fee Optimization
                </h4>
                <p className="text-slate-300">
                  You could save ₹2,345 monthly by consolidating smaller trades
                  into larger ones to reduce fee percentage.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </AppLayout>
    </ProtectedRoute>
  );
}
