"use client";

import { useState } from "react";
import { SectionWrapper } from "@/components/ui/section-wrapper";
import { GradientText } from "@/components/ui/gradient-text";
import { PillBadge } from "@/components/ui/pill-badge";
import { AnimatedButton } from "@/components/ui/animated-button";
import { motion } from "framer-motion";
import { Check, Star } from "lucide-react";

const plans = [
  {
    name: "Starter",
    monthlyPrice: 2499,
    annualPrice: 24990,
    description: "Perfect for small businesses and freelancers",
    features: [
      "Up to 100 invoices/month",
      "Basic AI analysis",
      "IPFS document storage",
      "Email support",
      "GST reconciliation",
    ],
    popular: false,
  },
  {
    name: "Professional",
    monthlyPrice: 8499,
    annualPrice: 84990,
    description: "Ideal for growing businesses with advanced needs",
    features: [
      "Up to 1,000 invoices/month",
      "Advanced AI insights",
      "Blockchain verification",
      "Priority support",
      "Multi-currency support",
      "API access",
      "Custom integrations",
    ],
    popular: true,
  },
  {
    name: "Enterprise",
    monthlyPrice: 24999,
    annualPrice: 249990,
    description: "For large organizations with complex requirements",
    features: [
      "Unlimited invoices",
      "Custom AI models",
      "Dedicated blockchain nodes",
      "24/7 dedicated support",
      "White-label solutions",
      "Advanced analytics",
      "Custom compliance rules",
      "On-premise deployment",
    ],
    popular: false,
  },
];

export function PricingSection() {
  const [isAnnual, setIsAnnual] = useState(false);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <SectionWrapper className="bg-gray-50/50 dark:bg-gray-900/20">
      <div className="text-center space-y-5 mb-12">
        <PillBadge showArrow={false}>Pricing</PillBadge>
        <h2 className="text-3xl md:text-5xl font-geist font-bold tracking-tighter">
          <GradientText variant="heading">Choose Your </GradientText>
          <GradientText variant="primary">Perfect Plan</GradientText>
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Start free and scale as you grow. All plans include our core AI
          features and blockchain security.
        </p>
        
        {/* Billing Toggle */}
        <div className="flex items-center justify-center space-x-4 mt-8">
          <span className={`text-sm font-medium ${!isAnnual ? 'text-blue-600 dark:text-blue-300' : 'text-gray-500 dark:text-gray-400'}`}>
            Monthly
          </span>
          <button
            onClick={() => setIsAnnual(!isAnnual)}
            className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200 dark:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                isAnnual ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
          <span className={`text-sm font-medium ${isAnnual ? 'text-blue-600 dark:text-blue-300' : 'text-gray-500 dark:text-gray-400'}`}>
            Annual
          </span>
          {isAnnual && (
            <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
              Save 17%
            </span>
          )}
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        {plans.map((plan, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: idx * 0.1 }}
            viewport={{ once: true }}
            className={`group relative p-8 rounded-2xl border-[2px] hover:scale-[1.02] transition-all duration-300 ${
              plan.popular
                ? "bg-white dark:bg-gray-950 border-transparent shadow-lg"
                : "bg-white/80 dark:bg-gray-950/80 backdrop-blur-md border-black/5 dark:border-white/5"
            }`}
          >
            {/* Popular Badge */}
            {plan.popular && (
              <>
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-600/20 to-cyan-500/20 dark:from-blue-300/20 dark:to-sky-200/20 -z-10" />
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <div className="flex items-center space-x-1 bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-3 py-1 rounded-full text-xs font-geist font-bold">
                    <Star className="w-3 h-3 fill-current" />
                    <span>Most Popular</span>
                  </div>
                </div>
                {/* Animated Border */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 dark:from-blue-300 dark:to-sky-200 p-[2px] -z-20">
                  <div className="w-full h-full rounded-2xl bg-white dark:bg-gray-950" />
                </div>
              </>
            )}

            {/* Plan Header */}
            <div className="text-center mb-8">
              <h3 className="font-geist font-bold text-xl mb-2">
                <GradientText variant="primary">{plan.name}</GradientText>
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                {plan.description}
              </p>
              <div className="flex items-end justify-center space-x-1">
                <span className="text-4xl font-geist font-bold">
                  <GradientText variant="primary">
                    {formatPrice(isAnnual ? plan.annualPrice : plan.monthlyPrice)}
                  </GradientText>
                </span>
                <span className="text-gray-500 dark:text-gray-400 mb-1">
                  /{isAnnual ? 'year' : 'month'}
                </span>
              </div>
              {isAnnual && (
                <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {formatPrice(Math.round(plan.annualPrice / 12))}/month when paid annually
                </div>
              )}
            </div>

            {/* Features */}
            <ul className="space-y-3 mb-8">
              {plan.features.map((feature, featureIdx) => (
                <li key={featureIdx} className="flex items-center space-x-3">
                  <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-blue-600/20 to-cyan-500/20 dark:from-blue-300/20 dark:to-sky-200/20 flex items-center justify-center flex-shrink-0">
                    <Check className="w-3 h-3 text-blue-600 dark:text-blue-300" />
                  </div>
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    {feature}
                  </span>
                </li>
              ))}
            </ul>

            {/* CTA Button */}
            <AnimatedButton
              href="/signup"
              className={`w-full justify-center ${
                plan.popular ? "scale-105" : ""
              }`}
            >
              Get Started
            </AnimatedButton>
          </motion.div>
        ))}
      </div>

      {/* Bottom CTA */}
      <div className="text-center mt-12">
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          Need a custom solution? We'd love to hear from you.
        </p>
        <AnimatedButton href="/contact">Contact Sales</AnimatedButton>
      </div>
    </SectionWrapper>
  );
}

export default PricingSection;
