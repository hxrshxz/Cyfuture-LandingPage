"use client";

import { GoogleGenerativeAI } from "@google/generative-ai";

export interface ExtractedInvoiceData {
  invoice_number: string;
  vendor_name: string;
  vendor_address?: string;
  vendor_gstin?: string;
  buyer_name?: string;
  buyer_address?: string;
  buyer_gstin?: string;
  total_amount: number;
  tax_amount?: number;
  net_amount?: number;
  date: string;
  due_date?: string;
  currency?: string;
  items?: Array<{
    description: string;
    quantity: number;
    unit_price: number;
    total: number;
  }>;
  confidence_score?: number;
}

export interface OCRResult {
  success: boolean;
  data?: ExtractedInvoiceData;
  error?: string;
  processingTime?: number;
}

class InvoiceOCRService {
  private genAI: GoogleGenerativeAI | null = null;

  constructor() {
    const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    if (apiKey) {
      this.genAI = new GoogleGenerativeAI(apiKey);
    } else {
      console.warn("Gemini API key not found. OCR functionality will be limited.");
    }
  }

  /**
   * Convert file to base64 format required by Gemini API
   */
  private async fileToGenerativePart(file: File): Promise<{
    inlineData: { data: string; mimeType: string };
  }> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = (reader.result as string).split(",")[1];
        resolve({
          inlineData: {
            data: base64,
            mimeType: file.type,
          },
        });
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  /**
   * Extract invoice data from image using Gemini Vision API
   */
  async extractInvoiceData(file: File): Promise<OCRResult> {
    const startTime = Date.now();

    try {
      if (!this.genAI) {
        return {
          success: false,
          error: "Gemini API not initialized. Please check your API key.",
        };
      }

      // Validate file type
      const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
      if (!validTypes.includes(file.type)) {
        return {
          success: false,
          error: "Unsupported file type. Please upload a JPG, PNG, or WebP image.",
        };
      }

      // Validate file size (max 20MB for Gemini)
      const maxSize = 20 * 1024 * 1024; // 20MB
      if (file.size > maxSize) {
        return {
          success: false,
          error: "File too large. Please upload an image smaller than 20MB.",
        };
      }

      const model = this.genAI.getGenerativeModel({ model: "gemini-2.5-pro" });

      const imagePart = await this.fileToGenerativePart(file);

      const prompt = `You are an expert OCR system specialized in extracting data from invoices and bills. Analyze this invoice image and extract all relevant information in JSON format.

Please extract the following information and return it as a valid JSON object:

{
  "invoice_number": "string - invoice/bill number",
  "vendor_name": "string - company/vendor name",
  "vendor_address": "string - vendor address (if available)",
  "vendor_gstin": "string - vendor GST number (if available)",
  "buyer_name": "string - buyer/customer name (if available)", 
  "buyer_address": "string - buyer address (if available)",
  "buyer_gstin": "string - buyer GST number (if available)",
  "total_amount": "number - total amount to be paid",
  "tax_amount": "number - total tax amount (GST/VAT) if available",
  "net_amount": "number - amount before tax if available",
  "date": "string - invoice date in YYYY-MM-DD format",
  "due_date": "string - due date in YYYY-MM-DD format (if available)",
  "currency": "string - currency code (INR, USD, etc.)",
  "items": [
    {
      "description": "string - item description",
      "quantity": "number - quantity",
      "unit_price": "number - price per unit", 
      "total": "number - total amount for this item"
    }
  ],
  "confidence_score": "number - your confidence in the extraction (0-1)"
}

Important instructions:
1. Extract all visible text accurately
2. For amounts, extract only numeric values (no currency symbols)
3. For dates, convert to YYYY-MM-DD format
4. If information is not available, use null for that field
5. Provide a confidence score based on image quality and text clarity
6. Return ONLY the JSON object, no additional text or formatting

Analyze the image carefully and extract all relevant invoice information.`;

      const result = await model.generateContent([prompt, imagePart]);
      const response = await result.response;
      const responseText = response.text();

      // Clean and parse the JSON response
      let cleanedResponse = responseText.trim();
      
      // Remove any markdown formatting
      cleanedResponse = cleanedResponse.replace(/```json\n?/g, '').replace(/```\n?/g, '');
      
      // Parse the JSON
      let extractedData: ExtractedInvoiceData;
      try {
        extractedData = JSON.parse(cleanedResponse);
      } catch (parseError) {
        console.error("Failed to parse Gemini response:", cleanedResponse);
        return {
          success: false,
          error: "Failed to parse OCR results. Please try again.",
          processingTime: Date.now() - startTime,
        };
      }

      // Validate required fields
      if (!extractedData.invoice_number || !extractedData.vendor_name || !extractedData.total_amount) {
        return {
          success: false,
          error: "Could not extract essential invoice information. Please ensure the image is clear and contains a valid invoice.",
          processingTime: Date.now() - startTime,
        };
      }

      // Ensure numeric fields are properly typed
      extractedData.total_amount = Number(extractedData.total_amount) || 0;
      extractedData.tax_amount = extractedData.tax_amount ? Number(extractedData.tax_amount) : undefined;
      extractedData.net_amount = extractedData.net_amount ? Number(extractedData.net_amount) : undefined;
      extractedData.confidence_score = extractedData.confidence_score ? Number(extractedData.confidence_score) : 0.8;

      // Process items array if present
      if (extractedData.items && Array.isArray(extractedData.items)) {
        extractedData.items = extractedData.items.map(item => ({
          ...item,
          quantity: Number(item.quantity) || 0,
          unit_price: Number(item.unit_price) || 0,
          total: Number(item.total) || 0,
        }));
      }

      return {
        success: true,
        data: extractedData,
        processingTime: Date.now() - startTime,
      };

    } catch (error) {
      console.error("OCR processing error:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "An unexpected error occurred during OCR processing.",
        processingTime: Date.now() - startTime,
      };
    }
  }

