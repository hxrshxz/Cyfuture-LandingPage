"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { PillBadge } from "@/components/ui/pill-badge";
import { GradientText } from "@/components/ui/gradient-text";
import { AnimatedButton } from "@/components/ui/animated-button";
import { SectionWrapper } from "@/components/ui/section-wrapper";

interface HeroSectionProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  subtitle?: {
    regular: string;
    gradient: string;
  };
  description?: string;
  ctaText?: string;
  ctaHref?: string;
}

const HeroSection = React.forwardRef<HTMLDivElement, HeroSectionProps>(
  (
    {
      className,
      // --- START OF REFINED CONTENT ---
      title = "The Future of Accounting is Cryptographically Secured",
      subtitle = {
        regular: "AI-Driven Automation Meets ",
        gradient: "Cryptographic Verification.",
      },
      description = "Experience the future of financial integrity. Our platform's advanced AI engine automates data extraction and risk analysis, while every source document is secured on the decentralized InterPlanetary File System (IPFS). This process culminates in a cryptographically verifiable, tamper-proof audit trail anchored immutably on the Solana blockchain.",
      ctaText = "Launch the App",
      ctaHref = "/login",
      // --- END OF REFINED CONTENT ---
      ...props
    },
    ref
  ) => {
    return (
      <div className={cn("relative", className)} ref={ref} {...props}>
        <SectionWrapper>
          <div className="space-y-5 max-w-3xl leading-0 lg:leading-5 mx-auto text-center">
            <PillBadge>{title}</PillBadge>

            <h2 className="text-4xl tracking-tighter font-geist font-bold mx-auto md:text-6xl">
              <GradientText variant="heading">{subtitle.regular}</GradientText>
              <GradientText variant="primary">{subtitle.gradient}</GradientText>
            </h2>

            <p className="max-w-2xl mx-auto text-gray-600 dark:text-gray-300">
              {description}
            </p>

            <div className="items-center justify-center gap-x-3 space-y-3 sm:flex sm:space-y-0">
              <AnimatedButton href={ctaHref}>{ctaText}</AnimatedButton>
            </div>
          </div>
        </SectionWrapper>
      </div>
    );
  }
);

HeroSection.displayName = "HeroSection";
export default HeroSection;
