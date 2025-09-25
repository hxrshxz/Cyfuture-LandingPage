"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ExternalLink,
  Copy,
  FileText,
  CheckCircle2,
  Database,
  Link,
} from "lucide-react";
import { useState } from "react";

interface TransactionResultProps {
  invoiceData: {
    fileName: string;
    invoice_number: string;
    vendor_name: string;
    total_amount: number;
    date: string;
  };
  ipfsHash: string;
  solanaSignature: string;
  onClose: () => void;
}

export default function TransactionResult({
  invoiceData,
  ipfsHash,
  solanaSignature,
  onClose,
}: TransactionResultProps) {
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // Only ipfs.io gateway per request
  const ipfsUrl = `https://ipfs.io/ipfs/${ipfsHash}`;
  const gatewayUrls = [{ name: "IPFS.io", url: ipfsUrl }];

  const cluster = process.env.NEXT_PUBLIC_SOLANA_CLUSTER || "devnet";
  const solscanBase = "https://solscan.io/tx";
  const solscanUrl =
    cluster === "mainnet" || cluster === "mainnet-beta"
      ? `${solscanBase}/${solanaSignature}`
      : `${solscanBase}/${solanaSignature}?cluster=${cluster}`;

  const copyToClipboard = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl card-glow border-blue-500/20 shadow-2xl shadow-blue-500/10">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mb-4">
            <CheckCircle2 className="w-8 h-8 text-blue-400" />
          </div>
          <CardTitle className="text-2xl blue-glow-text">
            Invoice Successfully Processed!
          </CardTitle>
          <p className="text-slate-400">
            Your invoice has been secured on the blockchain and stored on IPFS
          </p>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Invoice Details */}
          <div className="bg-blue-900/20 border border-blue-500/20 rounded-lg p-4">
            <h4 className="font-semibold blue-glow-text mb-3 flex items-center gap-2">
              <FileText className="w-4 h-4 text-blue-400" />
              Invoice Details
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-slate-400">File Name:</span>
                <p className="text-white font-medium">{invoiceData.fileName}</p>
              </div>
              <div>
                <span className="text-slate-400">Invoice Number:</span>
                <p className="text-white font-medium">
                  {invoiceData.invoice_number}
                </p>
              </div>
              <div>
                <span className="text-slate-400">Vendor:</span>
                <p className="text-white font-medium">
                  {invoiceData.vendor_name}
                </p>
              </div>
              <div>
                <span className="text-slate-400">Amount:</span>
                <p className="text-white font-medium">
                  ₹{invoiceData.total_amount.toLocaleString("en-IN")}
                </p>
              </div>
            </div>
          </div>

          {/* IPFS Storage Details */}
          <div className="bg-blue-900/20 border border-blue-500/20 rounded-lg p-4">
            <h4 className="font-semibold blue-glow-text mb-3 flex items-center gap-2">
              <Database className="w-4 h-4 text-blue-400" />
              IPFS Storage
            </h4>
            <div className="space-y-3">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-slate-400 text-sm">IPFS Hash:</span>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => copyToClipboard(ipfsHash, "ipfs")}
                    className="border-slate-600 text-slate-300 hover:bg-slate-700"
                  >
                    {copiedField === "ipfs" ? (
                      "Copied!"
                    ) : (
                      <Copy className="w-3 h-3" />
                    )}
                  </Button>
                </div>
                <div className="bg-slate-900 rounded-md p-3 font-mono text-sm text-slate-300 break-all">
                  {ipfsHash}
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-slate-400 text-sm">
                    Public IPFS URLs:
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {gatewayUrls.map(({ name, url }) => (
                    <div key={name} className="flex items-center gap-2">
                      <Button
                        onClick={() => window.open(url, "_blank")}
                        className="flex-1 bg-white/10 hover:bg-white/20 text-white h-9"
                      >
                        <ExternalLink className="w-3 h-3 mr-2" />
                        {name}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => copyToClipboard(url, `copy-${name}`)}
                        className="h-9 border-slate-600 text-slate-300 hover:bg-slate-700"
                        title={`Copy ${name} URL`}
                      >
                        {copiedField === `copy-${name}` ? (
                          "Copied!"
                        ) : (
                          <Copy className="w-3 h-3" />
                        )}
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Blockchain Transaction Details */}
          <div className="bg-slate-800/50 rounded-lg p-4">
            <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
              <Link className="w-4 h-4" />
              Blockchain Transaction
            </h4>
            <div className="space-y-3">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-slate-400 text-sm">
                    Transaction Signature:
                  </span>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() =>
                      copyToClipboard(solanaSignature, "signature")
                    }
                    className="border-slate-600 text-slate-300 hover:bg-slate-700"
                  >
                    {copiedField === "signature" ? (
                      "Copied!"
                    ) : (
                      <Copy className="w-3 h-3" />
                    )}
                  </Button>
                </div>
                <div className="bg-slate-900 rounded-md p-3 font-mono text-sm text-slate-300 break-all">
                  {solanaSignature}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  onClick={() => window.open(solscanUrl, "_blank")}
                  className="bg-blue-600 hover:bg-blue-700 text-white flex-1"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  View on Solscan
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => copyToClipboard(solscanUrl, "solscan")}
                  className="border-slate-600 text-slate-300 hover:bg-slate-700"
                >
                  {copiedField === "solscan" ? (
                    "Copied!"
                  ) : (
                    <Copy className="w-3 h-3" />
                  )}
                </Button>
              </div>
            </div>
          </div>

          {/* Status Badges */}
          <div className="flex flex-wrap gap-2 justify-center">
            <Badge
              variant="secondary"
              className="bg-green-500/20 text-green-300"
            >
              <CheckCircle2 className="w-3 h-3 mr-1" />
              Blockchain Secured
            </Badge>
            <Badge variant="secondary" className="bg-blue-500/20 text-blue-300">
              <Database className="w-3 h-3 mr-1" />
              IPFS Stored
            </Badge>
            <Badge variant="secondary" className="bg-blue-500/20 text-blue-300">
              <FileText className="w-3 h-3 mr-1" />
              Data Extracted
            </Badge>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              onClick={onClose}
              className="bg-cyan-500 hover:bg-cyan-600 text-white flex-1"
            >
              Continue Processing
            </Button>
            <Button
              variant="outline"
              onClick={() =>
                window.open(
                  `/gst-reconciliation?invoice=${invoiceData.invoice_number}`,
                  "_blank"
                )
              }
              className="border-slate-600 text-slate-300 hover:bg-slate-700"
            >
              View in GST Center
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
