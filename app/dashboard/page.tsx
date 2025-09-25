"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GoogleGeminiEffect } from "@/components/ui/google-gemini-effect";
import { useMotionValue } from "motion/react";
import { animate, type AnimationPlaybackControls } from "motion";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useSolanaAction } from "@/hooks/useSolanaAction";
import { useIpfsWithFallback as useIpfs } from "@/hooks/useIpfsFallback";
import { useAuth, ProtectedRoute } from "@/contexts/AuthContext";
import AppLayout from "@/components/AppLayout";
import TransactionResult from "@/components/TransactionResult";
import Link from "next/link";
import { useStorage } from "@/contexts/StorageContext";
import { IPFSLinks } from "@/components/IPFSLinks";
import { FileUpload } from "@/components/ui/file-upload";
import AppNavigation from "@/components/AppNavigation";

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
  const [currentView, setCurrentView] = useState<
    "dashboard" | "upload" | "processing" | "review" | "success"
  >("dashboard");
  const [invoices, setInvoices] = useState<InvoiceData[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [balance, setBalance] = useState<number>(0);
  const [showTransactionResult, setShowTransactionResult] = useState(false);
  const [lastProcessedInvoice, setLastProcessedInvoice] = useState<any>(null);
  // Test transaction state
  const [testTxSignature, setTestTxSignature] = useState<string | null>(null);
  const [testTxError, setTestTxError] = useState<string | null>(null);

  // Review + storage selections
  const [pendingExtracted, setPendingExtracted] = useState<{
    invoice_number: string;
    vendor_name: string;
    total_amount: number;
    date: string;
  } | null>(null);
  const [pendingInvoiceId, setPendingInvoiceId] = useState<string | null>(null);
  const [storeOnIpfs, setStoreOnIpfs] = useState(false);
  const [storeOnChain, setStoreOnChain] = useState(false);
  const [isStoring, setIsStoring] = useState(false);

  const { connected, publicKey } = useWallet();
  const { user, logout } = useAuth();
  const { sendTransaction, requestAirdrop, getBalance, isSending } =
    useSolanaAction();
  const { uploadFile, uploadJson, isUploading } = useIpfs();
  const { lastCid, lastSignature, lastUpdated, setLastCid, setLastSignature } =
    useStorage();

  // Transaction visual overlay state (plays while a on-chain tx is sending)
  const v1 = useMotionValue(0);
  const v2 = useMotionValue(0);
  const v3 = useMotionValue(0);
  const v4 = useMotionValue(0);
  const v5 = useMotionValue(0);
  const animRefs = React.useRef<AnimationPlaybackControls[]>([]);

  useEffect(() => {
    const stopAll = () => {
      animRefs.current.forEach((ctrl) => ctrl?.stop?.());
      animRefs.current = [];
    };
    if (isSending) {
      [v1, v2, v3, v4, v5].forEach((mv) => mv.set(0));
      const values = [v1, v2, v3, v4, v5];
      const ctrls = values.map((mv, i) =>
        animate(mv, 1, {
          duration: 1.2,
          delay: i * 0.12,
          ease: "linear",
          repeat: Infinity,
          repeatType: "reverse",
          repeatDelay: 0.2,
        })
      );
      animRefs.current = ctrls;
    } else {
      stopAll();
      [v1, v2, v3, v4, v5].forEach((mv) => mv.set(0));
    }
    return () => {
      animRefs.current.forEach((ctrl) => ctrl?.stop?.());
      animRefs.current = [];
    };
  }, [isSending]);

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

  // Build a Solscan link for a given signature
  const buildSolscanUrl = (sig: string) => {
    const cluster = process.env.NEXT_PUBLIC_SOLANA_CLUSTER || "devnet";
    const base = "https://solscan.io/tx";
    return cluster === "mainnet" || cluster === "mainnet-beta"
      ? `${base}/${sig}`
      : `${base}/${sig}?cluster=${cluster}`;
  };

  // Build additional explorer links
  const buildExplorerUrls = (sig: string) => {
    const cluster = process.env.NEXT_PUBLIC_SOLANA_CLUSTER || "devnet";
    const isMainnet = cluster === "mainnet" || cluster === "mainnet-beta";
    return [
      {
        name: "Solscan",
        url: isMainnet
          ? `https://solscan.io/tx/${sig}`
          : `https://solscan.io/tx/${sig}?cluster=${cluster}`,
      },
      {
        name: "Solana Explorer",
        url: isMainnet
          ? `https://explorer.solana.com/tx/${sig}`
          : `https://explorer.solana.com/tx/${sig}?cluster=${cluster}`,
      },
    ];
  };

  // Build IPFS gateway URLs
  const buildGatewayUrls = (hash: string) => [
    { name: "Cloudflare", url: `https://cloudflare-ipfs.com/ipfs/${hash}` },
    { name: "IPFS.io", url: `https://ipfs.io/ipfs/${hash}` },
    { name: "dweb.link", url: `https://dweb.link/ipfs/${hash}` },
  ];

  // Dashboard statistics
  const dashboardStats = [
    {
      title: "Total Invoices",
      value: invoices.length.toString(),
      icon: Receipt,
      color: "text-gray-300",
      change: "+12%",
    },
    {
      title: "This Month",
      value: "₹2,45,680",
      icon: TrendingUp,
      color: "text-gray-300",
      change: "+8.5%",
    },
    {
      title: "Processing Queue",
      value: invoices
        .filter((inv) => inv.status === "processing")
        .length.toString(),
      icon: Clock,
      color: "text-gray-300",
      change: "0",
    },
    {
      title: "IPFS Stored",
      value: invoices.filter((inv) => inv.ipfsHash).length.toString(),
      icon: Database,
      color: "text-gray-300",
      change: "+100%",
    },
  ];

  const handleFilesFromUpload = (newFiles: File[]) => {
    const file = newFiles?.[0];
    if (!file) return;
    setSelectedFile(file);
    processInvoice(file);
  };

  // Sends a minimal memo-only transaction to verify wallet and network
  const handleTestTransaction = async () => {
    try {
      setTestTxSignature(null);
      setTestTxError(null);
      const memo = JSON.stringify({
        type: "TEST_TRANSACTION",
        timestamp: new Date().toISOString(),
      });
      const { signature, error } = await sendTransaction(memo);
      if (error) {
        setTestTxError(error.message);
        return;
      }
      if (signature) {
        setTestTxSignature(signature);
        setLastSignature(signature);
        // Refresh balance after a tx to reflect fee changes
        updateBalance();
      }
    } catch (err) {
      setTestTxError((err as Error).message);
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

      // Prepare review step
      setPendingExtracted(mockExtractedData);
      setPendingInvoiceId(newInvoice.id);
      setSelectedFile(file);
      setStoreOnIpfs(false);
      setStoreOnChain(false);
      setCurrentView("review");
    } catch (error) {
      console.error("Processing error:", error);
      setInvoices((prev) =>
        prev.map((inv) =>
          inv.id === newInvoice.id ? { ...inv, status: "error" as const } : inv
        )
      );
    } finally {
      setIsProcessing(false);
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

  // Store selections after review
  const handleStoreSelected = async () => {
    if (!selectedFile || !pendingExtracted || !pendingInvoiceId) return;
    setIsStoring(true);
    let ipfsHash: string | undefined;
    let solanaSignature: string | undefined;
    try {
      if (storeOnIpfs) {
        const hash = await uploadFile(selectedFile);
        ipfsHash = hash || undefined;
        if (hash) {
          setLastCid(hash);
          await uploadJson(pendingExtracted);
        }
      }

      if (storeOnChain && connected) {
        const payload = JSON.stringify({
          type: "INVOICE_PROCESSED",
          fileName: selectedFile.name,
          ipfsHash,
          extractedData: pendingExtracted,
          timestamp: new Date().toISOString(),
        });
        const { signature } = await sendTransaction(payload);
        solanaSignature = signature || undefined;
        if (signature) setLastSignature(signature);
      }

      setInvoices((prev) =>
        prev.map((inv) =>
          inv.id === pendingInvoiceId
            ? {
                ...inv,
                status: "completed" as const,
                extractedData: pendingExtracted,
                ipfsHash,
                solanaSignature,
              }
            : inv
        )
      );

      await updateBalance();

      if (storeOnIpfs || storeOnChain) {
        setLastProcessedInvoice({
          fileName: selectedFile.name,
          extractedData: pendingExtracted,
          ipfsHash,
          solanaSignature,
        });
        setShowTransactionResult(true);
      }

      setCurrentView("dashboard");
      setSelectedFile(null);
      setPendingExtracted(null);
      setPendingInvoiceId(null);
      setStoreOnIpfs(false);
      setStoreOnChain(false);
    } catch (e) {
      console.error("Storage selection error:", e);
    } finally {
      setIsStoring(false);
    }
  };

  if (currentView === "processing") {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Card className="w-full max-w-md bg-slate-800/50 border-slate-700">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 mx-auto mb-6 relative">
              <div className="w-16 h-16 border-4 border-cyan-500/20 rounded-full" />
              <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full absolute top-0 left-0 animate-spin" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              Processing Invoice
            </h3>
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
      <div className="min-h-screen bg-black flex items-center justify-center p-6">
        <Card className="w-full max-w-2xl bg-slate-800/50 border-slate-700">
          <CardContent className="p-8">
            <div className="text-center mb-8">
              <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-gray-500 to-gray-300 rounded-full flex items-center justify-center">
                <CheckCircle className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-white mb-2">
                Invoice Processed Successfully!
              </h2>
              <p className="text-slate-400 text-lg">
                Your document has been analyzed, stored on IPFS, and recorded on
                the Solana blockchain
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
                      <p className="text-white font-medium">
                        {latestInvoice.fileName}
                      </p>
                    </div>
                    {latestInvoice.extractedData && (
                      <>
                        <div>
                          <p className="text-slate-400">Invoice Number</p>
                          <p className="text-white font-medium">
                            {latestInvoice.extractedData.invoice_number}
                          </p>
                        </div>
                        <div>
                          <p className="text-slate-400">Vendor</p>
                          <p className="text-white font-medium">
                            {latestInvoice.extractedData.vendor_name}
                          </p>
                        </div>
                        <div>
                          <p className="text-slate-400">Amount</p>
                          <p className="text-green-400 font-bold text-lg">
                            ₹
                            {latestInvoice.extractedData.total_amount.toLocaleString()}
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
                      <Database className="w-5 h-5 text-gray-300" />
                      IPFS Storage
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between bg-slate-800/50 rounded-lg p-3">
                        <div>
                          <p className="text-slate-400 text-sm">IPFS Hash</p>
                          <p className="text-white font-mono text-sm">
                            {latestInvoice.ipfsHash}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-slate-600 text-slate-300"
                            onClick={() =>
                              navigator.clipboard.writeText(
                                latestInvoice.ipfsHash!
                              )
                            }
                          >
                            <Copy className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                      <IPFSLinks cid={latestInvoice.ipfsHash} />
                      <div className="flex items-center justify-between bg-slate-800/50 rounded-lg p-3">
                        <div>
                          <p className="text-slate-400 text-sm">
                            Pinata Gateway
                          </p>
                          <p className="text-white text-sm">
                            Decentralized file access
                          </p>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-slate-600 text-slate-300"
                          onClick={() =>
                            window.open(
                              `https://app.pinata.cloud/pinmanager`,
                              "_blank"
                            )
                          }
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
                      <ShieldCheck className="w-5 h-5 text-gray-300" />
                      Blockchain Verification
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between bg-slate-800/50 rounded-lg p-3">
                        <div>
                          <p className="text-slate-400 text-sm">
                            Transaction Signature
                          </p>
                          <p className="text-white font-mono text-sm">
                            {latestInvoice.solanaSignature}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-slate-600 text-slate-300"
                            onClick={() =>
                              navigator.clipboard.writeText(
                                latestInvoice.solanaSignature!
                              )
                            }
                          >
                            <Copy className="w-3 h-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-slate-600 text-slate-200 hover:bg-white/5"
                            onClick={() => {
                              const cluster =
                                process.env.NEXT_PUBLIC_SOLANA_CLUSTER ||
                                "devnet";
                              const base = "https://solscan.io/tx";
                              const url =
                                cluster === "mainnet" ||
                                cluster === "mainnet-beta"
                                  ? `${base}/${latestInvoice.solanaSignature}`
                                  : `${base}/${latestInvoice.solanaSignature}?cluster=${cluster}`;
                              window.open(url, "_blank");
                            }}
                          >
                            <ExternalLink className="w-3 h-3 mr-1" />
                            Solscan
                          </Button>
                        </div>
                      </div>
                      <div className="flex items-center justify-between bg-slate-800/50 rounded-lg p-3">
                        <div>
                          <p className="text-slate-400 text-sm">
                            Solana Explorer
                          </p>
                          <p className="text-white text-sm">
                            View transaction details
                          </p>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-slate-600 text-slate-300"
                          onClick={() => {
                            const cluster =
                              process.env.NEXT_PUBLIC_SOLANA_CLUSTER ||
                              "devnet";
                            const base = "https://explorer.solana.com/tx";
                            const url =
                              cluster === "mainnet" ||
                              cluster === "mainnet-beta"
                                ? `${base}/${latestInvoice.solanaSignature}`
                                : `${base}/${latestInvoice.solanaSignature}?cluster=${cluster}`;
                            window.open(url, "_blank");
                          }}
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
                    onClick={() => {
                      setCurrentView("dashboard");
                      setTimeout(
                        () =>
                          document
                            .getElementById("quick-actions")
                            ?.scrollIntoView({
                              behavior: "smooth",
                              block: "start",
                            }),
                        0
                      );
                    }}
                    className="flex-1 btn-metallic shine"
                  >
                    Back to Dashboard
                  </Button>
                  {/* The upload component is now on the dashboard Quick Actions */}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full relative app-ambient">
      <AppNavigation currentPage="/dashboard" />
      {/* Transaction animation overlay */}
      {isSending && (
        <div className="fixed inset-0 z-[9999] pointer-events-none bg-black/50 backdrop-blur-md">
          <div className="relative h-full w-full">
            <GoogleGeminiEffect
              className="top-24"
              pathLengths={[v1, v2, v3, v4, v5]}
              title="Submitting transaction…"
              description="Securing your data on-chain"
              palette={["#63d2ff", "#5ef1ff", "#9ab6ff", "#5aa8ff", "#2f6bff"]}
              blurStdDev={12}
              showBadge={false}
            />
          </div>
        </div>
      )}
      {/* Pearl Mist Background with Top Glow */}
      <div
        className="absolute inset-0 w-full h-full"
        style={{
          background: `
            radial-gradient(ellipse 80% 50% at 20% -20%, rgba(200, 200, 220, 0.15), transparent),
            radial-gradient(ellipse 60% 50% at 80% -10%, rgba(180, 180, 190, 0.12), transparent),
            radial-gradient(ellipse 60% 50% at 40% 10%, rgba(220, 220, 230, 0.08), transparent),
            black
          `,
        }}
      />

      {/* Content */}
      <div className="relative z-10 p-6 pt-20">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div className="min-w-0">
              <h1 className="display-1 mt-0 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-blue-300 to-blue-200 blue-glow-text font-geist mb-2 whitespace-nowrap">
                Welcome back, {user?.name}!
              </h1>
              <p className="text-gray-400 text-lg md:text-xl font-geist">
                Blockchain-powered financial document management with AI
                analysis
              </p>
            </div>
            <div className="flex items-center gap-3 sm:gap-4 self-center">
              {/* User Profile Section */}
              <div className="flex items-center gap-3 bg-zinc-900/50 backdrop-blur-sm border border-zinc-800 rounded-xl px-4 py-2">
                <div className="w-8 h-8 bg-gradient-to-r from-gray-700 to-gray-500 rounded-full flex items-center justify-center">
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
                <Button className="btn-metallic shine text-black border-0 shadow-lg h-10">
                  <Bot className="w-4 h-4 mr-2" />
                  AI Assistant
                </Button>
              </Link>
            </div>
          </div>

          {/* Wallet Section */}
          <Card className="card-glow mb-8 shadow-xl rounded-3xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-gray-800 to-gray-700 flex items-center justify-center">
                    <Wallet className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white">
                      Solana Wallet
                    </h3>
                    {connected ? (
                      <div className="space-y-1">
                        <p className="text-sm text-gray-400 font-mono">
                          {publicKey?.toBase58().slice(0, 8)}...
                          {publicKey?.toBase58().slice(-8)}
                        </p>
                        <p className="text-sm font-medium text-gray-200">
                          Balance: {balance.toFixed(4)} SOL
                        </p>
                      </div>
                    ) : (
                      <p className="text-sm text-gray-400">
                        Connect your wallet to get started
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2 sm:gap-3">
                  {connected && balance < 0.1 && (
                    <Button
                      onClick={handleAirdrop}
                      disabled={isSending}
                      variant="outline"
                      className="h-10 border-gray-700 text-gray-300 hover:bg-gray-800 bg-black/20 backdrop-blur-sm"
                    >
                      {isSending ? "Requesting..." : "Request Airdrop"}
                    </Button>
                  )}
                  {connected && (
                    <Button
                      onClick={handleTestTransaction}
                      disabled={isSending}
                      variant="outline"
                      className="h-10 border-gray-700 text-gray-300 hover:bg-gray-800 bg-black/20 backdrop-blur-sm"
                      title="Send a memo-only transaction to verify setup"
                    >
                      {isSending ? "Sending..." : "Test Transaction"}
                    </Button>
                  )}
                  <WalletMultiButton className="!btn-metallic !shine !border-0 !rounded-lg !shadow-lg !text-black !h-10" />
                </div>
              </div>
            </CardContent>
          </Card>

          {testTxSignature && (
            <Card className="bg-black/40 border border-gray-800/50 backdrop-blur-xl mb-8 shadow-xl">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-white">
                      Test Transaction Sent
                    </h3>
                    <p className="text-sm text-gray-400 break-all">
                      Signature: {testTxSignature}
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    className="border-gray-700 text-gray-300 hover:bg-gray-800 bg-black/20"
                    onClick={() =>
                      window.open(buildSolscanUrl(testTxSignature), "_blank")
                    }
                  >
                    View on Solscan
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {testTxError && (
            <Card className="bg-black/40 border border-gray-800/50 backdrop-blur-xl mb-8 shadow-xl">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-white mb-1">
                  Test Transaction Failed
                </h3>
                <p className="text-sm text-red-400">{testTxError}</p>
              </CardContent>
            </Card>
          )}

          {/* Persistent Latest Storage highlight from store */}
          {(lastCid || lastSignature) && (
            <Card className="card-glow mb-8 shadow-xl rounded-3xl">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-white">
                    Latest Storage (Persistent)
                  </h3>
                  {lastUpdated && (
                    <div className="text-xs text-gray-400">
                      {new Date(lastUpdated).toLocaleString()}
                    </div>
                  )}
                </div>

                {lastCid && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between bg-black/30 border border-gray-800/40 rounded-xl p-3">
                      <div>
                        <p className="text-slate-400 text-sm">IPFS Hash</p>
                        <p className="text-white font-mono text-sm break-all">
                          {lastCid}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-9 border-slate-600 text-slate-300 hover:bg-slate-700"
                          onClick={() => navigator.clipboard.writeText(lastCid)}
                          title="Copy IPFS hash"
                        >
                          <Copy className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                    <IPFSLinks cid={lastCid} />
                  </div>
                )}

                {lastSignature && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between bg-black/30 border border-gray-800/40 rounded-xl p-3">
                      <div>
                        <p className="text-slate-400 text-sm">
                          Transaction Signature
                        </p>
                        <p className="text-white font-mono text-sm break-all">
                          {lastSignature}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-9 border-slate-600 text-slate-300 hover:bg-slate-700"
                          onClick={() =>
                            navigator.clipboard.writeText(lastSignature)
                          }
                          title="Copy signature"
                        >
                          <Copy className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {buildExplorerUrls(lastSignature).map((e) => (
                        <div key={e.name} className="flex items-center gap-2">
                          <Button
                            onClick={() => window.open(e.url, "_blank")}
                            className="flex-1 bg-white/10 hover:bg-white/20 text-white h-9"
                          >
                            <ExternalLink className="w-3 h-3 mr-2" />
                            {e.name}
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-9 border-slate-600 text-slate-300 hover:bg-slate-700"
                            onClick={() => navigator.clipboard.writeText(e.url)}
                            title={`Copy ${e.name} URL`}
                          >
                            <Copy className="w-3 h-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Latest Storage (IPFS + Explorer links) */}
          {(() => {
            const latestStored = [...invoices]
              .reverse()
              .find((i) => i.ipfsHash || i.solanaSignature);
            if (!latestStored) return null;
            const gateways = latestStored.ipfsHash
              ? buildGatewayUrls(latestStored.ipfsHash)
              : [];
            const explorers = latestStored.solanaSignature
              ? buildExplorerUrls(latestStored.solanaSignature)
              : [];
            return (
              <Card className="card-glow mb-8 shadow-xl rounded-3xl">
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-semibold text-white">
                      Latest Storage
                    </h3>
                    <div className="text-xs text-gray-400">
                      {new Date(latestStored.uploadTime).toLocaleString()}
                    </div>
                  </div>

                  {latestStored.ipfsHash && (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between bg-black/30 border border-gray-800/40 rounded-xl p-3">
                        <div>
                          <p className="text-slate-400 text-sm">IPFS Hash</p>
                          <p className="text-white font-mono text-sm break-all">
                            {latestStored.ipfsHash}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-9 border-slate-600 text-slate-300 hover:bg-slate-700"
                            onClick={() =>
                              navigator.clipboard.writeText(
                                latestStored.ipfsHash!
                              )
                            }
                            title="Copy IPFS hash"
                          >
                            <Copy className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>

                      <IPFSLinks cid={latestStored.ipfsHash} />
                    </div>
                  )}

                  {latestStored.solanaSignature && (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between bg-black/30 border border-gray-800/40 rounded-xl p-3">
                        <div>
                          <p className="text-slate-400 text-sm">
                            Transaction Signature
                          </p>
                          <p className="text-white font-mono text-sm break-all">
                            {latestStored.solanaSignature}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-9 border-slate-600 text-slate-300 hover:bg-slate-700"
                            onClick={() =>
                              navigator.clipboard.writeText(
                                latestStored.solanaSignature!
                              )
                            }
                            title="Copy signature"
                          >
                            <Copy className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {explorers.map((e) => (
                          <div key={e.name} className="flex items-center gap-2">
                            <Button
                              onClick={() => window.open(e.url, "_blank")}
                              className="flex-1 bg-white/10 hover:bg-white/20 text-white h-9"
                            >
                              <ExternalLink className="w-3 h-3 mr-2" />
                              {e.name}
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-9 border-slate-600 text-slate-300 hover:bg-slate-700"
                              onClick={() =>
                                navigator.clipboard.writeText(e.url)
                              }
                              title={`Copy ${e.name} URL`}
                            >
                              <Copy className="w-3 h-3" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })()}

          {/* Statistics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {dashboardStats.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <Card
                  key={index}
                  className="card-glow hover:shadow-blue-500/20 transition-all duration-300 rounded-2xl"
                >
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-gray-300">
                      {stat.title}
                    </CardTitle>
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-blue-600 to-blue-500 flex items-center justify-center">
                      <IconComponent className="h-4 w-4 text-white" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-white">
                      {stat.value}
                    </div>
                    <p className="text-xs text-blue-400">
                      {stat.change} from last month
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Quick Actions */}
            <Card
              id="quick-actions"
              className="bg-black/40 border border-gray-800/50 backdrop-blur-xl shadow-xl rounded-3xl"
            >
              <CardHeader>
                <CardTitle className="text-xl text-white flex items-center gap-2">
                  <Zap className="w-5 h-5 text-gray-300" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-2xl border border-gray-800/50 bg-black/30 p-2">
                  <FileUpload onChange={handleFilesFromUpload} />
                </div>

                <Link href="/ai">
                  <Button
                    variant="outline"
                    className="w-full h-16 border-gray-700 text-gray-300 hover:bg-white/5 bg-black/20 backdrop-blur-sm flex items-center gap-3 rounded-2xl"
                  >
                    <Bot className="w-6 h-6 text-gray-300" />
                    <span className="text-lg">Ask AI Assistant</span>
                  </Button>
                </Link>

                <Button
                  variant="outline"
                  className="w-full h-12 border-gray-700 text-gray-300 hover:bg-white/5 bg-black/20 backdrop-blur-sm flex items-center gap-3 rounded-2xl"
                >
                  <BarChart3 className="w-5 h-5 text-gray-300" />
                  <span>Generate Reports</span>
                </Button>
              </CardContent>
            </Card>

            {/* Recent Invoices */}
            <Card className="lg:col-span-2 bg-black/40 border border-gray-800/50 backdrop-blur-xl shadow-xl rounded-3xl">
              <CardHeader>
                <CardTitle className="text-xl text-white flex items-center gap-2">
                  <Receipt className="w-5 h-5 text-gray-300" />
                  Recent Invoices
                </CardTitle>
              </CardHeader>
              <CardContent>
                {invoices.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-gray-800 to-gray-700 rounded-full flex items-center justify-center">
                      <FileText className="w-10 h-10 text-gray-500" />
                    </div>
                    <p className="text-gray-400 text-lg mb-2">
                      No invoices processed yet
                    </p>
                    <p className="text-sm text-gray-500">
                      Upload your first invoice to get started with AI-powered
                      analysis
                    </p>
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
                            <p className="font-medium text-white">
                              {invoice.fileName}
                            </p>
                            <p className="text-sm text-gray-400">
                              {new Date(
                                invoice.uploadTime
                              ).toLocaleDateString()}
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
                                ₹
                                {invoice.extractedData.total_amount.toLocaleString()}
                              </p>
                              <p className="text-xs text-gray-400">
                                {invoice.extractedData.vendor_name}
                              </p>
                            </div>
                          )}

                          {invoice.ipfsHash && (
                            <div className="flex items-center gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                className="border-gray-700 text-gray-300 hover:bg-gray-800 bg-black/20 backdrop-blur-sm"
                                onClick={() => {
                                  const base = "https://ipfs.io/ipfs";
                                  window.open(
                                    `${base}/${invoice.ipfsHash}`,
                                    "_blank"
                                  );
                                }}
                                title="Open on IPFS"
                              >
                                <ExternalLink className="w-3 h-3" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="border-gray-700 text-gray-300 hover:bg-gray-800 bg-black/20 backdrop-blur-sm"
                                onClick={() => {
                                  const base = "https://ipfs.io/ipfs";
                                  navigator.clipboard.writeText(
                                    `${base}/${invoice.ipfsHash}`
                                  );
                                }}
                                title="Copy IPFS URL"
                              >
                                <Copy className="w-3 h-3" />
                              </Button>
                            </div>
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

      {/* Hidden file input removed; FileUpload component handles selection */}

      {currentView === "review" && pendingExtracted && selectedFile && (
        <div className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <Card className="w-full max-w-2xl bg-zinc-900/90 border-zinc-800">
            <CardHeader>
              <CardTitle className="text-white">
                Review extracted data
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-zinc-400">File</p>
                  <p className="text-white font-medium">{selectedFile.name}</p>
                </div>
                <div>
                  <p className="text-zinc-400">Invoice #</p>
                  <p className="text-white font-medium">
                    {pendingExtracted.invoice_number}
                  </p>
                </div>
                <div>
                  <p className="text-zinc-400">Vendor</p>
                  <p className="text-white font-medium">
                    {pendingExtracted.vendor_name}
                  </p>
                </div>
                <div>
                  <p className="text-zinc-400">Amount</p>
                  <p className="text-white font-medium">
                    ₹{pendingExtracted.total_amount.toLocaleString("en-IN")}
                  </p>
                </div>
                <div>
                  <p className="text-zinc-400">Date</p>
                  <p className="text-white font-medium">
                    {pendingExtracted.date}
                  </p>
                </div>
              </div>

              <div className="border-t border-zinc-800 pt-4 space-y-3">
                <label className="flex items-center gap-3 text-white">
                  <input
                    type="checkbox"
                    className="accent-white"
                    checked={storeOnIpfs}
                    onChange={(e) => setStoreOnIpfs(e.target.checked)}
                  />
                  Store on IPFS (public URL)
                </label>
                <label className="flex items-center gap-3 text-white">
                  <input
                    type="checkbox"
                    className="accent-white"
                    checked={storeOnChain}
                    onChange={(e) => setStoreOnChain(e.target.checked)}
                  />
                  Store on Solana (transaction record)
                </label>
                <p className="text-xs text-zinc-400">
                  You can choose one or both options. Links will be shown after
                  storage.
                </p>
              </div>

              <div className="flex gap-3 pt-2">
                <Button
                  onClick={handleStoreSelected}
                  disabled={isStoring || (!storeOnIpfs && !storeOnChain)}
                  className="flex-1 bg-white text-black hover:bg-zinc-200"
                >
                  {isStoring ? "Storing..." : "Store Selected"}
                </Button>
                <Button
                  variant="outline"
                  className="flex-1 border-zinc-700 text-zinc-300 hover:bg-zinc-800"
                  onClick={() => {
                    setCurrentView("dashboard");
                    setSelectedFile(null);
                    setPendingExtracted(null);
                    setPendingInvoiceId(null);
                    setStoreOnIpfs(false);
                    setStoreOnChain(false);
                  }}
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {showTransactionResult && lastProcessedInvoice && (
        <TransactionResult
          invoiceData={{
            fileName: lastProcessedInvoice.fileName,
            invoice_number: lastProcessedInvoice.extractedData?.invoice_number,
            vendor_name: lastProcessedInvoice.extractedData?.vendor_name,
            total_amount: lastProcessedInvoice.extractedData?.total_amount,
            date: lastProcessedInvoice.extractedData?.date,
          }}
          ipfsHash={lastProcessedInvoice.ipfsHash || ""}
          solanaSignature={lastProcessedInvoice.solanaSignature || ""}
          onClose={() => setShowTransactionResult(false)}
        />
      )}
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
