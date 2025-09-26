"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertCircle,
  CheckCircle,
  Settings,
  ExternalLink,
  Copy,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface ConfigStatus {
  geminiApiKey: {
    exists: boolean;
    valid: boolean;
    message: string;
  };
  ipfsConfig: {
    exists: boolean;
    valid: boolean;
    message: string;
  };
}

export default function ConfigurationValidator() {
  const [configStatus, setConfigStatus] = useState<ConfigStatus | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    checkConfiguration();
  }, []);

  const checkConfiguration = () => {
    const status: ConfigStatus = {
      geminiApiKey: {
        exists: false,
        valid: false,
        message: "",
      },
      ipfsConfig: {
        exists: false,
        valid: false,
        message: "",
      },
    };

    // Check Gemini API Key
    if (typeof window !== "undefined") {
      const geminiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
      if (!geminiKey) {
        status.geminiApiKey = {
          exists: false,
          valid: false,
          message: "NEXT_PUBLIC_GEMINI_API_KEY is not configured",
        };
      } else if (geminiKey.length < 10) {
        status.geminiApiKey = {
          exists: true,
          valid: false,
          message: "Gemini API key appears to be too short",
        };
      } else {
        status.geminiApiKey = {
          exists: true,
          valid: true,
          message: "Gemini API key configured",
        };
      }

      // Check IPFS/Pinata Configuration
      const pinataJwt = process.env.NEXT_PUBLIC_PINATA_JWT;
      if (!pinataJwt) {
        status.ipfsConfig = {
          exists: false,
          valid: false,
          message: "NEXT_PUBLIC_PINATA_JWT is not configured",
        };
      } else {
        status.ipfsConfig = {
          exists: true,
          valid: true,
          message: "IPFS/Pinata configuration found",
        };
      }
    }

    setConfigStatus(status);
  };

  const copyEnvTemplate = () => {
    const template = `# Add these to your .env.local file:
NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key_here
NEXT_PUBLIC_PINATA_JWT=your_pinata_jwt_here

# Get Gemini API Key from: https://makersuite.google.com/app/apikey
# Get Pinata JWT from: https://app.pinata.cloud/keys`;

    navigator.clipboard.writeText(template);
    alert("Environment template copied to clipboard!");
  };

  if (!configStatus) {
    return null;
  }

  const hasIssues =
    !configStatus.geminiApiKey.valid || !configStatus.ipfsConfig.valid;

  if (!hasIssues && !showDetails) {
    return (
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setShowDetails(true)}
        className="fixed bottom-4 right-4 bg-green-600/20 text-green-400 hover:bg-green-600/30"
      >
        <CheckCircle className="w-4 h-4 mr-2" />
        Config OK
      </Button>
    );
  }

  return (
    <AnimatePresence>
      {(hasIssues || showDetails) && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className="fixed bottom-4 right-4 z-50"
        >
          <Card className="w-96 bg-slate-900/95 border-slate-700 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  Configuration Status
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowDetails(false)}
                  className="text-slate-400 hover:text-white"
                >
                  ×
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Gemini API Status */}
              <div className="flex items-start gap-3">
                {configStatus.geminiApiKey.valid ? (
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                )}
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-white font-medium">OCR Service</span>
                    <Badge
                      variant={
                        configStatus.geminiApiKey.valid
                          ? "default"
                          : "destructive"
                      }
                      className={
                        configStatus.geminiApiKey.valid
                          ? "bg-green-600/20 text-green-400"
                          : "bg-red-600/20 text-red-400"
                      }
                    >
                      {configStatus.geminiApiKey.valid
                        ? "Ready"
                        : "Not Configured"}
                    </Badge>
                  </div>
                  <p className="text-sm text-slate-400 mt-1">
                    {configStatus.geminiApiKey.message}
                  </p>
                </div>
              </div>

              {/* IPFS Status */}
              <div className="flex items-start gap-3">
                {configStatus.ipfsConfig.valid ? (
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                )}
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-white font-medium">File Storage</span>
                    <Badge
                      variant={
                        configStatus.ipfsConfig.valid
                          ? "default"
                          : "destructive"
                      }
                      className={
                        configStatus.ipfsConfig.valid
                          ? "bg-green-600/20 text-green-400"
                          : "bg-red-600/20 text-red-400"
                      }
                    >
                      {configStatus.ipfsConfig.valid
                        ? "Ready"
                        : "Not Configured"}
                    </Badge>
                  </div>
                  <p className="text-sm text-slate-400 mt-1">
                    {configStatus.ipfsConfig.message}
                  </p>
                </div>
              </div>

              {hasIssues && (
                <div className="border-t border-slate-700 pt-4 space-y-3">
                  <h4 className="text-white font-medium">
                    Setup Instructions:
                  </h4>

                  <div className="space-y-2 text-sm text-slate-300">
                    <div className="flex items-center gap-2">
                      <span>1.</span>
                      <span>Create a </span>
                      <code className="bg-slate-800 px-1 rounded">
                        .env.local
                      </code>
                      <span>file in your project root</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span>2.</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={copyEnvTemplate}
                        className="text-cyan-400 hover:text-cyan-300 p-0 h-auto font-normal"
                      >
                        <Copy className="w-3 h-3 mr-1" />
                        Copy environment template
                      </Button>
                    </div>

                    <div className="flex items-center gap-2">
                      <span>3.</span>
                      <span>Get API keys from:</span>
                    </div>

                    <div className="ml-4 space-y-1">
                      <div className="flex items-center gap-2">
                        <span>•</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            window.open(
                              "https://makersuite.google.com/app/apikey",
                              "_blank"
                            )
                          }
                          className="text-cyan-400 hover:text-cyan-300 p-0 h-auto font-normal"
                        >
                          Google AI Studio
                          <ExternalLink className="w-3 h-3 ml-1" />
                        </Button>
                        <span className="text-slate-500">(for Gemini)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span>•</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            window.open(
                              "https://app.pinata.cloud/keys",
                              "_blank"
                            )
                          }
                          className="text-cyan-400 hover:text-cyan-300 p-0 h-auto font-normal"
                        >
                          Pinata Cloud
                          <ExternalLink className="w-3 h-3 ml-1" />
                        </Button>
                        <span className="text-slate-500">(for IPFS)</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span>4.</span>
                      <span>Restart your development server</span>
                    </div>
                  </div>

                  <Button
                    onClick={checkConfiguration}
                    size="sm"
                    className="w-full bg-cyan-500 hover:bg-cyan-600 text-white"
                  >
                    Recheck Configuration
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
