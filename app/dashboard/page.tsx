"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText,
  Upload,
  Bot,
  Database,
  ShieldCheck,
  Zap,
  DollarSign,
  TrendingUp,
  BarChart3,
  Receipt,
  Wallet,
  Plus,
  ExternalLink,
  CheckCircle,
  AlertCircle,
  Clock,
  FileImage,
  Eye,
  Download,
  Copy,
  LogOut,
  User,
  Settings,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useSolanaAction } from "@/hooks/useSolanaAction";
import { useIpfs } from "@/hooks/useIpfs";
import { useAuth, ProtectedRoute } from "@/contexts/AuthContext";
import Link from "next/link";

interface InvoiceData {
  id: string;
  fileName: string;
  uploadTime: string;
  status: "processing" | "completed" | "error";
  extractedData?: {
    invoice_number: string;
    vendor_name: string;
    total_amount: number;
    date: string;
  };
  ipfsHash?: string;
  solanaSignature?: string;
}

function DashboardContent() {
  const [currentView, setCurrentView] = useState<"dashboard" | "upload" | "processing" | "success">("dashboard");
  const [invoices, setInvoices] = useState<InvoiceData[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [balance, setBalance] = useState<number>(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { connected, publicKey } = useWallet();
  const { user, logout } = useAuth();
  const { sendTransaction, requestAirdrop, getBalance, isSending } = useSolanaAction();
  const { uploadFile, uploadJson, isUploading } = useIpfs();

  // Update balance when wallet connects
  const updateBalance = async () => {
    if (connected) {
      const newBalance = await getBalance();
      setBalance(newBalance);
    }
  };

  useEffect(() => {
    updateBalance();
  }, [connected]);

  // Dashboard statistics
  const dashboardStats = [
    {
      title: "Total Invoices",
      value: invoices.length.toString(),
      icon: Receipt,
      color: "text-blue-500",
      change: "+12%",
    },
    {
      title: "This Month",
      value: "₹2,45,680",
      icon: TrendingUp,
      color: "text-green-500",
      change: "+8.5%",
    },
    {
      title: "Processing Queue",
      value: invoices.filter((inv) => inv.status === "processing").length.toString(),
      icon: Clock,
      color: "text-orange-500",
      change: "0",
    },
    {
      title: "IPFS Stored",
      value: invoices.filter((inv) => inv.ipfsHash).length.toString(),
      icon: Database,
      color: "text-purple-500",
      change: "+100%",
    },
  ];

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      processInvoice(file);
    }
  };

  const processInvoice = async (file: File) => {
    setIsProcessing(true);
    setCurrentView("processing");

    const newInvoice: InvoiceData = {
      id: Date.now().toString(),
      fileName: file.name,
      uploadTime: new Date().toISOString(),
      status: "processing",
    };

    setInvoices((prev) => [...prev, newInvoice]);

    try {
      // Simulate AI processing
      await new Promise((resolve) => setTimeout(resolve, 3000));

      // Mock extracted data
      const mockExtractedData = {
        invoice_number: `INV-${Math.floor(Math.random() * 10000)}`,
        vendor_name: "Sample Vendor Ltd.",
        total_amount: Math.floor(Math.random() * 50000) + 1000,
        date: new Date().toISOString().split("T")[0],
      };

      // Upload to IPFS
      let ipfsHash: string | null = null;
      if (file) {
        ipfsHash = await uploadFile(file);
        if (ipfsHash) {
          await uploadJson(mockExtractedData);
        }
      }

      // Store on Solana blockchain
      let solanaSignature: string | null = null;
      if (connected) {
        const transactionData = JSON.stringify({
          type: "INVOICE_PROCESSED",
          fileName: file.name,
          ipfsHash: ipfsHash,
          extractedData: mockExtractedData,
          timestamp: new Date().toISOString(),
        });

        const { signature } = await sendTransaction(transactionData);
        solanaSignature = signature;
      }

      // Update invoice with results
      setInvoices((prev) =>
        prev.map((inv) =>
          inv.id === newInvoice.id
            ? {
                ...inv,
                status: "completed" as const,
                extractedData: mockExtractedData,
                ipfsHash: ipfsHash || undefined,
                solanaSignature: solanaSignature || undefined,
              }
            : inv
        )
      );

      await updateBalance();
      
      // Show success notification with links
      if (ipfsHash || solanaSignature) {
        setCurrentView("success");
        setSelectedFile(file);
        // Show success view for 10 seconds then return to dashboard
        setTimeout(() => {
          setCurrentView("dashboard");
          setSelectedFile(null);
        }, 10000);
      }
    } catch (error) {
      console.error("Processing error:", error);
      setInvoices((prev) =>
        prev.map((inv) =>
          inv.id === newInvoice.id ? { ...inv, status: "error" as const } : inv
        )
      );
    } finally {
      setIsProcessing(false);
      if (currentView !== "success") {
        setCurrentView("dashboard");
        setSelectedFile(null);
      }
    }
  };

  const handleAirdrop = async () => {
    if (!connected) return;
    
    try {
      const { signature, error } = await requestAirdrop();
      if (signature) {
        console.log("Airdrop successful:", signature);
        await updateBalance();
      } else if (error) {
        console.error("Airdrop failed:", error.message);
      }
    } catch (error) {
      console.error("Airdrop error:", error);
    }
  };

  if (currentView === "processing") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 flex items-center justify-center">
        <Card className="w-full max-w-md bg-slate-800/50 border-slate-700">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 mx-auto mb-6 relative">
              <div className="w-16 h-16 border-4 border-cyan-500/20 rounded-full" />
              <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full absolute top-0 left-0 animate-spin" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Processing Invoice</h3>
            <p className="text-slate-400 mb-4">
              AI is analyzing your document and extracting key information...
            </p>
            <div className="space-y-2 text-sm text-slate-300">
              <div className="flex items-center justify-between">
                <span>OCR Processing</span>
                <CheckCircle className="w-4 h-4 text-green-500" />
              </div>
              <div className="flex items-center justify-between">
                <span>IPFS Upload</span>
                <div className="w-4 h-4 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
              </div>
              <div className="flex items-center justify-between">
                <span>Blockchain Storage</span>
                <Clock className="w-4 h-4 text-slate-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (currentView === "success") {
    const latestInvoice = invoices[invoices.length - 1];
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 flex items-center justify-center p-6">
        <Card className="w-full max-w-2xl bg-slate-800/50 border-slate-700">
          <CardContent className="p-8">
            <div className="text-center mb-8">
              <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                <CheckCircle className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent mb-2">
                Invoice Processed Successfully!
              </h2>
              <p className="text-slate-400 text-lg">
                Your document has been analyzed, stored on IPFS, and recorded on the Solana blockchain
              </p>
            </div>

            {latestInvoice && (
              <div className="space-y-6">
                {/* Document Info */}
                <div className="bg-slate-700/30 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-cyan-400" />
                    Document Information
                  </h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-slate-400">File Name</p>
                      <p className="text-white font-medium">{latestInvoice.fileName}</p>
                    </div>
                    {latestInvoice.extractedData && (
                      <>
                        <div>
                          <p className="text-slate-400">Invoice Number</p>
                          <p className="text-white font-medium">{latestInvoice.extractedData.invoice_number}</p>
                        </div>
                        <div>
                          <p className="text-slate-400">Vendor</p>
                          <p className="text-white font-medium">{latestInvoice.extractedData.vendor_name}</p>
                        </div>
                        <div>
                          <p className="text-slate-400">Amount</p>
                          <p className="text-green-400 font-bold text-lg">
                            ₹{latestInvoice.extractedData.total_amount.toLocaleString()}
                          </p>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* IPFS Links */}
                {latestInvoice.ipfsHash && (
                  <div className="bg-slate-700/30 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                      <Database className="w-5 h-5 text-purple-400" />
                      IPFS Storage
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between bg-slate-800/50 rounded-lg p-3">
                        <div>
                          <p className="text-slate-400 text-sm">IPFS Hash</p>
                          <p className="text-white font-mono text-sm">{latestInvoice.ipfsHash}</p>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-slate-600 text-slate-300"
                            onClick={() => navigator.clipboard.writeText(latestInvoice.ipfsHash!)}
                          >
                            <Copy className="w-3 h-3" />
                          </Button>
                          <Button
                            size="sm"
                            className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700"
                            onClick={() => window.open(`https://gateway.pinata.cloud/ipfs/${latestInvoice.ipfsHash}`, '_blank')}
                          >
                            <ExternalLink className="w-3 h-3 mr-1" />
                            View
                          </Button>
                        </div>
                      </div>
                      <div className="flex items-center justify-between bg-slate-800/50 rounded-lg p-3">
                        <div>
                          <p className="text-slate-400 text-sm">Pinata Gateway</p>
                          <p className="text-white text-sm">Decentralized file access</p>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-slate-600 text-slate-300"
                          onClick={() => window.open(`https://app.pinata.cloud/pinmanager`, '_blank')}
                        >
                          <ExternalLink className="w-3 h-3 mr-1" />
                          Pinata
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Solana Transaction */}
                {latestInvoice.solanaSignature && (
                  <div className="bg-slate-700/30 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                      <ShieldCheck className="w-5 h-5 text-green-400" />
                      Blockchain Verification
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between bg-slate-800/50 rounded-lg p-3">
                        <div>
                          <p className="text-slate-400 text-sm">Transaction Signature</p>
                          <p className="text-white font-mono text-sm">{latestInvoice.solanaSignature}</p>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-slate-600 text-slate-300"
                            onClick={() => navigator.clipboard.writeText(latestInvoice.solanaSignature!)}
                          >
                            <Copy className="w-3 h-3" />
                          </Button>
                          <Button
                            size="sm"
                            className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
                            onClick={() => window.open(`https://solscan.io/tx/${latestInvoice.solanaSignature}?cluster=devnet`, '_blank')}
                          >
                            <ExternalLink className="w-3 h-3 mr-1" />
                            Solscan
                          </Button>
                        </div>
                      </div>
                      <div className="flex items-center justify-between bg-slate-800/50 rounded-lg p-3">
                        <div>
                          <p className="text-slate-400 text-sm">Solana Explorer</p>
                          <p className="text-white text-sm">View transaction details</p>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-slate-600 text-slate-300"
                          onClick={() => window.open(`https://explorer.solana.com/tx/${latestInvoice.solanaSignature}?cluster=devnet`, '_blank')}
                        >
                          <ExternalLink className="w-3 h-3 mr-1" />
                          Explorer
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-4 pt-4">
                  <Button
                    onClick={() => setCurrentView("dashboard")}
                    className="flex-1 bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600"
                  >
                    Back to Dashboard
                  </Button>
                  <Button
                    onClick={() => fileInputRef.current?.click()}
                    variant="outline"
                    className="flex-1 border-slate-600 text-slate-300"
                  >
                    Process Another Invoice
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full relative bg-black">
      {/* Pearl Mist Background with Top Glow */}
      <div
        className="absolute inset-0 w-full h-full"
        style={{
          background: `
            radial-gradient(ellipse 80% 50% at 20% -20%, rgba(120, 119, 198, 0.3), transparent),
            radial-gradient(ellipse 60% 50% at 80% -10%, rgba(255, 154, 158, 0.3), transparent),
            radial-gradient(ellipse 60% 50% at 40% 10%, rgba(139, 92, 246, 0.3), transparent),
            black
          `,
        }}
      />
      
      {/* Content */}
      <div className="relative z-10 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent mb-2">
                Welcome back, {user?.name}!
              </h1>
              <p className="text-gray-400 text-lg">
                Blockchain-powered financial document management with AI analysis
              </p>
            </div>
            <div className="flex items-center gap-4">
              {/* User Profile Section */}
              <div className="flex items-center gap-3 bg-zinc-900/50 backdrop-blur-sm border border-zinc-800 rounded-xl px-4 py-2">
                <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
                <div className="text-sm">
                  <p className="text-white font-medium">{user?.name}</p>
                  <p className="text-gray-400 capitalize">{user?.plan} Plan</p>
                </div>
                <Button
                  onClick={logout}
                  variant="ghost"
                  size="sm"
                  className="text-gray-400 hover:text-white hover:bg-zinc-800"
                >
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>
              
              <Link href="/ai">
                <Button className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white border-0 shadow-lg">
                  <Bot className="w-4 h-4 mr-2" />
                  AI Assistant
                </Button>
              </Link>
            </div>
          </div>

          {/* Wallet Section */}
          <Card className="bg-black/40 border border-gray-800/50 backdrop-blur-xl mb-8 shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-500 flex items-center justify-center">
                    <Wallet className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white">Solana Wallet</h3>
                    {connected ? (
                      <div className="space-y-1">
                        <p className="text-sm text-gray-400 font-mono">
                          {publicKey?.toBase58().slice(0, 8)}...{publicKey?.toBase58().slice(-8)}
                        </p>
                        <p className="text-sm font-medium text-green-400">
                          Balance: {balance.toFixed(4)} SOL
                        </p>
                      </div>
                    ) : (
                      <p className="text-sm text-gray-400">Connect your wallet to get started</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {connected && balance < 0.1 && (
                    <Button
                      onClick={handleAirdrop}
                      disabled={isSending}
                      variant="outline"
                      className="border-gray-700 text-gray-300 hover:bg-gray-800 bg-black/20 backdrop-blur-sm"
                    >
                      {isSending ? "Requesting..." : "Request Airdrop"}
                    </Button>
                  )}
                  <WalletMultiButton className="!bg-gradient-to-r !from-cyan-500 !to-purple-500 hover:!from-cyan-600 hover:!to-purple-600 !border-0 !rounded-lg !shadow-lg" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Statistics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {dashboardStats.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <Card key={index} className="bg-black/40 border border-gray-800/50 backdrop-blur-xl shadow-xl hover:bg-black/50 transition-all duration-300">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-gray-300">
                      {stat.title}
                    </CardTitle>
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-gray-800 to-gray-700 flex items-center justify-center">
                      <IconComponent className={`h-4 w-4 ${stat.color}`} />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-white">{stat.value}</div>
                    <p className="text-xs text-green-400">{stat.change} from last month</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Quick Actions */}
            <Card className="bg-black/40 border border-gray-800/50 backdrop-blur-xl shadow-xl">
              <CardHeader>
                <CardTitle className="text-xl text-white flex items-center gap-2">
                  <Zap className="w-5 h-5 text-cyan-400" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading || isProcessing}
                  className="w-full h-16 bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 flex items-center gap-3 border-0 shadow-lg"
                >
                  {isUploading ? (
                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Upload className="w-6 h-6" />
                  )}
                  <span className="text-lg font-semibold">Upload Invoice</span>
                </Button>
                
                <Link href="/ai">
                  <Button
                    variant="outline"
                    className="w-full h-16 border-gray-700 text-gray-300 hover:bg-gray-800 bg-black/20 backdrop-blur-sm flex items-center gap-3"
                  >
                    <Bot className="w-6 h-6 text-orange-400" />
                    <span className="text-lg">Ask AI Assistant</span>
                  </Button>
                </Link>
                
                <Button
                  variant="outline"
                  className="w-full h-12 border-gray-700 text-gray-300 hover:bg-gray-800 bg-black/20 backdrop-blur-sm flex items-center gap-3"
                >
                  <BarChart3 className="w-5 h-5 text-green-400" />
                  <span>Generate Reports</span>
                </Button>
              </CardContent>
            </Card>

            {/* Recent Invoices */}
            <Card className="lg:col-span-2 bg-black/40 border border-gray-800/50 backdrop-blur-xl shadow-xl">
              <CardHeader>
                <CardTitle className="text-xl text-white flex items-center gap-2">
                  <Receipt className="w-5 h-5 text-purple-400" />
                  Recent Invoices
                </CardTitle>
              </CardHeader>
              <CardContent>
                {invoices.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-gray-800 to-gray-700 rounded-full flex items-center justify-center">
                      <FileText className="w-10 h-10 text-gray-500" />
                    </div>
                    <p className="text-gray-400 text-lg mb-2">No invoices processed yet</p>
                    <p className="text-sm text-gray-500">Upload your first invoice to get started with AI-powered analysis</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {invoices.slice(0, 5).map((invoice) => (
                      <div
                        key={invoice.id}
                        className="flex items-center justify-between p-4 bg-black/30 border border-gray-800/30 rounded-lg hover:bg-black/50 transition-all duration-300"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-gradient-to-r from-gray-800 to-gray-700 rounded-lg flex items-center justify-center">
                            <FileText className="w-6 h-6 text-gray-400" />
                          </div>
                          <div>
                            <p className="font-medium text-white">{invoice.fileName}</p>
                            <p className="text-sm text-gray-400">
                              {new Date(invoice.uploadTime).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-3">
                          <Badge
                            variant={
                              invoice.status === "completed"
                                ? "default"
                                : invoice.status === "processing"
                                ? "secondary"
                                : "destructive"
                            }
                            className={
                              invoice.status === "completed"
                                ? "bg-green-600 text-white border-0"
                                : invoice.status === "processing"
                                ? "bg-orange-600 text-white border-0"
                                : "bg-red-600 text-white border-0"
                            }
                          >
                            {invoice.status}
                          </Badge>
                          
                          {invoice.extractedData && (
                            <div className="text-right">
                              <p className="text-sm font-medium text-white">
                                ₹{invoice.extractedData.total_amount.toLocaleString()}
                              </p>
                              <p className="text-xs text-gray-400">
                                {invoice.extractedData.vendor_name}
                              </p>
                            </div>
                          )}
                          
                          {invoice.ipfsHash && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-gray-700 text-gray-300 hover:bg-gray-800 bg-black/20 backdrop-blur-sm"
                              onClick={() => {
                                navigator.clipboard.writeText(
                                  `https://gateway.pinata.cloud/ipfs/${invoice.ipfsHash}`
                                );
                              }}
                            >
                              <Copy className="w-3 h-3" />
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.jpg,.jpeg,.png,.gif,.doc,.docx,.txt"
        className="hidden"
        onChange={handleFileSelect}
      />
    </div>
  );
}

export default function Dashboard() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}
