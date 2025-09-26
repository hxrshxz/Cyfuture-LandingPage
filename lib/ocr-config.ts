"use client";

/**
 * Configuration validation utilities for the OCR system
 */

export interface ConfigValidation {
  isValid: boolean;
  missing: string[];
  warnings: string[];
}

export function validateOCRConfiguration(): ConfigValidation {
  const missing: string[] = [];
  const warnings: string[] = [];

  // Check Gemini API Key
  if (typeof window !== 'undefined') {
    const geminiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    if (!geminiKey) {
      missing.push("NEXT_PUBLIC_GEMINI_API_KEY - Required for OCR functionality");
    } else if (geminiKey.length < 10) {
      warnings.push("Gemini API key appears to be too short");
    }
  }

  return {
    isValid: missing.length === 0,
    missing,
    warnings,
  };
}

export function getSetupInstructions(): string[] {
  return [
    "1. Get a Gemini API key from Google AI Studio (https://makersuite.google.com/app/apikey)",
    "2. Add NEXT_PUBLIC_GEMINI_API_KEY to your .env.local file",
    "3. Restart your development server",
    "4. The OCR functionality will automatically become available",
  ];
}

export function isOCRAvailable(): boolean {
  return validateOCRConfiguration().isValid;
}