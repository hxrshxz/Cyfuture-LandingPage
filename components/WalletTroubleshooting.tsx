"use client";

import React from "react";
import { motion } from "framer-motion";
import { AlertTriangle, RefreshCw, Wallet, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface WalletTroubleshootingProps {
  onRetry: () => void;
  onClose: () => void;
  className?: string;
}

export default function WalletTroubleshooting({
  onRetry,
  onClose,
  className = "",
}: WalletTroubleshootingProps) {
  const troubleshootingSteps = [
    {
      step: 1,
      title: "Disconnect Wallet",
      description:
        "Click the wallet button in the top right and disconnect your current wallet",
      icon: Wallet,
    },
    {
      step: 2,
      title: "Refresh Page",
      description: "Refresh this page completely (Ctrl+R or Cmd+R)",
      icon: RefreshCw,
    },
    {
      step: 3,
      title: "Reconnect Wallet",
      description: "Connect your wallet again and ensure it's on Solana Devnet",
      icon: CheckCircle,
    },
  ];

  return (
    <div
      className={`fixed inset-0 z-[70] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 ${className}`}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="w-full max-w-md"
      >
        <Card className="bg-slate-900/95 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-3">
              <AlertTriangle className="w-6 h-6 text-yellow-400" />
              Wallet Connection Issue
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-slate-300">
              There's an issue with your wallet connection. Follow these steps
              to resolve it:
            </p>

            <div className="space-y-4">
              {troubleshootingSteps.map((item) => (
                <div key={item.step} className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-cyan-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <item.icon className="w-4 h-4 text-cyan-400" />
                  </div>
                  <div>
                    <h4 className="text-white font-medium">
                      {item.step}. {item.title}
                    </h4>
                    <p className="text-sm text-slate-400 mt-1">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
              <h4 className="text-white font-medium mb-2">Additional Tips:</h4>
              <ul className="text-sm text-slate-300 space-y-1">
                <li>
                  • Make sure you're using a Solana-compatible wallet (Phantom,
                  Solflare, etc.)
                </li>
                <li>• Ensure your wallet is set to Solana Devnet</li>
                <li>• Try clearing your browser cache if the issue persists</li>
              </ul>
            </div>

            <div className="flex gap-3">
              <Button
                onClick={onRetry}
                className="flex-1 bg-cyan-500 hover:bg-cyan-600 text-white"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Try Again
              </Button>
              <Button
                variant="outline"
                onClick={onClose}
                className="flex-1 border-slate-600 text-slate-300 hover:bg-slate-800"
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
