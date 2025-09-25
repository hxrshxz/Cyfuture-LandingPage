"use client";

import { ProtectedRoute } from "@/contexts/AuthContext";
import AppLayout from "@/components/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Upload,
  CheckCircle,
  AlertTriangle,
  Download,
  FileText,
  Calculator,
} from "lucide-react";

export default function GSTReconciliationPage() {
  const purchaseInvoices = [
    {
      id: "TS-001",
      vendor: "Tech Supplies Inc.",
      amount: 12500,
      gst: 2250,
      date: "2024-08-15",
      status: "matched",
      blockchain_hash: "5FHneW7F2p4Z3q8X9vR2mN8K1tL6dJ9sE4aC7bG3xY1z",
    },
    {
      id: "OD-45A",
      vendor: "Office Depot",
      amount: 8200,
      gst: 1476,
      date: "2024-08-16",
      status: "missing_in_gstr2b",
      blockchain_hash: "3KjMp9N2xR5vQ7wE8tY1fL4nS6uI0hC9aD2bF5gT8zX",
    },
    {
      id: "SW-789",
      vendor: "Software Solutions",
      amount: 25000,
      gst: 4500,
      date: "2024-08-20",
      status: "value_mismatch",
      gst_portal_amount: 25200,
      blockchain_hash: "7LpQr4T8xN1mW9vE5yI2oU6aS3dF0gH7jK9bC1zX5nM",
    },
  ];

  const gstSummary = {
    total_purchase_amount: 45700,
    total_gst_amount: 8226,
    gst_portal_amount: 8426,
    difference: -200,
    itc_available: 8026,
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "matched":
        return "bg-green-500/20 text-green-300";
      case "missing_in_gstr2b":
        return "bg-blue-500/20 text-blue-300";
      case "value_mismatch":
        return "bg-orange-500/20 text-orange-300";
      default:
        return "bg-slate-500/20 text-slate-300";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "matched":
        return <CheckCircle className="w-4 h-4" />;
      case "missing_in_gstr2b":
        return <FileText className="w-4 h-4" />;
      case "value_mismatch":
        return <AlertTriangle className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  return (
    <ProtectedRoute>
      <AppLayout>
        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white">
                GST Reconciliation Center
              </h1>
              <p className="text-slate-400 mt-2">
                Three-step process for monthly GST compliance
              </p>
            </div>
            <Button className="bg-cyan-500 hover:bg-cyan-600 text-white">
              <Download className="w-4 h-4 mr-2" />
              Export Report
            </Button>
          </div>

          {/* Process Steps */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Badge
                    variant="secondary"
                    className="bg-green-500/20 text-green-300"
                  >
                    Step 1
                  </Badge>
                  <CheckCircle className="w-5 h-5 text-green-400" />
                </div>
                <CardTitle className="text-white">
                  Your Purchase Register
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-400 text-sm mb-4">
                  Automatically compiled from blockchain-secured invoices
                </p>
                <div className="font-semibold text-green-400">
                  <CheckCircle className="w-4 h-4 inline mr-2" />
                  {purchaseInvoices.length} invoices loaded
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Badge
                    variant="secondary"
                    className="bg-orange-500/20 text-orange-300"
                  >
                    Step 2
                  </Badge>
                  <Upload className="w-5 h-5 text-orange-400" />
                </div>
                <CardTitle className="text-white">Upload GSTR-2B</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-400 text-sm mb-4">
                  Upload JSON file from GST portal for comparison
                </p>
                <Button
                  variant="outline"
                  className="w-full border-dashed border-slate-600 text-orange-400 hover:bg-slate-700"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Upload GSTR-2B JSON
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Badge
                    variant="secondary"
                    className="bg-blue-500/20 text-blue-300"
                  >
                    Step 3
                  </Badge>
                  <Calculator className="w-5 h-5 text-blue-400" />
                </div>
                <CardTitle className="text-white">AI Reconciliation</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-400 text-sm mb-4">
                  Automated comparison and mismatch detection
                </p>
                <div className="font-semibold text-blue-400">
                  <AlertTriangle className="w-4 h-4 inline mr-2" />2 issues
                  found
                </div>
              </CardContent>
            </Card>
          </div>

          {/* GST Summary */}
          <Card className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border-blue-500/30">
            <CardHeader>
              <CardTitle className="text-white">
                GST Position Summary - August 2024
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div className="bg-slate-800/50 p-4 rounded-lg">
                    <p className="text-sm text-slate-400">
                      Total Purchase Amount
                    </p>
                    <p className="text-2xl font-bold text-white">
                      ₹
                      {gstSummary.total_purchase_amount.toLocaleString("en-IN")}
                    </p>
                  </div>
                  <div className="bg-slate-800/50 p-4 rounded-lg">
                    <p className="text-sm text-slate-400">
                      Total GST (Your Records)
                    </p>
                    <p className="text-2xl font-bold text-cyan-400">
                      ₹{gstSummary.total_gst_amount.toLocaleString("en-IN")}
                    </p>
                  </div>
                  <div className="bg-slate-800/50 p-4 rounded-lg">
                    <p className="text-sm text-slate-400">GST Portal Amount</p>
                    <p className="text-2xl font-bold text-orange-400">
                      ₹{gstSummary.gst_portal_amount.toLocaleString("en-IN")}
                    </p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="bg-slate-800/50 p-4 rounded-lg border-l-4 border-red-500">
                    <p className="text-sm text-red-400">
                      Difference (Your Records - Portal)
                    </p>
                    <p className="text-3xl font-bold text-red-400">
                      ₹{Math.abs(gstSummary.difference).toLocaleString("en-IN")}
                    </p>
                    <p className="text-xs text-slate-400 mt-1">
                      Portal amount is higher
                    </p>
                  </div>
                  <div className="bg-slate-800/50 p-4 rounded-lg border-l-4 border-green-500">
                    <p className="text-sm text-green-400">Available ITC</p>
                    <p className="text-3xl font-bold text-green-400">
                      ₹{gstSummary.itc_available.toLocaleString("en-IN")}
                    </p>
                    <p className="text-xs text-slate-400 mt-1">
                      After reconciliation
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Invoice Reconciliation Table */}
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">
                Invoice Reconciliation Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-slate-900/50">
                    <tr>
                      <th className="px-4 py-3 text-left font-semibold text-slate-400">
                        Invoice #
                      </th>
                      <th className="px-4 py-3 text-left font-semibold text-slate-400">
                        Vendor
                      </th>
                      <th className="px-4 py-3 text-left font-semibold text-slate-400">
                        Amount
                      </th>
                      <th className="px-4 py-3 text-left font-semibold text-slate-400">
                        GST
                      </th>
                      <th className="px-4 py-3 text-left font-semibold text-slate-400">
                        Status
                      </th>
                      <th className="px-4 py-3 text-left font-semibold text-slate-400">
                        Blockchain
                      </th>
                      <th className="px-4 py-3 text-left font-semibold text-slate-400">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700">
                    {purchaseInvoices.map((invoice) => (
                      <tr key={invoice.id} className="hover:bg-slate-700/50">
                        <td className="px-4 py-3 font-medium text-white">
                          {invoice.id}
                        </td>
                        <td className="px-4 py-3 text-slate-300">
                          {invoice.vendor}
                        </td>
                        <td className="px-4 py-3 text-slate-300">
                          ₹{invoice.amount.toLocaleString("en-IN")}
                        </td>
                        <td className="px-4 py-3 text-slate-300">
                          ₹{invoice.gst.toLocaleString("en-IN")}
                          {invoice.gst_portal_amount && (
                            <div className="text-xs text-orange-400">
                              Portal: ₹
                              {invoice.gst_portal_amount.toLocaleString(
                                "en-IN"
                              )}
                            </div>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <Badge
                            variant="secondary"
                            className={getStatusColor(invoice.status)}
                          >
                            {getStatusIcon(invoice.status)}
                            <span className="ml-1 capitalize">
                              {invoice.status.replace(/_/g, " ")}
                            </span>
                          </Badge>
                        </td>
                        <td className="px-4 py-3">
                          <button
                            onClick={() =>
                              navigator.clipboard.writeText(
                                invoice.blockchain_hash
                              )
                            }
                            className="font-mono text-xs text-slate-400 hover:text-white bg-slate-900 px-2 py-1 rounded"
                            title="Click to copy blockchain hash"
                          >
                            {invoice.blockchain_hash.slice(0, 8)}...
                          </button>
                        </td>
                        <td className="px-4 py-3">
                          {invoice.status === "value_mismatch" && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-orange-500 text-orange-300 hover:bg-orange-500/20"
                            >
                              Review
                            </Button>
                          )}
                          {invoice.status === "missing_in_gstr2b" && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-blue-500 text-blue-300 hover:bg-blue-500/20"
                            >
                              Follow Up
                            </Button>
                          )}
                          {invoice.status === "matched" && (
                            <span className="text-green-400 text-sm">
                              ✓ Matched
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Action Items */}
          <Card className="bg-gradient-to-r from-orange-500/10 to-red-500/10 border-orange-500/30">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                Action Items
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-slate-800/50 rounded-lg border-l-4 border-orange-500">
                <h4 className="font-semibold text-orange-300 mb-2">
                  Value Mismatch - Invoice SW-789
                </h4>
                <p className="text-slate-300 text-sm">
                  GST amount differs by ₹200. Your records show ₹4,500 but
                  portal shows ₹4,700.
                </p>
                <Button
                  size="sm"
                  className="mt-2 bg-orange-500 hover:bg-orange-600 text-white"
                >
                  Review & Resolve
                </Button>
              </div>
              <div className="p-4 bg-slate-800/50 rounded-lg border-l-4 border-blue-500">
                <h4 className="font-semibold text-blue-300 mb-2">
                  Missing in GSTR-2B - Invoice OD-45A
                </h4>
                <p className="text-slate-300 text-sm">
                  Invoice from Office Depot is in your records but not found in
                  portal data.
                </p>
                <Button
                  size="sm"
                  className="mt-2 bg-blue-500 hover:bg-blue-600 text-white"
                >
                  Contact Vendor
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </AppLayout>
    </ProtectedRoute>
  );
}
