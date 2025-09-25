"use client";

import { cn } from "@/lib/utils";

interface SectionWrapperProps {
  children: React.ReactNode;
  className?: string;
}

export function SectionWrapper({ children, className }: SectionWrapperProps) {
  return (
    <section className={cn(
      // "relative max-w-full mx-auto",
      className
    )}>
      <div className="max-w-screen-xl mx-auto px-4 py-28 md:px-8">
        {children}
      </div>
    </section>
  );
}