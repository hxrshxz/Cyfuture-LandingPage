"use client";

import { ProtectedRoute } from "@/contexts/AuthContext";
import AppLayout from "@/components/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Target,
  Plus,
  Edit,
  TrendingUp,
  Calendar,
  IndianRupee,
  CheckCircle,
  Clock,
} from "lucide-react";
import { useState } from "react";

export default function GoalsPage() {
  const [goals, setGoals] = useState([
    {
      id: 1,
      title: "Emergency Fund",
      description: "Build a 6-month emergency fund for financial security",
      targetAmount: 600000,
      currentAmount: 245000,
      deadline: "2024-12-31",
      category: "Emergency",
      status: "in-progress",
      monthlyTarget: 25000,
    },
    {
      id: 2,
      title: "Home Down Payment",
      description: "Save for a 20% down payment on a new home",
      targetAmount: 2000000,
      currentAmount: 850000,
      deadline: "2025-06-30",
      category: "Real Estate",
      status: "in-progress",
      monthlyTarget: 65000,
    },
    {
      id: 3,
      title: "Vacation Fund",
      description: "Plan a dream vacation to Europe",
      targetAmount: 150000,
      currentAmount: 150000,
      deadline: "2024-03-15",
      category: "Lifestyle",
      status: "completed",
      monthlyTarget: 15000,
    },
    {
      id: 4,
      title: "Crypto Investment",
      description: "Diversify portfolio with cryptocurrency investments",
      targetAmount: 500000,
      currentAmount: 125000,
      deadline: "2024-08-31",
      category: "Investment",
      status: "behind",
      monthlyTarget: 35000,
    },
  ]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getProgressPercentage = (current: number, target: number) => {
    return Math.min((current / target) * 100, 100);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-500/20 text-green-300";
      case "in-progress":
        return "bg-blue-500/20 text-blue-300";
      case "behind":
        return "bg-red-500/20 text-red-300";
      default:
        return "bg-slate-500/20 text-slate-300";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-4 h-4" />;
      case "in-progress":
        return <Clock className="w-4 h-4" />;
      case "behind":
        return <Target className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const totalGoals = goals.length;
  const completedGoals = goals.filter((g) => g.status === "completed").length;
  const totalTargetAmount = goals.reduce(
    (sum, goal) => sum + goal.targetAmount,
    0
  );
  const totalCurrentAmount = goals.reduce(
    (sum, goal) => sum + goal.currentAmount,
    0
  );

  return (
    <ProtectedRoute>
      <AppLayout>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="display-3 mt-0 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-blue-300 to-blue-200 blue-glow-text font-geist">
                Financial Goals
              </h1>
              <p className="text-gray-400 text-lg md:text-xl mt-2 font-geist">
                Track and achieve your financial objectives
              </p>
            </div>
            <Button className="bg-cyan-500 hover:bg-cyan-600 text-white">
              <Plus className="w-4 h-4 mr-2" />
              Add New Goal
            </Button>
          </div>

          {/* Goals Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="card-glow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-300">
                  Total Goals
                </CardTitle>
                <Target className="h-4 w-4 text-cyan-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">
                  {totalGoals}
                </div>
                <p className="text-slate-400 text-sm">
                  {completedGoals} completed
                </p>
              </CardContent>
            </Card>

            <Card className="card-glow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-300">
                  Target Amount
                </CardTitle>
                <IndianRupee className="h-4 w-4 text-green-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">
                  {formatCurrency(totalTargetAmount)}
                </div>
                <p className="text-slate-400 text-sm">Across all goals</p>
              </CardContent>
            </Card>

            <Card className="card-glow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-300">
                  Amount Saved
                </CardTitle>
                <TrendingUp className="h-4 w-4 text-blue-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">
                  {formatCurrency(totalCurrentAmount)}
                </div>
                <p className="text-green-400 text-sm">
                  {((totalCurrentAmount / totalTargetAmount) * 100).toFixed(1)}%
                  of target
                </p>
              </CardContent>
            </Card>

            <Card className="card-glow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-300">
                  Completion Rate
                </CardTitle>
                <Badge
                  variant="secondary"
                  className="bg-purple-500/20 text-purple-300"
                >
                  {Math.round((completedGoals / totalGoals) * 100)}%
                </Badge>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">
                  {completedGoals}/{totalGoals}
                </div>
                <p className="text-slate-400 text-sm">Goals achieved</p>
              </CardContent>
            </Card>
          </div>

          {/* Goals List */}
          <div className="space-y-6">
            {goals.map((goal) => (
              <Card key={goal.id} className="card-glow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <h3 className="text-xl font-semibold text-white">
                        {goal.title}
                      </h3>
                      <Badge
                        variant="secondary"
                        className={getStatusColor(goal.status)}
                      >
                        {getStatusIcon(goal.status)}
                        <span className="ml-1 capitalize">
                          {goal.status.replace("-", " ")}
                        </span>
                      </Badge>
                      <Badge
                        variant="outline"
                        className="border-slate-600 text-slate-300"
                      >
                        {goal.category}
                      </Badge>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-slate-600 text-slate-300 hover:bg-slate-700"
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                  </div>
                  <p className="text-slate-400">{goal.description}</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Progress Bar */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-300">Progress</span>
                      <span className="text-white font-medium">
                        {formatCurrency(goal.currentAmount)} /{" "}
                        {formatCurrency(goal.targetAmount)}
                      </span>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-3">
                      <div
                        className="bg-gradient-to-r from-cyan-500 to-blue-500 h-3 rounded-full transition-all duration-500"
                        style={{
                          width: `${getProgressPercentage(
                            goal.currentAmount,
                            goal.targetAmount
                          )}%`,
                        }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-sm text-slate-400">
                      <span>
                        {Math.round(
                          getProgressPercentage(
                            goal.currentAmount,
                            goal.targetAmount
                          )
                        )}
                        % complete
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        Due: {new Date(goal.deadline).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  {/* Monthly Target */}
                  <div className="flex items-center justify-between p-3 bg-slate-900/50 rounded-lg">
                    <div>
                      <p className="text-sm text-slate-400">Monthly Target</p>
                      <p className="font-semibold text-white">
                        {formatCurrency(goal.monthlyTarget)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-400">Remaining</p>
                      <p className="font-semibold text-white">
                        {formatCurrency(goal.targetAmount - goal.currentAmount)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Add Goal Section */}
          <Card className="card-glow border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Target className="w-12 h-12 text-slate-400 mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">
                Create Your Next Goal
              </h3>
              <p className="text-slate-400 text-center mb-4">
                Start working towards your financial dreams by setting specific,
                measurable goals
              </p>
              <Button className="bg-cyan-500 hover:bg-cyan-600 text-white">
                <Plus className="w-4 h-4 mr-2" />
                Add New Goal
              </Button>
            </CardContent>
          </Card>

          {/* AI Goal Insights */}
          <Card className="bg-gradient-to-r from-green-500/10 to-teal-500/10 border-green-500/30">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Badge
                  variant="secondary"
                  className="bg-green-500/20 text-green-300"
                >
                  AI
                </Badge>
                Goal Achievement Insights
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-slate-800/50 rounded-lg">
                <h4 className="font-semibold text-white mb-2">
                  Achievability Analysis
                </h4>
                <p className="text-slate-300">
                  Your emergency fund goal is on track! Consider increasing
                  monthly contributions to your home down payment goal by
                  ₹10,000 to meet the deadline.
                </p>
              </div>
              <div className="p-4 bg-slate-800/50 rounded-lg">
                <h4 className="font-semibold text-white mb-2">
                  Goal Prioritization
                </h4>
                <p className="text-slate-300">
                  Based on your spending patterns, prioritize completing your
                  emergency fund before increasing crypto investments for better
                  financial security.
                </p>
              </div>
              <div className="p-4 bg-slate-800/50 rounded-lg">
                <h4 className="font-semibold text-white mb-2">
                  Optimization Tip
                </h4>
                <p className="text-slate-300">
                  You could achieve your goals 2 months faster by redirecting
                  your entertainment budget (₹8,000/month) towards your highest
                  priority goals.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </AppLayout>
    </ProtectedRoute>
  );
}
