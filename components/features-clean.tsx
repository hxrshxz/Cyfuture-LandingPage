"use client";

import { SectionWrapper } from "@/components/ui/section-wrapper";
import { GradientText } from "@/components/ui/gradient-text";
import { PillBadge } from "@/components/ui/pill-badge";
import { motion } from "framer-motion";
import {
  Shield,
  Zap,
  Database,
  TrendingUp,
  FileCheck,
  Globe,
} from "lucide-react";

const features = [
  {
    icon: Shield,
    title: "Blockchain Security",
    description:
      "Every document and transaction is cryptographically secured on the Solana blockchain, ensuring immutable audit trails.",
  },
  {
    icon: Zap,
    title: "AI-Powered Analysis",
    description:
      "Advanced machine learning algorithms automatically extract data and analyze financial patterns with 99% accuracy.",
  },
  {
    icon: Database,
    title: "IPFS Storage",
    description:
      "Decentralized storage ensures your documents are always accessible and tamper-proof across the network.",
  },
  {
    icon: TrendingUp,
    title: "Smart Analytics",
    description:
      "Real-time insights and predictive analytics help you make informed financial decisions.",
  },
  {
    icon: FileCheck,
    title: "GST Reconciliation",
    description:
      "Automated GST matching and reconciliation with government portals for seamless compliance.",
  },
  {
    icon: Globe,
    title: "Global Compliance",
    description:
      "Support for multiple tax jurisdictions and international accounting standards.",
  },
];

export function FeaturesSection() {
  return (
    <SectionWrapper className="bg-gray-50/50 dark:bg-gray-900/20">
      <div className="text-center space-y-5 mb-12">
        <PillBadge showArrow={false}>Features</PillBadge>
        <h2 className="text-3xl md:text-5xl font-geist font-bold tracking-tighter">
          <GradientText variant="heading">
            Built for the Future of{" "}
          </GradientText>
          <GradientText variant="primary">Finance</GradientText>
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Experience next-generation financial technology with AI-driven
          automation and blockchain-secured verification.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {features.map((feature, idx) => {
          const Icon = feature.icon;
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              viewport={{ once: true }}
              className="group p-6 rounded-2xl bg-gradient-to-tr from-zinc-300/10 via-gray-400/10 to-transparent dark:from-zinc-300/5 dark:via-gray-400/5 border-[2px] border-black/5 dark:border-white/5 hover:scale-[1.02] hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-300"
            >
              <div className="mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-blue-600/20 to-cyan-500/20 dark:from-blue-300/20 dark:to-sky-200/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Icon className="w-6 h-6 text-blue-600 dark:text-blue-300" />
                </div>
              </div>

              <h3 className="text-xl font-geist font-bold mb-3">
                <GradientText variant="primary">{feature.title}</GradientText>
              </h3>

              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          );
        })}
      </div>
    </SectionWrapper>
  );
}

export default FeaturesSection;
