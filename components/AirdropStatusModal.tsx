import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  CheckCircle, 
  AlertCircle, 
  ExternalLink, 
  Copy, 
  X,
  Wallet
} from "lucide-react";

interface AirdropStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  status: "success" | "error" | "rate-limited";
  signature?: string;
  amount?: number;
  walletAddress?: string;
  errorMessage?: string;
}

export default function AirdropStatusModal({
  isOpen,
  onClose,
  status,
  signature,
  amount,
  walletAddress,
  errorMessage
}: AirdropStatusModalProps) {
  if (!isOpen) return null;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const openWebFaucet = () => {
    if (walletAddress) {
      copyToClipboard(walletAddress);
      window.open('https://faucet.solana.com', '_blank');
    }
  };

  const openSolscan = () => {
    if (signature) {
      const cluster = process.env.NEXT_PUBLIC_SOLANA_CLUSTER || "devnet";
      const base = "https://solscan.io/tx";
      const url = cluster === "mainnet" || cluster === "mainnet-beta"
        ? `${base}/${signature}`
        : `${base}/${signature}?cluster=${cluster}`;
      window.open(url, "_blank");
    }
  };

  return (
    <div className="fixed inset-0 z-[70] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="w-full max-w-md"
      >
        <Card className="bg-slate-800/90 border-slate-700 backdrop-blur-xl">
          <CardHeader className="relative">
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="absolute top-2 right-2 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </Button>
            
            <div className="text-center">
              {status === "success" && (
                <div className="w-16 h-16 mx-auto mb-4 bg-green-500/20 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-8 h-8 text-green-500" />
                </div>
              )}
              
              {status === "error" && (
                <div className="w-16 h-16 mx-auto mb-4 bg-red-500/20 rounded-full flex items-center justify-center">
                  <AlertCircle className="w-8 h-8 text-red-500" />
                </div>
              )}
              
              {status === "rate-limited" && (
                <div className="w-16 h-16 mx-auto mb-4 bg-orange-500/20 rounded-full flex items-center justify-center">
                  <Wallet className="w-8 h-8 text-orange-500" />
                </div>
              )}
              
              <CardTitle className="text-white">
                {status === "success" && "Airdrop Successful! 🎉"}
                {status === "error" && "Airdrop Failed"}
                {status === "rate-limited" && "Rate Limit Reached"}
              </CardTitle>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-4">
            {status === "success" && (
              <>
                <div className="text-center">
                  <p className="text-slate-300 mb-2">
                    You received <span className="text-green-400 font-bold">{amount?.toFixed(4)} SOL</span>
                  </p>
                  {signature && (
                    <p className="text-xs text-slate-400 break-all">
                      Transaction: {signature}
                    </p>
                  )}
                </div>
                
                {signature && (
                  <div className="flex gap-2">
                    <Button
                      onClick={openSolscan}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      View on Solscan
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => copyToClipboard(signature)}
                      className="border-slate-600 text-slate-300 hover:bg-slate-700"
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </>
            )}
            
            {status === "rate-limited" && (
              <>
                <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-4">
                  <h4 className="text-orange-400 font-medium mb-2">Network Rate Limited</h4>
                  <p className="text-slate-300 text-sm mb-3">
                    Your current network has reached the 24-hour airdrop limit.
                  </p>
                  
                  <div className="space-y-2 text-sm text-slate-300">
                    <p className="font-medium">💡 Try these solutions:</p>
                    <ul className="list-disc list-inside space-y-1 text-xs">
                      <li>Switch to mobile hotspot or different WiFi</li>
                      <li>Use VPN to change your IP address</li>
                      <li>Wait 24 hours for rate limit reset</li>
                      <li>Use manual web faucets (recommended)</li>
                    </ul>
                  </div>
                </div>
                
                {walletAddress && (
                  <div className="space-y-3">
                    <div className="bg-slate-700/30 rounded-lg p-3">
                      <p className="text-slate-400 text-xs mb-1">Your Wallet Address:</p>
                      <p className="text-white font-mono text-xs break-all">
                        {walletAddress}
                      </p>
                    </div>
                    
                    <Button
                      onClick={openWebFaucet}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Open Web Faucet & Copy Address
                    </Button>
                    
                    <div className="text-center">
                      <p className="text-slate-400 text-xs">
                        Web faucet will open in new tab with your address copied
                      </p>
                    </div>
                  </div>
                )}
              </>
            )}
            
            {status === "error" && (
              <>
                <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
                  <p className="text-slate-300 text-sm">
                    {errorMessage || "An unexpected error occurred during the airdrop request."}
                  </p>
                </div>
                
                <div className="flex gap-2">
                  <Button
                    onClick={onClose}
                    variant="outline"
                    className="flex-1 border-slate-600 text-slate-300 hover:bg-slate-700"
                  >
                    Try Again
                  </Button>
                  {walletAddress && (
                    <Button
                      onClick={openWebFaucet}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Web Faucet
                    </Button>
                  )}
                </div>
              </>
            )}
            
            <Button
              onClick={onClose}
              variant="ghost"
              className="w-full text-slate-400 hover:text-white hover:bg-slate-700"
            >
              Close
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}