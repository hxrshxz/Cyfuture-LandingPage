"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Edit3,
  Save,
  X,
  CheckCircle,
  AlertTriangle,
  Eye,
  Copy,
  Calendar,
  Building,
  Receipt,
  DollarSign,
  MapPin,
  Hash,
  ShoppingCart,
  Percent,
  FileText,
  Info,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ExtractedInvoiceData } from "@/lib/ocr-service";

interface ExtractedDataDisplayProps {
  data: ExtractedInvoiceData;
  onDataChange: (updatedData: ExtractedInvoiceData) => void;
  onSave: (updatedData: ExtractedInvoiceData) => void;
  onCancel: () => void;
  isEditable?: boolean;
  isSaving?: boolean;
  validationWarnings?: string[];
  validationSuggestions?: string[];
  className?: string;
}

export default function ExtractedDataDisplay({
  data,
  onDataChange,
  onSave,
  onCancel,
  isEditable = true,
  isSaving = false,
  validationWarnings = [],
  validationSuggestions = [],
  className = "",
}: ExtractedDataDisplayProps) {
  const [editingData, setEditingData] = useState<ExtractedInvoiceData>(data);
  const [isEditing, setIsEditing] = useState(false);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  useEffect(() => {
    setEditingData(data);
  }, [data]);

  const handleFieldChange = (field: keyof ExtractedInvoiceData, value: any) => {
    const updatedData = { ...editingData, [field]: value };
    setEditingData(updatedData);
    onDataChange?.(updatedData);
  };

  const handleItemChange = (index: number, field: string, value: any) => {
    if (!editingData.items) return;
    
    const updatedItems = [...editingData.items];
    updatedItems[index] = { ...updatedItems[index], [field]: value };
    
    const updatedData = { ...editingData, items: updatedItems };
    setEditingData(updatedData);
    onDataChange?.(updatedData);
  };

  const addItem = () => {
    const newItem = {
      description: "",
      quantity: 0,
      unit_price: 0,
      total: 0,
    };
    
    const updatedData = {
      ...editingData,
      items: [...(editingData.items || []), newItem],
    };
    setEditingData(updatedData);
    onDataChange?.(updatedData);
  };

  const removeItem = (index: number) => {
    if (!editingData.items) return;
    
    const updatedItems = editingData.items.filter((_, i) => i !== index);
    const updatedData = { ...editingData, items: updatedItems };
    setEditingData(updatedData);
    onDataChange?.(updatedData);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const formatCurrency = (amount: number | undefined, currency = "INR") => {
    if (amount === undefined || amount === null) return "N/A";
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: currency,
    }).format(amount);
  };

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleDateString("en-IN", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  const getConfidenceColor = (score: number | undefined) => {
    if (!score) return "text-gray-400";
    if (score >= 0.8) return "text-green-400";
    if (score >= 0.6) return "text-yellow-400";
    return "text-red-400";
  };

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Extracted Invoice Data</h2>
          <p className="text-gray-400 mt-1">
            Review and edit the extracted information before saving
          </p>
        </div>
        
        {data.confidence_score && (
          <Badge
            variant="secondary"
            className={`${getConfidenceColor(data.confidence_score)} border-current`}
          >
            <Info className="w-3 h-3 mr-1" />
            Confidence: {Math.round(data.confidence_score * 100)}%
          </Badge>
        )}
      </div>

      {/* Validation Messages */}
      <AnimatePresence>
        {(validationWarnings.length > 0 || validationSuggestions.length > 0) && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-3"
          >
            {validationWarnings.length > 0 && (
              <Card className="bg-red-900/20 border-red-500/30">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-red-400 font-medium mb-2">Validation Warnings</p>
                      <ul className="text-sm text-red-300 space-y-1">
                        {validationWarnings.map((warning, index) => (
                          <li key={index}>• {warning}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {validationSuggestions.length > 0 && (
              <Card className="bg-yellow-900/20 border-yellow-500/30">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <Info className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-yellow-400 font-medium mb-2">Suggestions</p>
                      <ul className="text-sm text-yellow-300 space-y-1">
                        {validationSuggestions.map((suggestion, index) => (
                          <li key={index}>• {suggestion}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Information */}
      <Card className="bg-black/40 border-gray-800/60">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Receipt className="w-5 h-5 text-cyan-400" />
            Invoice Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Invoice Number */}
            <div className="space-y-2">
              <Label className="text-gray-300 flex items-center gap-2">
                <Hash className="w-4 h-4" />
                Invoice Number
              </Label>
              <div className="flex items-center gap-2">
                <Input
                  value={editingData.invoice_number || ""}
                  onChange={(e) => handleFieldChange("invoice_number", e.target.value)}
                  disabled={!isEditable}
                  className="bg-gray-800 border-gray-700 text-white"
                />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(editingData.invoice_number || "")}
                  className="text-gray-400 hover:text-white"
                >
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Invoice Date */}
            <div className="space-y-2">
              <Label className="text-gray-300 flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Invoice Date
              </Label>
              <Input
                type="date"
                value={editingData.date || ""}
                onChange={(e) => handleFieldChange("date", e.target.value)}
                disabled={!isEditable}
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>

            {/* Due Date */}
            {(editingData.due_date || isEditable) && (
              <div className="space-y-2">
                <Label className="text-gray-300 flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Due Date
                </Label>
                <Input
                  type="date"
                  value={editingData.due_date || ""}
                  onChange={(e) => handleFieldChange("due_date", e.target.value)}
                  disabled={!isEditable}
                  className="bg-gray-800 border-gray-700 text-white"
                />
              </div>
            )}

            {/* Currency */}
            <div className="space-y-2">
              <Label className="text-gray-300 flex items-center gap-2">
                <DollarSign className="w-4 h-4" />
                Currency
              </Label>
              <Input
                value={editingData.currency || "INR"}
                onChange={(e) => handleFieldChange("currency", e.target.value)}
                disabled={!isEditable}
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Vendor Information */}
      <Card className="bg-black/40 border-gray-800/60">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Building className="w-5 h-5 text-blue-400" />
            Vendor Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label className="text-gray-300">Vendor Name</Label>
            <Input
              value={editingData.vendor_name || ""}
              onChange={(e) => handleFieldChange("vendor_name", e.target.value)}
              disabled={!isEditable}
              className="bg-gray-800 border-gray-700 text-white"
            />
          </div>

          {(editingData.vendor_address || isEditable) && (
            <div className="space-y-2">
              <Label className="text-gray-300 flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Vendor Address
              </Label>
              <Textarea
                value={editingData.vendor_address || ""}
                onChange={(e) => handleFieldChange("vendor_address", e.target.value)}
                disabled={!isEditable}
                className="bg-gray-800 border-gray-700 text-white"
                rows={3}
              />
            </div>
          )}

          {(editingData.vendor_gstin || isEditable) && (
            <div className="space-y-2">
              <Label className="text-gray-300">Vendor GSTIN</Label>
              <Input
                value={editingData.vendor_gstin || ""}
                onChange={(e) => handleFieldChange("vendor_gstin", e.target.value)}
                disabled={!isEditable}
                className="bg-gray-800 border-gray-700 text-white"
                placeholder="15XXXXX1234X1XX"
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Buyer Information */}
      {(editingData.buyer_name || editingData.buyer_address || editingData.buyer_gstin || isEditable) && (
        <Card className="bg-black/40 border-gray-800/60">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Building className="w-5 h-5 text-green-400" />
              Buyer Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label className="text-gray-300">Buyer Name</Label>
              <Input
                value={editingData.buyer_name || ""}
                onChange={(e) => handleFieldChange("buyer_name", e.target.value)}
                disabled={!isEditable}
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>

            {(editingData.buyer_address || isEditable) && (
              <div className="space-y-2">
                <Label className="text-gray-300 flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Buyer Address
                </Label>
                <Textarea
                  value={editingData.buyer_address || ""}
                  onChange={(e) => handleFieldChange("buyer_address", e.target.value)}
                  disabled={!isEditable}
                  className="bg-gray-800 border-gray-700 text-white"
                  rows={3}
                />
              </div>
            )}

            {(editingData.buyer_gstin || isEditable) && (
              <div className="space-y-2">
                <Label className="text-gray-300">Buyer GSTIN</Label>
                <Input
                  value={editingData.buyer_gstin || ""}
                  onChange={(e) => handleFieldChange("buyer_gstin", e.target.value)}
                  disabled={!isEditable}
                  className="bg-gray-800 border-gray-700 text-white"
                  placeholder="15XXXXX1234X1XX"
                />
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Amount Information */}
      <Card className="bg-black/40 border-gray-800/60">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-yellow-400" />
            Amount Breakdown
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Net Amount */}
            {(editingData.net_amount || isEditable) && (
              <div className="space-y-2">
                <Label className="text-gray-300">Net Amount</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={editingData.net_amount || ""}
                  onChange={(e) => handleFieldChange("net_amount", parseFloat(e.target.value) || 0)}
                  disabled={!isEditable}
                  className="bg-gray-800 border-gray-700 text-white"
                />
              </div>
            )}

            {/* Tax Amount */}
            {(editingData.tax_amount || isEditable) && (
              <div className="space-y-2">
                <Label className="text-gray-300 flex items-center gap-2">
                  <Percent className="w-4 h-4" />
                  Tax Amount
                </Label>
                <Input
                  type="number"
                  step="0.01"
                  value={editingData.tax_amount || ""}
                  onChange={(e) => handleFieldChange("tax_amount", parseFloat(e.target.value) || 0)}
                  disabled={!isEditable}
                  className="bg-gray-800 border-gray-700 text-white"
                />
              </div>
            )}

            {/* Total Amount */}
            <div className="space-y-2">
              <Label className="text-gray-300 font-semibold">Total Amount</Label>
              <Input
                type="number"
                step="0.01"
                value={editingData.total_amount || 0}
                onChange={(e) => handleFieldChange("total_amount", parseFloat(e.target.value) || 0)}
                disabled={!isEditable}
                className="bg-gray-800 border-gray-700 text-white font-semibold"
              />
            </div>
          </div>

          {/* Amount Summary */}
          <div className="mt-4 p-4 bg-gray-900/50 rounded-lg">
            <div className="flex items-center justify-between text-lg font-semibold">
              <span className="text-gray-300">Total Payable:</span>
              <span className="text-cyan-400">
                {formatCurrency(editingData.total_amount, editingData.currency)}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Line Items */}
      {(editingData.items && editingData.items.length > 0) && (
        <Card className="bg-black/40 border-gray-800/60">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <ShoppingCart className="w-5 h-5 text-purple-400" />
              Line Items ({editingData.items.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {editingData.items.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 bg-gray-900/50 rounded-lg border border-gray-700"
                >
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-white font-medium">Item {index + 1}</h4>
                    {isEditable && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeItem(index)}
                        className="text-red-400 hover:text-red-300"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                    <div className="md:col-span-2">
                      <Label className="text-gray-300 text-sm">Description</Label>
                      <Input
                        value={item.description || ""}
                        onChange={(e) => handleItemChange(index, "description", e.target.value)}
                        disabled={!isEditable}
                        className="bg-gray-800 border-gray-700 text-white"
                      />
                    </div>
                    <div>
                      <Label className="text-gray-300 text-sm">Quantity</Label>
                      <Input
                        type="number"
                        value={item.quantity || 0}
                        onChange={(e) => handleItemChange(index, "quantity", parseFloat(e.target.value) || 0)}
                        disabled={!isEditable}
                        className="bg-gray-800 border-gray-700 text-white"
                      />
                    </div>
                    <div>
                      <Label className="text-gray-300 text-sm">Unit Price</Label>
                      <Input
                        type="number"
                        step="0.01"
                        value={item.unit_price || 0}
                        onChange={(e) => handleItemChange(index, "unit_price", parseFloat(e.target.value) || 0)}
                        disabled={!isEditable}
                        className="bg-gray-800 border-gray-700 text-white"
                      />
                    </div>
                  </div>
                  
                  <div className="mt-3 flex justify-between items-center">
                    <span className="text-gray-400">Line Total:</span>
                    <span className="text-white font-semibold">
                      {formatCurrency(item.total, editingData.currency)}
                    </span>
                  </div>
                </motion.div>
              ))}

              {isEditable && (
                <Button
                  variant="outline"
                  onClick={addItem}
                  className="w-full border-gray-600 text-gray-300 hover:bg-gray-800"
                >
                  Add Item
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Action Buttons */}
      <div className="flex gap-4 pt-4">
        <Button
          onClick={() => {
            console.log("🔘 Save button clicked");
            console.log("💾 Is saving:", isSaving);
            console.log("⚠️ Validation warnings:", validationWarnings);
            console.log("📊 Editing data:", editingData);
            onSave(editingData);
          }}
          disabled={isSaving || validationWarnings.length > 0}
          className="flex-1 bg-cyan-500 hover:bg-cyan-600 text-white"
        >
          {isSaving ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
              Saving...
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              Save & Store on Blockchain
            </>
          )}
        </Button>
        
        <Button
          variant="outline"
          onClick={onCancel}
          disabled={isSaving}
          className="border-gray-600 text-gray-300 hover:bg-gray-800"
        >
          <X className="w-4 h-4 mr-2" />
          Cancel
        </Button>
      </div>
    </div>
  );
}