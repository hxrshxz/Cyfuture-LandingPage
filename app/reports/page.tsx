"use client";

import { ProtectedRoute } from "@/contexts/AuthContext";
import AppLayout from "@/components/AppLayout";
import AppSection from "@/components/AppSection";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  FileText,
  Download,
  Calendar,
  TrendingUp,
  PieChart,
  BarChart3,
  Share,
  Filter,
} from "lucide-react";

export default function ReportsPage() {
  const reports = [
    {
      id: 1,
      title: "Monthly Financial Summary",
      description:
        "Comprehensive overview of income, expenses, and savings for January 2024",
      type: "Monthly",
      generatedDate: "2024-01-31",
      period: "January 2024",
      status: "ready",
      size: "2.4 MB",
    },
    {
      id: 2,
      title: "Portfolio Performance Analysis",
      description:
        "Detailed analysis of investment performance and asset allocation",
      type: "Investment",
      generatedDate: "2024-01-28",
      period: "Q4 2023",
      status: "ready",
      size: "1.8 MB",
    },
    {
      id: 3,
      title: "Tax Preparation Report",
      description:
        "All transactions and tax-relevant financial data for FY 2023-24",
      type: "Tax",
      generatedDate: "2024-01-25",
      period: "FY 2023-24",
      status: "generating",
      size: "3.2 MB",
    },
    {
      id: 4,
      title: "Expense Category Breakdown",
      description: "Detailed categorization and analysis of all expenses",
      type: "Expenses",
      generatedDate: "2024-01-30",
      period: "January 2024",
      status: "ready",
      size: "1.2 MB",
    },
  ];

  const quickReports = [
    {
      title: "Net Worth Statement",
      description: "Current assets, liabilities, and net worth calculation",
      icon: TrendingUp,
      color: "from-green-500 to-emerald-500",
    },
    {
      title: "Cash Flow Analysis",
      description: "Monthly cash inflows and outflows breakdown",
      icon: BarChart3,
      color: "from-blue-500 to-cyan-500",
    },
    {
      title: "Investment Summary",
      description: "Portfolio performance and allocation overview",
      icon: PieChart,
      color: "from-purple-500 to-pink-500",
    },
    {
      title: "Budget vs Actual",
      description: "Compare planned budget with actual spending",
      icon: FileText,
      color: "from-orange-500 to-red-500",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ready":
        return "bg-green-500/20 text-green-300";
      case "generating":
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
        <AppSection
          title="Reports"
          subtitle="Generate and download detailed financial reports"
          actions={
            <div className="flex gap-3">
              <Button variant="outline" className="btn-outline-metallic">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
              <Button className="btn-metallic">
                <FileText className="w-4 h-4 mr-2" />
                Generate Custom Report
              </Button>
            </div>
          }
        >
          {/* Report Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-black/40 border-gray-800/60">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-300">
                  Total Reports
                </CardTitle>
                <FileText className="h-4 w-4 text-gray-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">24</div>
                <p className="text-gray-400 text-sm">Generated this year</p>
              </CardContent>
            </Card>

            <Card className="bg-black/40 border-gray-800/60">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-300">
                  Downloads
                </CardTitle>
                <Download className="h-4 w-4 text-gray-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">156</div>
                <p className="text-gray-400 text-sm">+23% this month</p>
              </CardContent>
            </Card>

            <Card className="bg-black/40 border-gray-800/60">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-300">
                  Storage Used
                </CardTitle>
                <Badge
                  variant="secondary"
                  className="bg-gray-700/50 text-gray-300"
                >
                  68%
                </Badge>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">34.2 MB</div>
                <p className="text-gray-400 text-sm">of 50 MB limit</p>
              </CardContent>
            </Card>

            <Card className="bg-black/40 border-gray-800/60">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-300">
                  Last Generated
                </CardTitle>
                <Calendar className="h-4 w-4 text-gray-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">Today</div>
                <p className="text-gray-400 text-sm">Monthly summary</p>
              </CardContent>
            </Card>
          </div>

          {/* Quick Reports */}
          <Card className="bg-black/40 border-gray-800/60 mt-6">
            <CardHeader>
              <CardTitle className="text-white">Quick Reports</CardTitle>
              <p className="text-gray-400">
                Generate instant reports for immediate insights
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {quickReports.map((report, index) => (
                  <div
                    key={index}
                    className="p-4 bg-black/40 rounded-lg border border-gray-800/60 hover:border-gray-700 transition-colors cursor-pointer group"
                  >
                    <div
                      className={`w-12 h-12 rounded-lg bg-gradient-to-r ${report.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}
                    >
                      <report.icon className="w-6 h-6 text-white" />
                    </div>
                    <h4 className="font-semibold text-white mb-2">
                      {report.title}
                    </h4>
                    <p className="text-gray-400 text-sm">
                      {report.description}
                    </p>
                    <Button size="sm" className="w-full mt-3 btn-metallic">
                      Generate Now
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Generated Reports */}
          <Card className="bg-black/40 border-gray-800/60 mt-6">
            <CardHeader>
              <CardTitle className="text-white">Generated Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {reports.map((report) => (
                  <div
                    key={report.id}
                    className="flex items-center justify-between p-4 bg-black/40 rounded-lg border border-gray-800/60 hover:border-gray-700 transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-gray-600 to-gray-400 rounded-lg flex items-center justify-center">
                        <FileText className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold text-white">
                            {report.title}
                          </h4>
                          <Badge
                            variant="secondary"
                            className={getStatusColor(report.status)}
                          >
                            {report.status}
                          </Badge>
                          <Badge
                            variant="outline"
                            className="border-gray-700 text-gray-300"
                          >
                            {report.type}
                          </Badge>
                        </div>
                        <p className="text-gray-400 text-sm mb-1">
                          {report.description}
                        </p>
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span>Period: {report.period}</span>
                          <span>
                            Generated:{" "}
                            {new Date(
                              report.generatedDate
                            ).toLocaleDateString()}
                          </span>
                          <span>Size: {report.size}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="btn-outline-metallic"
                        disabled={report.status !== "ready"}
                      >
                        <Share className="w-4 h-4 mr-2" />
                        Share
                      </Button>
                      <Button
                        size="sm"
                        className="btn-metallic"
                        disabled={report.status !== "ready"}
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Download
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Custom Report Builder */}
          <Card className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border-indigo-500/30 mt-6">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Badge
                  variant="secondary"
                  className="bg-indigo-500/20 text-indigo-300"
                >
                  Pro
                </Badge>
                Custom Report Builder
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-300">
                Create personalized reports with specific date ranges,
                categories, and metrics tailored to your needs.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-black/40 rounded-lg border border-gray-800/60">
                  <h4 className="font-semibold text-white mb-2">
                    Date Range Selection
                  </h4>
                  <p className="text-gray-400 text-sm">
                    Choose custom periods from daily to yearly reports
                  </p>
                </div>
                <div className="p-4 bg-black/40 rounded-lg border border-gray-800/60">
                  <h4 className="font-semibold text-white mb-2">
                    Category Filtering
                  </h4>
                  <p className="text-gray-400 text-sm">
                    Include specific expense categories or investment types
                  </p>
                </div>
                <div className="p-4 bg-black/40 rounded-lg border border-gray-800/60">
                  <h4 className="font-semibold text-white mb-2">
                    Export Formats
                  </h4>
                  <p className="text-gray-400 text-sm">
                    PDF, Excel, CSV, and interactive web reports
                  </p>
                </div>
              </div>
              <Button className="btn-metallic">Launch Report Builder</Button>
            </CardContent>
          </Card>

          {/* AI Report Insights */}
          <Card className="bg-gradient-to-r from-orange-500/10 to-yellow-500/10 border-orange-500/30 mt-6">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Badge
                  variant="secondary"
                  className="bg-orange-500/20 text-orange-300"
                >
                  AI
                </Badge>
                Report Insights
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-black/40 rounded-lg border border-gray-800/60">
                <h4 className="font-semibold text-white mb-2">
                  Trending Patterns
                </h4>
                <p className="text-gray-300">
                  Your monthly reports show consistent savings growth of 15%
                  over the last 6 months. Consider generating quarterly
                  investment reviews.
                </p>
              </div>
              <div className="p-4 bg-black/40 rounded-lg border border-gray-800/60">
                <h4 className="font-semibold text-white mb-2">
                  Report Recommendations
                </h4>
                <p className="text-gray-300">
                  Based on your transaction patterns, we recommend generating
                  weekly cash flow reports during high-spending periods.
                </p>
              </div>
            </CardContent>
          </Card>
        </AppSection>
      </AppLayout>
    </ProtectedRoute>
  );
}
