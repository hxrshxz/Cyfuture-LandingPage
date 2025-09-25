"use client";

import { SectionWrapper } from "@/components/ui/section-wrapper";
import { GradientText } from "@/components/ui/gradient-text";
import { PillBadge } from "@/components/ui/pill-badge";
import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Sarah Chen",
    role: "CFO, TechStart Inc.",
    avatar: "/placeholder-user.jpg",
    content:
      "CyFuture AI transformed our accounting processes. The blockchain verification gives us complete confidence in our financial data.",
    rating: 5,
  },
  {
    name: "Michael Rodriguez",
    role: "Accounting Manager, Global Corp",
    avatar: "/placeholder-user.jpg",
    content:
      "The AI-powered analysis saved us 40+ hours per month on GST reconciliation. It's incredibly accurate and efficient.",
    rating: 5,
  },
  {
    name: "Emily Watson",
    role: "Finance Director, StartupX",
    avatar: "/placeholder-user.jpg",
    content:
      "Having our documents secured on IPFS and verified on blockchain provides unmatched transparency and security.",
    rating: 5,
  },
];

export function TestimonialsSection() {
  return (
    <SectionWrapper>
      <div className="text-center space-y-5 mb-12">
        <PillBadge showArrow={false}>Testimonials</PillBadge>
        <h2 className="text-3xl md:text-5xl font-geist font-bold tracking-tighter">
          <GradientText variant="heading">Trusted by Financial </GradientText>
          <GradientText variant="primary">Professionals</GradientText>
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          See what industry leaders are saying about our AI-powered accounting
          platform.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {testimonials.map((testimonial, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: idx * 0.1 }}
            viewport={{ once: true }}
            className="group relative p-6 rounded-2xl bg-white/80 dark:bg-gray-950/80 backdrop-blur-md border-[2px] border-black/5 dark:border-white/5 hover:shadow-lg hover:shadow-blue-500/10 hover:scale-[1.02] transition-all duration-300"
          >
            {/* Quote Icon */}
            <div className="absolute top-4 right-4 opacity-20">
              <Quote className="w-8 h-8 text-blue-600 dark:text-blue-300" />
            </div>

            {/* Rating */}
            <div className="flex items-center space-x-1 mb-4">
              {[...Array(testimonial.rating)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-blue-500 text-blue-500" />
              ))}
            </div>

            {/* Content */}
            <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
              "{testimonial.content}"
            </p>

            {/* Author */}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-600/20 to-cyan-500/20 dark:from-blue-300/20 dark:to-sky-200/20 flex items-center justify-center">
                <span className="text-sm font-geist font-bold text-blue-600 dark:text-blue-300">
                  {testimonial.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </span>
              </div>
              <div>
                <div className="font-geist font-bold text-sm">
                  <GradientText variant="primary">
                    {testimonial.name}
                  </GradientText>
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {testimonial.role}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </SectionWrapper>
  );
}

export default TestimonialsSection;
