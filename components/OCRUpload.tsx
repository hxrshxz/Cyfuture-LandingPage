"use client";

import React, { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useDropzone } from "react-dropzone";
import {
  Upload,
  FileImage,
  X,
  AlertCircle,
  CheckCircle,
  Eye,
  Camera,
  Scan,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface OCRUploadProps {
  onFileSelect: (file: File) => void;
  isProcessing?: boolean;
  maxSize?: number; // in MB
  accept?: string[];
  className?: string;
}

export default function OCRUpload({
  onFileSelect,
  isProcessing = false,
  maxSize = 20,
  accept = ["image/jpeg", "image/jpg", "image/png", "image/webp"],
  className = "",
}: OCRUploadProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // File validation
  const validateFile = useCallback(
    (file: File): string | null => {
      // Check file type
      if (!accept.includes(file.type)) {
        return `Unsupported file type. Please upload: ${accept
          .map((type) => type.split("/")[1].toUpperCase())
          .join(", ")}`;
      }

      // Check file size
      const fileSizeMB = file.size / (1024 * 1024);
      if (fileSizeMB > maxSize) {
        return `File too large. Maximum size allowed: ${maxSize}MB`;
      }

      return null;
    },
    [accept, maxSize]
  );

  // Handle file selection
  const handleFileSelect = useCallback(
    (files: File[]) => {
      const file = files[0];
      if (!file) return;

      const validationError = validateFile(file);
      if (validationError) {
        setError(validationError);
        return;
      }

      setError(null);
      setSelectedFile(file);

      // Create preview URL
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);

      // Notify parent component
      onFileSelect(file);
    },
    [onFileSelect, validateFile]
  );

  // Dropzone configuration
  const { getRootProps, getInputProps, isDragActive, isDragReject } =
    useDropzone({
      onDrop: handleFileSelect,
      accept: {
        "image/jpeg": [".jpg", ".jpeg"],
        "image/png": [".png"],
        "image/webp": [".webp"],
      },
      maxFiles: 1,
      disabled: isProcessing,
    });

  const clearFile = useCallback(() => {
    setSelectedFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    setError(null);
  }, [previewUrl]);

  const formatFileSize = (bytes: number): string => {
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(2)} MB`;
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <AnimatePresence mode="wait">
        {!selectedFile ? (
          <motion.div
            key="upload"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="bg-black/40 border-gray-800/60 overflow-hidden">
              <CardContent className="p-0">
                <div
                  {...getRootProps()}
                  className={`
                    relative p-8 border-2 border-dashed transition-all duration-300 cursor-pointer
                    ${
                      isDragActive && !isDragReject
                        ? "border-cyan-500 bg-cyan-500/10"
                        : isDragReject
                        ? "border-red-500 bg-red-500/10"
                        : "border-gray-600 hover:border-gray-500 hover:bg-gray-800/50"
                    }
                    ${isProcessing ? "cursor-not-allowed opacity-50" : ""}
                  `}
                >
                  <input {...getInputProps()} />
                  
                  <div className="text-center space-y-4">
                    <div className="relative">
                      <motion.div
                        animate={
                          isDragActive
                            ? { scale: 1.1, rotate: 5 }
                            : { scale: 1, rotate: 0 }
                        }
                        transition={{ duration: 0.2 }}
                        className={`
                          w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-4
                          ${
                            isDragActive
                              ? "bg-cyan-500/20 border-2 border-cyan-500"
                              : "bg-gray-800 border-2 border-gray-700"
                          }
                        `}
                      >
                        {isDragActive ? (
                          <Upload className="w-8 h-8 text-cyan-400" />
                        ) : (
                          <Scan className="w-8 h-8 text-gray-400" />
                        )}
                      </motion.div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-white mb-2">
                        {isDragActive
                          ? "Drop your invoice here"
                          : "Upload Invoice for OCR"}
                      </h3>
                      <p className="text-gray-400 mb-4">
                        {isDragActive
                          ? "Release to upload"
                          : "Drag & drop an invoice image, or click to select"}
                      </p>
                    </div>

                    <div className="flex flex-wrap justify-center gap-2 mb-4">
                      {accept.map((type) => (
                        <Badge
                          key={type}
                          variant="secondary"
                          className="bg-gray-800 text-gray-300"
                        >
                          {type.split("/")[1].toUpperCase()}
                        </Badge>
                      ))}
                    </div>

                    <p className="text-sm text-gray-500">
                      Maximum file size: {maxSize}MB
                    </p>

                    {!isProcessing && (
                      <Button
                        type="button"
                        variant="outline"
                        className="mt-4 border-cyan-500 text-cyan-400 hover:bg-cyan-500/10"
                      >
                        <Camera className="w-4 h-4 mr-2" />
                        Choose File
                      </Button>
                    )}
                  </div>

                  {/* Processing overlay */}
                  {isProcessing && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="absolute inset-0 bg-black/50 flex items-center justify-center"
                    >
                      <div className="text-center">
                        <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                        <p className="text-white text-sm">Processing...</p>
                      </div>
                    </motion.div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <motion.div
            key="preview"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="bg-black/40 border-gray-800/60">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-lg flex items-center justify-center">
                      <FileImage className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">
                        {selectedFile.name}
                      </h3>
                      <p className="text-sm text-gray-400">
                        {formatFileSize(selectedFile.size)} • {selectedFile.type.split("/")[1].toUpperCase()}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Badge
                      variant="secondary"
                      className="bg-green-600/20 text-green-400 border-green-600/30"
                    >
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Ready
                    </Badge>
                    {!isProcessing && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={clearFile}
                        className="text-gray-400 hover:text-white"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>

                {/* Image preview */}
                {previewUrl && (
                  <div className="relative bg-gray-900 rounded-lg overflow-hidden">
                    <img
                      src={previewUrl}
                      alt="Invoice preview"
                      className="w-full max-h-64 object-contain"
                    />
                    <div className="absolute top-2 right-2">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => window.open(previewUrl, "_blank")}
                        className="bg-black/50 hover:bg-black/70"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                )}

                {/* Processing indicator */}
                {isProcessing && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-4 p-4 bg-cyan-900/20 border border-cyan-500/20 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-5 h-5 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
                      <div>
                        <p className="text-white font-medium">
                          Processing Invoice
                        </p>
                        <p className="text-sm text-gray-400">
                          AI is extracting data from your invoice...
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error display */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="bg-red-900/20 border-red-500/30">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                  <div>
                    <p className="text-red-400 font-medium">Upload Error</p>
                    <p className="text-sm text-red-300">{error}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setError(null)}
                    className="text-red-400 hover:text-red-300 ml-auto"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}