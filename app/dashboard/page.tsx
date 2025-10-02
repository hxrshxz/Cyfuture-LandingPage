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
import OCRUpload from "@/components/OCRUpload";
import ExtractedDataDisplay from "@/components/ExtractedDataDisplay";
import ConfigurationValidator from "@/components/ConfigurationValidator";
import { ExtractedInvoiceData } from "@/lib/ocr-service";
import AirdropStatusModal from "@/components/AirdropStatusModal";
import { HoverBorderGradient } from "@/components/ui/hover-border-gradient";
import { InfiniteMovingCards } from "@/components/ui/infinite-moving-cards";
import { MultiStepLoader } from "@/components/ui/multi-step-loader";

const ocrLoadingStates = [
  {
    text: "Initializing OCR engine...",
  },
  {
    text: "Uploading document to AI service...",
  },
  {
    text: "Analyzing document structure...",
  },
  {
    text: "Extracting key fields (Invoice number, vendor, amount)...",
  },
  {
    text: "Processing payment details...",
  },
  {
    text: "Validating extracted data...",
  },
  {
    text: "Preparing for blockchain storage...",
  },
  {
    text: "OCR processing completed successfully!",
  },
];

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

  // Airdrop modal state
  const [airdropModal, setAirdropModal] = useState<{
    isOpen: boolean;
    status: "success" | "error" | "rate-limited";
    signature?: string;
    amount?: number;
    errorMessage?: string;
  }>({
    isOpen: false,
    status: "success"
  });

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

  const { connected, publicKey, wallet } = useWallet();
  const { user, logout } = useAuth();
  const { sendTransaction, requestAirdrop, getBalance, isSending } =
    useSolanaAction();

  // Debug wallet connection state
  console.log("Wallet connection state:", {
    connected,
    publicKey: publicKey?.toBase58(),
    walletName: wallet?.adapter?.name,
  });
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
  const [liveCounters, setLiveCounters] = useState({
    totalInvoices: 247,
    processingQueue: 3,
    ipfsStored: 189,
  });

  // Live counter animation effect
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveCounters((prev) => ({
        totalInvoices: prev.totalInvoices + Math.floor(Math.random() * 3) + 1, // +1 to +3
        processingQueue: Math.max(
          0,
          prev.processingQueue + Math.floor(Math.random() * 3) - 1
        ), // -1 to +1 (can go to 0)
        ipfsStored: prev.ipfsStored + Math.floor(Math.random() * 2) + 1, // +1 to +2
      }));
    }, 10000); // Update every 10 seconds

    return () => clearInterval(interval);
  }, []);

  const dashboardStats = [
    {
      title: "Total Invoices",
      value: liveCounters.totalInvoices.toString(),
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
      value: liveCounters.processingQueue.toString(),
      icon: Clock,
      color: "text-gray-300",
      change: "0",
    },
    {
      title: "IPFS Stored",
      value: liveCounters.ipfsStored.toString(),
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
    // Remove the old processing view, we'll use MultiStepLoader instead
    // setCurrentView("processing");

    const newInvoice: InvoiceData = {
      id: Date.now().toString(),
      fileName: file.name,
      uploadTime: new Date().toISOString(),
      status: "processing",
    };

    setInvoices((prev) => [...prev, newInvoice]);

    try {
      // Import and use the OCR service
      const { invoiceOCRService } = await import("@/lib/ocr-service");

      if (!invoiceOCRService.isAvailable()) {
        throw new Error(
          "OCR service is not available. Please check your Gemini API key configuration."
        );
      }

      // Process invoice with OCR
      const ocrResult = await invoiceOCRService.extractInvoiceData(file);

      if (!ocrResult.success || !ocrResult.data) {
        throw new Error(ocrResult.error || "Failed to extract invoice data");
      }

      // Validate extracted data
      const validation = invoiceOCRService.validateExtractedData(
        ocrResult.data
      );

      // Use the complete OCR data
      const extractedData = ocrResult.data;

      console.log("OCR extraction completed:", {
        processingTime: ocrResult.processingTime,
        confidence: ocrResult.data.confidence_score,
        validation: validation,
      });

      // Prepare review step with validation info
      setPendingExtracted(extractedData);
      setPendingInvoiceId(newInvoice.id);
      setSelectedFile(file);

      // Store validation results for the review step
      if (validation.warnings.length > 0 || validation.suggestions.length > 0) {
        console.warn("Validation issues found:", validation);
      }

      setStoreOnIpfs(false);
      setStoreOnChain(false);
      setCurrentView("review");
    } catch (error) {
      console.error("OCR processing error:", error);
      setInvoices((prev) =>
        prev.map((inv) =>
          inv.id === newInvoice.id ? { ...inv, status: "error" as const } : inv
        )
      );

      // Show error message to user
      alert(
        `Failed to process invoice: ${
          error instanceof Error ? error.message : "Unknown error occurred"
        }`
      );
      setCurrentView("dashboard");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleAirdrop = async () => {
    if (!connected) return;

    try {
      console.log("🪂 Starting airdrop request...");
      
      // Store the balance before airdrop for comparison
      const balanceBefore = await getBalance();
      console.log("💰 Balance before airdrop:", balanceBefore.toFixed(4), "SOL");

      const { signature, error } = await requestAirdrop();
      
      if (error) {
        console.error("❌ Airdrop failed:", error.message);
        
        // Show user-friendly error messages
        let userMessage = "Airdrop request failed: ";
        if (error.message.includes("airdrop limit")) {
          userMessage += "You've reached the airdrop limit. Please try again later (usually after 24 hours).";
          setAirdropModal({
            isOpen: true,
            status: "rate-limited",
            errorMessage: userMessage,
          });
        } else if (error.message.includes("Network")) {
          userMessage += "Network connection issue. Please check your internet connection and try again.";
          setAirdropModal({
            isOpen: true,
            status: "error",
            errorMessage: userMessage,
          });
        } else {
          userMessage += error.message;
          setAirdropModal({
            isOpen: true,
            status: "error",
            errorMessage: userMessage,
          });
        }
        return;
      }

      if (signature) {
        console.log("✅ Airdrop successful! Signature:", signature);
        
        // Wait a bit longer for the network to process the airdrop
        console.log("⏳ Waiting for network confirmation...");
        await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2 seconds
        
        // Update balance with retry logic
        let retries = 0;
        const maxRetries = 5;
        let newBalance = balanceBefore;
        
        while (retries < maxRetries) {
          newBalance = await getBalance();
          console.log(`💰 Balance check ${retries + 1}/${maxRetries}:`, newBalance.toFixed(4), "SOL");
          
          // Check if balance has increased (allowing for small transaction fees)
          if (newBalance > balanceBefore + 0.5) { // Expecting ~1 SOL increase
            console.log("🎉 Balance updated successfully!");
            setBalance(newBalance);
            
            // Show success message to user
            setAirdropModal({
              isOpen: true,
              status: "success",
              signature,
              amount: newBalance - balanceBefore,
            });
            return;
          }
          
          retries++;
          if (retries < maxRetries) {
            console.log("⏳ Balance not updated yet, waiting...");
            await new Promise(resolve => setTimeout(resolve, 3000)); // Wait 3 seconds between retries
          }
        }
        
        // If we get here, the balance didn't update as expected
        console.warn("⚠️ Airdrop transaction confirmed but balance may not have updated yet");
        setBalance(newBalance);
        setAirdropModal({
          isOpen: true,
          status: "success",
          signature,
          amount: newBalance - balanceBefore,
        });
      }
      
    } catch (error) {
      console.error("💥 Unexpected airdrop error:", error);
      setAirdropModal({
        isOpen: true,
        status: "error",
        errorMessage: (error as Error).message,
      });
    }
  };

  // Handle proceed from enhanced OCR review
  const handleProceedFromReview = async (
    updatedData?: ExtractedInvoiceData
  ) => {
    console.log("🔄 HandleProceedFromReview called with data:", updatedData);

    if (!selectedFile || !pendingExtracted || !pendingInvoiceId) {
      console.error("❌ Missing required data:", {
        selectedFile,
        pendingExtracted,
        pendingInvoiceId,
      });
      return;
    }

    // If updated data is provided, use it instead of pendingExtracted
    if (updatedData) {
      console.log("📝 Using updated data from review");
      setPendingExtracted(updatedData);
    }

    // Auto-enable both storage options for OCR workflow
    setStoreOnIpfs(true);
    setStoreOnChain(true);

    console.log("🚀 Proceeding to store data");
    // Proceed to store the data
    await handleStoreSelected();
  };

  // Store selections after review
  const handleStoreSelected = async () => {
    console.log("🏪 HandleStoreSelected called");
    console.log("📁 Selected file:", selectedFile);
    console.log("📋 Pending extracted:", pendingExtracted);
    console.log("🆔 Pending invoice ID:", pendingInvoiceId);
    console.log("💾 Store on IPFS:", storeOnIpfs);
    console.log("⛓️ Store on chain:", storeOnChain);
    console.log("🔗 Connected:", connected);
    console.log("🔑 Public key:", publicKey);

    if (!selectedFile || !pendingExtracted || !pendingInvoiceId) {
      console.error("❌ Missing required data for storage");
      return;
    }

    // Check wallet connection if user wants to store on chain
    if (storeOnChain && (!connected || !publicKey)) {
      console.error("Wallet not connected for on-chain storage");
      alert("Please connect your wallet before storing data on-chain.");
      return;
    }

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

      if (storeOnChain && connected && publicKey) {
        // Thorough wallet validation before transaction
        console.log("Wallet validation:", {
          connected,
          publicKey: publicKey?.toBase58(),
          walletName: wallet?.adapter?.name,
        });

        if (!connected || !publicKey || !wallet?.adapter) {
          throw new Error(
            "Wallet not properly connected. Please disconnect and reconnect your wallet."
          );
        }

        // Check balance before transaction
        console.log("💰 Checking wallet balance...");
        const currentBalance = await getBalance();
        console.log("💰 Current balance:", currentBalance, "SOL");

        if (currentBalance < 0.001) {
          throw new Error(
            `Insufficient SOL balance (${currentBalance.toFixed(
              6
            )} SOL). Please request an airdrop or add funds to your wallet.`
          );
        }

        // Wait a moment to ensure wallet state is stable
        await new Promise((resolve) => setTimeout(resolve, 500));

        // Create a compact memo (Solana memos have 80-byte limit)
        // Use only the last 12 characters of IPFS hash to save space
        const shortHash = ipfsHash?.slice(-12) || "unknown";
        const shortInvoiceId = pendingInvoiceId.slice(-8); // Last 8 chars of invoice ID
        const timestamp = Date.now().toString(36); // Base-36 timestamp (shorter)

        const payload = `INV:${shortInvoiceId}:${shortHash}:${timestamp}`;
        console.log("📦 Compact payload for blockchain:", payload);
        console.log("📏 Payload length:", payload.length, "bytes (limit: 80)");
        console.log("🔗 Full IPFS hash stored separately:", ipfsHash);

        if (payload.length > 80) {
          console.error(
            "❌ Payload too large for Solana memo:",
            payload.length,
            "bytes"
          );
          throw new Error(
            `Transaction payload too large (${payload.length} bytes). Solana memos are limited to 80 bytes.`
          );
        }

        console.log(
          "Starting Solana transaction with connected wallet:",
          publicKey.toBase58()
        );

        // Retry logic for Solana transaction
        let retries = 0;
        const maxRetries = 3;

        while (retries < maxRetries) {
          try {
            // Re-validate wallet connection before each attempt
            if (!connected || !publicKey || !wallet?.adapter) {
              throw new Error(
                "Wallet connection lost during transaction. Please refresh and reconnect."
              );
            }

            console.log(`Transaction attempt ${retries + 1}/${maxRetries}`);
            const { signature, error } = await sendTransaction(payload);

            if (error) {
              console.error(
                `Transaction attempt ${retries + 1} failed:`,
                error.message
              );

              // Don't retry wallet connection errors
              if (
                error.message.includes("Wallet not connected") ||
                error.message.includes("WalletNotConnectedError") ||
                error.message.includes("WalletNotReadyError")
              ) {
                throw new Error(
                  "Wallet connection issue detected. Please disconnect and reconnect your wallet, then try again."
                );
              }

              retries++;

              if (retries >= maxRetries) {
                throw error;
              }

              // Wait before retry (exponential backoff)
              await new Promise((resolve) =>
                setTimeout(resolve, 1000 * Math.pow(2, retries))
              );
              continue;
            }

            solanaSignature = signature || undefined;
            if (signature) setLastSignature(signature);
            break; // Success, exit retry loop
          } catch (txError) {
            const errorMessage = (txError as Error).message;
            console.error(
              `Transaction attempt ${retries + 1} failed:`,
              errorMessage
            );

            // Handle specific wallet errors that shouldn't be retried
            if (
              errorMessage.includes("Wallet not connected") ||
              (txError as any)?.constructor?.name === "WalletNotConnectedError"
            ) {
              throw new Error(
                "Wallet connection issue. Please disconnect your wallet, refresh the page, and reconnect before trying again."
              );
            }

            retries++;

            if (retries >= maxRetries) {
              throw txError;
            }

            // Wait before retry (exponential backoff)
            await new Promise((resolve) =>
              setTimeout(resolve, 1000 * Math.pow(2, retries))
            );
          }
        }
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
      const errorMessage = (e as Error).message;

      let userMessage = "Storage failed. ";
      if (errorMessage.includes("Wallet connection")) {
        userMessage +=
          "Please disconnect your wallet, refresh the page, and reconnect before trying again.";
      } else if (errorMessage.includes("Transaction failed")) {
        userMessage +=
          "The blockchain transaction failed. Your data was " +
          (ipfsHash ? "stored on IPFS" : "not stored") +
          ". Please try the blockchain storage again.";
      } else {
        userMessage += errorMessage;
      }

      alert(userMessage);

      // If IPFS succeeded but blockchain failed, still update the invoice record
      if (ipfsHash && pendingInvoiceId) {
        setInvoices((prev) =>
          prev.map((inv) =>
            inv.id === pendingInvoiceId
              ? {
                  ...inv,
                  status: "completed" as const,
                  extractedData: pendingExtracted,
                  ipfsHash,
                  solanaSignature: undefined,
                }
              : inv
          )
        );
      }
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
    <AppNavigation currentPage="/dashboard">
      <div className="pt-24">
        {/* Spacing for fixed navbar */}
        {/* Transaction animation overlay */}
        {isSending && (
          <div className="fixed inset-0 z-[9999] pointer-events-none bg-black/50 backdrop-blur-md">
            <div className="relative h-full w-full">
              <GoogleGeminiEffect
                className="top-24"
                pathLengths={[v1, v2, v3, v4, v5]}
                title="Submitting transaction…"
                description="Securing your data on-chain"
                palette={[
                  "#63d2ff",
                  "#5ef1ff",
                  "#9ab6ff",
                  "#5aa8ff",
                  "#2f6bff",
                ]}
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

        {/* Infinite Moving Cards Section */}
        <div className="relative z-10 p-6">
          <InfiniteMovingCards
            items={dashboardStats.map((stat) => ({
              quote: stat.title,
              name: stat.title,
              title: stat.value,
              image: "/d1.png",
            }))}
            direction="right"
            speed="normal"
          />
        </div>

        {/* Content */}
        <div className="relative z-10 p-6 pt-20">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <div className="min-w-0">
                <h1 className="">Welcome back, {user?.name}!</h1>
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
                    <p className="text-gray-400 capitalize">
                      {user?.plan} Plan
                    </p>
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
                  <HoverBorderGradient
                    containerClassName="rounded-lg"
                    className="bg-gradient-to-r from-purple-600 to-purple-500 text-white font-medium px-4 py-2 rounded-lg"
                    duration={1.2}
                  >
                    <span className="flex items-center gap-2 bg-transparent border-0 text-white">
                      <Bot className="w-4 h-4" />
                      AI Assistant
                    </span>
                  </HoverBorderGradient>
                </Link>
              </div>
            </div>

            {/* Wallet Section - CORE FEATURE BUTTONS */}
            <Card className="mb-8 border border-white/20 bg-gray-900/80">
              <CardContent className="p-8">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center">
                      <Wallet className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-white">
                        Solana Wallet
                      </h3>
                      {connected ? (
                        <div className="space-y-1">
                          <p className="text-white font-mono font-bold text-lg">
                            {publicKey?.toBase58().slice(0, 8)}...
                            {publicKey?.toBase58().slice(-8)}
                          </p>
                          <p className="text-white font-bold text-xl">
                            Balance: {balance.toFixed(4)} SOL
                          </p>
                        </div>
                      ) : (
                        <p className="text-gray-300 text-lg">
                          Connect your wallet to get started
                        </p>
                      )}
                    </div>
                  </div>

                  {/* CORE FEATURE BUTTONS - MODERN TAILWIND STYLES */}
                  <div className="flex flex-wrap items-center gap-4">
                    {connected && (
                      <button
                        onClick={handleAirdrop}
                        disabled={isSending}
                        className="px-8 py-2 rounded-full bg-gradient-to-b from-blue-500 to-blue-600 text-white focus:ring-2 focus:ring-blue-400 hover:shadow-xl transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
                      >
                        {isSending ? "Requesting..." : "🪂 Request Airdrop"}
                      </button>
                    )}
                    
                    {connected && (
                      <button
                        onClick={() => {
                          const address = publicKey?.toBase58();
                          if (address) {
                            navigator.clipboard.writeText(address);
                            window.open('https://faucet.solana.com', '_blank');
                            alert(`📋 Address copied: ${address}`);
                          }
                        }}
                        className="relative inline-flex h-12 overflow-hidden rounded-full p-[1px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50"
                        title="Copy wallet address and open web faucet"
                      >
                        <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#06b6d4_0%,#3b82f6_50%,#06b6d4_100%)]" />
                        <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-slate-950 px-6 py-1 text-sm font-medium text-white backdrop-blur-3xl">
                          🌐 Web Faucet
                        </span>
                      </button>
                    )}
                    
                    {connected && (
                      <button
                        onClick={handleTestTransaction}
                        disabled={isSending}
                        className="inline-flex h-12 animate-shimmer items-center justify-center rounded-md border border-slate-800 bg-[linear-gradient(110deg,#000103,45%,#1e2631,55%,#000103)] bg-[length:200%_100%] px-6 font-medium text-slate-400 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Send test transaction to verify setup"
                      >
                        {isSending ? "Sending..." : "⚡ Test Transaction"}
                      </button>
                    )}
                    
                    <div style={{ zIndex: 9999, position: 'relative' }}>
                      <WalletMultiButton className="!px-8 !py-2 !border !border-black !bg-transparent !text-white !dark:border-white !relative !group !transition !duration-200 !font-semibold !rounded-lg !hover:shadow-[0px_0px_4px_4px_rgba(255,255,255,0.1)]" />
                    </div>
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
                            onClick={() =>
                              navigator.clipboard.writeText(lastCid)
                            }
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
                            <div
                              key={e.name}
                              className="flex items-center gap-2"
                            >
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
                  <div className="text-center space-y-4">
                    <div className="w-full max-w-4xl mx-auto min-h-96 border border-dashed bg-white dark:bg-black border-neutral-200 dark:border-neutral-800 rounded-lg">
                      <FileUpload onChange={handleFilesFromUpload} />
                    </div>
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
          <div className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm overflow-y-auto">
            <div className="min-h-screen p-4 flex items-start justify-center">
              <div className="w-full max-w-4xl my-8">
                <ExtractedDataDisplay
                  data={pendingExtracted}
                  onDataChange={(updatedData) =>
                    setPendingExtracted(updatedData)
                  }
                  onSave={(updatedData) => {
                    console.log(
                      "💾 Save button clicked with data:",
                      updatedData
                    );
                    handleProceedFromReview(updatedData);
                  }}
                  onCancel={() => {
                    setCurrentView("dashboard");
                    setPendingExtracted(null);
                    setPendingInvoiceId(null);
                    setSelectedFile(null);
                  }}
                  isEditable={true}
                  isSaving={isStoring}
                  className="bg-black/90 backdrop-blur-xl rounded-2xl border border-gray-800/50 p-6"
                />

                {/* Storage Options */}
                <Card className="mt-4 bg-black/40 border-gray-800/60">
                  <CardContent className="p-4">
                    <h4 className="text-white font-medium mb-3">
                      Storage Options
                    </h4>
                    <div className="space-y-3">
                      <label className="flex items-center gap-3 text-white">
                        <input
                          type="checkbox"
                          className="accent-cyan-500"
                          checked={storeOnIpfs}
                          onChange={(e) => setStoreOnIpfs(e.target.checked)}
                        />
                        <div>
                          <p className="font-medium">Store file on IPFS</p>
                          <p className="text-sm text-gray-400">
                            Decentralized storage for invoice file
                          </p>
                        </div>
                      </label>
                      <label className="flex items-center gap-3 text-white">
                        <input
                          type="checkbox"
                          className="accent-cyan-500"
                          checked={storeOnChain}
                          onChange={(e) => setStoreOnChain(e.target.checked)}
                        />
                        <div>
                          <p className="font-medium">
                            Store on Solana blockchain
                          </p>
                          <p className="text-sm text-gray-400">
                            Immutable record of extracted data
                          </p>
                        </div>
                      </label>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        )}

        {showTransactionResult && lastProcessedInvoice && (
          <TransactionResult
            invoiceData={{
              fileName: lastProcessedInvoice.fileName,
              invoice_number:
                lastProcessedInvoice.extractedData?.invoice_number,
              vendor_name: lastProcessedInvoice.extractedData?.vendor_name,
              total_amount: lastProcessedInvoice.extractedData?.total_amount,
              date: lastProcessedInvoice.extractedData?.date,
            }}
            ipfsHash={lastProcessedInvoice.ipfsHash || ""}
            solanaSignature={lastProcessedInvoice.solanaSignature || ""}
            onClose={() => setShowTransactionResult(false)}
          />
        )}

        {/* MultiStepLoader for OCR Processing */}
        <MultiStepLoader 
          loadingStates={ocrLoadingStates}
          loading={isProcessing}
          duration={3000}
          loop={false}
        />

        {/* Configuration Validator */}
        <ConfigurationValidator />
      </div>
    </AppNavigation>
  );
}

export default function Dashboard() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}
