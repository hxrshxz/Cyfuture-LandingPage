"use client";

import { cn } from "@/lib/utils";

interface GradientTextProps {
  children: React.ReactNode;
  className?: string;
  variant?: "primary" | "heading";
}

export function GradientText({
  children,
  className,
  variant = "primary",
}: GradientTextProps) {
  const variants = {
    primary:
      "text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500 dark:from-blue-300 dark:to-sky-200",
    heading:
      "bg-clip-text text-transparent bg-[linear-gradient(180deg,_#000_0%,_rgba(0,_0,_0,_0.75)_100%)] dark:bg-[linear-gradient(180deg,_#FFF_0%,_rgba(255,_255,_255,_0.00)_202.08%)]",
  };

  return <span className={cn(variants[variant], className)}>{children}</span>;
}
