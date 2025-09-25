"use client";

import React from "react";
import { Button } from "@/components/ui/button";

interface AppSectionProps {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  actions?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
}

export default function AppSection({
  title,
  subtitle,
  actions,
  children,
  className,
}: AppSectionProps) {
  return (
    <section className={"mb-8 sm:mb-10 lg:mb-12 " + (className || "")}>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-5">
        <div className="min-w-0">
          <h2 className="display-3 mt-0 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-blue-300 to-blue-200 whitespace-nowrap blue-glow-text">
            {title}
          </h2>
          {subtitle && (
            <p className="text-gray-400 text-lg md:text-xl mt-1">{subtitle}</p>
          )}
        </div>
        {actions && (
          <div className="flex items-center gap-2 sm:gap-3 self-center">
            {actions}
          </div>
        )}
      </div>
      <div className="card-glow rounded-3xl p-4 sm:p-5">{children}</div>
    </section>
  );
}