  /**
   * Validate extracted data and suggest corrections
   */
  validateExtractedData(data: ExtractedInvoiceData): {
    isValid: boolean;
    warnings: string[];
    suggestions: string[];
  } {
    const warnings: string[] = [];
    const suggestions: string[] = [];

    // Check required fields
    if (!data.invoice_number) warnings.push("Invoice number is missing");
    if (!data.vendor_name) warnings.push("Vendor name is missing");
    if (!data.total_amount || data.total_amount <= 0) warnings.push("Total amount is invalid");
    if (!data.date) warnings.push("Invoice date is missing");

    // Check date format
    if (data.date && !/^\d{4}-\d{2}-\d{2}$/.test(data.date)) {
      warnings.push("Invoice date format should be YYYY-MM-DD");
    }

    // Check confidence score
    if (data.confidence_score && data.confidence_score < 0.7) {
      suggestions.push("Low confidence score detected. Please verify the extracted data carefully.");
    }

    // Check GST number format (Indian)
    if (data.vendor_gstin && !/^\d{2}[A-Z]{5}\d{4}[A-Z]{1}[A-Z\d]{1}[Z]{1}[A-Z\d]{1}$/.test(data.vendor_gstin)) {
      suggestions.push("Vendor GSTIN format appears incorrect");
    }

    // Check amount consistency
    if (data.net_amount && data.tax_amount && data.total_amount) {
      const calculatedTotal = data.net_amount + data.tax_amount;
      if (Math.abs(calculatedTotal - data.total_amount) > 1) {
        warnings.push("Amount calculation mismatch detected");
      }
    }

    return {
      isValid: warnings.length === 0,
      warnings,
      suggestions,
    };
  }

  /**
   * Check if OCR service is available
   */
  isAvailable(): boolean {
    return this.genAI !== null;
  }
}

export const invoiceOCRService = new InvoiceOCRService();