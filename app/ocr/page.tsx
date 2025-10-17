"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Camera,
  FileText,
  Upload,
  Clock,
  CheckCircle,
  AlertCircle,
  BarChart3,
  History,
  Eye,
  Download,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth, ProtectedRoute } from "@/contexts/AuthContext";
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar";
import { FileUpload } from "@/components/ui/file-upload";
import { useSearchParams } from "next/navigation";

interface ProcessingItem {
  id: string;
  fileName: string;
  status: "processing" | "completed" | "error";
  uploadTime: string;
  progress: number;
  extractedData?: any;
}

function OCRContent() {
  const searchParams = useSearchParams();
  const activeTab = searchParams.get("tab") || "upload";
  
  const [processingQueue, setProcessingQueue] = useState<ProcessingItem[]>([
    {
      id: "1",
      fileName: "invoice_001.pdf",
      status: "processing",
      uploadTime: "2025-10-09T10:30:00Z",
      progress: 65,
    },
    {
      id: "2", 
      fileName: "receipt_002.jpg",
      status: "completed",
      uploadTime: "2025-10-09T09:15:00Z",
      progress: 100,
      extractedData: {
        invoice_number: "INV-2025-001",
        vendor_name: "Tech Solutions Ltd",
        total_amount: 15000,
        date: "2025-10-08",
      },
    },
  ]);

  const [stats, setStats] = useState({
    totalProcessed: 1247,
    processingToday: 34,
    successRate: 98.5,
    avgProcessingTime: "2.3s",
  });

  const handleFilesFromUpload = (newFiles: File[]) => {
    newFiles.forEach((file) => {
      const newItem: ProcessingItem = {
        id: Date.now().toString() + Math.random(),
        fileName: file.name,
        status: "processing",
        uploadTime: new Date().toISOString(),
        progress: 0,
      };
      setProcessingQueue(prev => [newItem, ...prev]);
      
      // Simulate processing
      simulateProcessing(newItem.id);
    });
  };

  const simulateProcessing = (id: string) => {
    const interval = setInterval(() => {
      setProcessingQueue(prev => 
        prev.map(item => {
          if (item.id === id) {
            const newProgress = Math.min(item.progress + 10, 100);
            return {
              ...item,
              progress: newProgress,
              status: newProgress === 100 ? "completed" : "processing",
            };
          }
          return item;
        })
      );
    }, 500);

    setTimeout(() => clearInterval(interval), 5000);
  };

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              
              {/* Header */}
              <div className="px-4 lg:px-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-3xl font-bold text-white">OCR Processing</h1>
                    <p className="text-gray-400 text-lg">
                      AI-powered document analysis and data extraction
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <Card className="bg-black/40 border-gray-800/50">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                          <Camera className="w-8 h-8 text-blue-400" />
                          <div>
                            <p className="text-sm text-gray-400">Processing Rate</p>
                            <p className="text-xl font-bold text-white">{stats.successRate}%</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>

              {/* Stats Cards */}
              <div className="px-4 lg:px-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <Card className="bg-black/40 border-gray-800/50">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-400">Total Processed</p>
                          <p className="text-2xl font-bold text-white">{stats.totalProcessed}</p>
                        </div>
                        <FileText className="w-8 h-8 text-green-400" />
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-black/40 border-gray-800/50">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-400">Today</p>
                          <p className="text-2xl font-bold text-white">{stats.processingToday}</p>
                        </div>
                        <Clock className="w-8 h-8 text-blue-400" />
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-black/40 border-gray-800/50">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-400">Success Rate</p>
                          <p className="text-2xl font-bold text-white">{stats.successRate}%</p>
                        </div>
                        <CheckCircle className="w-8 h-8 text-green-400" />
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-black/40 border-gray-800/50">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-400">Avg Time</p>
                          <p className="text-2xl font-bold text-white">{stats.avgProcessingTime}</p>
                        </div>
                        <BarChart3 className="w-8 h-8 text-purple-400" />
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Main Content with Tabs */}
              <div className="px-4 lg:px-6">
                <Tabs value={activeTab} className="w-full">
                  <TabsList className="grid w-full grid-cols-4 bg-black/40 border-gray-800/50">
                    <TabsTrigger value="upload" className="data-[state=active]:bg-blue-600">
                      <Upload className="w-4 h-4 mr-2" />
                      Upload
                    </TabsTrigger>
                    <TabsTrigger value="queue" className="data-[state=active]:bg-blue-600">
                      <Clock className="w-4 h-4 mr-2" />
                      Queue
                    </TabsTrigger>
                    <TabsTrigger value="analytics" className="data-[state=active]:bg-blue-600">
                      <BarChart3 className="w-4 h-4 mr-2" />
                      Analytics
                    </TabsTrigger>
                    <TabsTrigger value="history" className="data-[state=active]:bg-blue-600">
                      <History className="w-4 h-4 mr-2" />
                      History
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="upload" className="mt-6">
                    <Card className="bg-black/40 border-gray-800/50">
                      <CardHeader>
                        <CardTitle className="text-white flex items-center gap-2">
                          <Upload className="w-5 h-5" />
                          Document Upload
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="w-full min-h-48 border border-dashed bg-white dark:bg-black border-neutral-200 dark:border-neutral-800 rounded-lg">
                          <FileUpload onChange={handleFilesFromUpload} />
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="queue" className="mt-6">
                    <Card className="bg-black/40 border-gray-800/50">
                      <CardHeader>
                        <CardTitle className="text-white">Processing Queue</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {processingQueue.map((item) => (
                            <div key={item.id} className="flex items-center justify-between p-4 bg-gray-900/50 rounded-lg border border-gray-800/50">
                              <div className="flex items-center gap-3">
                                <FileText className="w-8 h-8 text-blue-400" />
                                <div>
                                  <p className="font-medium text-white">{item.fileName}</p>
                                  <p className="text-sm text-gray-400">
                                    {new Date(item.uploadTime).toLocaleString()}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center gap-4">
                                <div className="w-32">
                                  <div className="flex items-center justify-between mb-1">
                                    <span className="text-xs text-gray-400">Progress</span>
                                    <span className="text-xs text-gray-400">{item.progress}%</span>
                                  </div>
                                  <div className="w-full bg-gray-700 rounded-full h-2">
                                    <div 
                                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                      style={{ width: `${item.progress}%` }}
                                    />
                                  </div>
                                </div>
                                <Badge variant={
                                  item.status === "completed" ? "default" :
                                  item.status === "processing" ? "secondary" : "destructive"
                                }>
                                  {item.status === "completed" && <CheckCircle className="w-3 h-3 mr-1" />}
                                  {item.status === "processing" && <Clock className="w-3 h-3 mr-1" />}
                                  {item.status === "error" && <AlertCircle className="w-3 h-3 mr-1" />}
                                  {item.status}
                                </Badge>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="analytics" className="mt-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <Card className="bg-black/40 border-gray-800/50">
                        <CardHeader>
                          <CardTitle className="text-white">Processing Analytics</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            <div>
                              <p className="text-sm text-gray-400">Documents Processed (This Month)</p>
                              <p className="text-3xl font-bold text-white">2,847</p>
                              <p className="text-sm text-green-400">+15.3% from last month</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-400">Average Processing Time</p>
                              <p className="text-3xl font-bold text-white">2.3s</p>
                              <p className="text-sm text-green-400">-0.5s improvement</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                      
                      <Card className="bg-black/40 border-gray-800/50">
                        <CardHeader>
                          <CardTitle className="text-white">Document Types</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <span className="text-gray-300">Invoices</span>
                              <span className="text-white font-medium">65%</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-gray-300">Receipts</span>
                              <span className="text-white font-medium">25%</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-gray-300">Bills</span>
                              <span className="text-white font-medium">10%</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>

                  <TabsContent value="history" className="mt-6">
                    <Card className="bg-black/40 border-gray-800/50">
                      <CardHeader>
                        <CardTitle className="text-white">Processing History</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {processingQueue.filter(item => item.status === "completed").map((item) => (
                            <div key={item.id} className="flex items-center justify-between p-4 bg-gray-900/50 rounded-lg border border-gray-800/50">
                              <div className="flex items-center gap-3">
                                <CheckCircle className="w-6 h-6 text-green-400" />
                                <div>
                                  <p className="font-medium text-white">{item.fileName}</p>
                                  <p className="text-sm text-gray-400">
                                    Processed: {new Date(item.uploadTime).toLocaleString()}
                                  </p>
                                  {item.extractedData && (
                                    <p className="text-sm text-blue-400">
                                      {item.extractedData.invoice_number} - {item.extractedData.vendor_name}
                                    </p>
                                  )}
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <Button size="sm" variant="outline" className="border-gray-600 text-gray-300">
                                  <Eye className="w-4 h-4 mr-1" />
                                  View
                                </Button>
                                <Button size="sm" variant="outline" className="border-gray-600 text-gray-300">
                                  <Download className="w-4 h-4 mr-1" />
                                  Export
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

export default function OCRPage() {
  return (
    <ProtectedRoute>
      <OCRContent />
    </ProtectedRoute>
  );
}