import { IBM_Plex_Mono } from "next/font/google";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";

// IBM Plex Mono from Google for code blocks
export const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700"],
  variable: "--font-plex-mono",
  display: "swap",
});

// Utility: class list to apply on html/body if needed (only Plex Mono variable here)
export const appFontsClass = `${plexMono.variable}`;

// Back-compat for landing components importing `geist`
export const geist = GeistSans;
export const geistMono = GeistMono;
