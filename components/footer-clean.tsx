"use client";

import Link from "next/link";
import { GradientText } from "@/components/ui/gradient-text";
import { Github, Twitter, Linkedin, Mail, MapPin, Phone } from "lucide-react";

const footerLinks = {
  product: [
    { label: "Features", href: "#features" },
    { label: "Pricing", href: "#pricing" },
    { label: "API", href: "/api" },
    { label: "Documentation", href: "/docs" },
  ],
  company: [
    { label: "About", href: "/about" },
    { label: "Blog", href: "/blog" },
    { label: "Careers", href: "/careers" },
    { label: "Contact", href: "/contact" },
  ],
  resources: [
    { label: "Help Center", href: "/help" },
    { label: "Community", href: "/community" },
    { label: "Status", href: "/status" },
    { label: "Security", href: "/security" },
  ],
  legal: [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
    { label: "Cookie Policy", href: "/cookies" },
    { label: "Compliance", href: "/compliance" },
  ],
};

const socialLinks = [
  { icon: Github, href: "https://github.com/cyfuture", label: "GitHub" },
  { icon: Twitter, href: "https://twitter.com/cyfuture", label: "Twitter" },
  {
    icon: Linkedin,
    href: "https://linkedin.com/company/cyfuture",
    label: "LinkedIn",
  },
  { icon: Mail, href: "mailto:contact@cyfuture.ai", label: "Email" },
];

export function FooterClean() {
  return (
    <footer className="bg-gray-950 dark:bg-gray-900 text-white">
      <div className="max-w-screen-xl mx-auto px-4 md:px-8 py-16">
        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 mb-12">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center space-x-3 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-cyan-500 flex items-center justify-center">
                <span className="text-white font-geist font-bold text-sm">
                  CF
                </span>
              </div>
              <span className="font-geist font-bold text-xl">
                <GradientText variant="primary">CyFuture AI</GradientText>
              </span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              The future of accounting with AI-driven automation and blockchain
              security. Transforming financial integrity through cryptographic
              verification.
            </p>

            {/* Contact Info */}
            <div className="space-y-2 text-sm text-gray-400">
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4" />
                <span>San Francisco, CA</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4" />
                <span>contact@cyfuture.ai</span>
              </div>
            </div>
          </div>

          {/* Links Sections */}
          <div>
            <h3 className="font-geist font-bold text-sm mb-4">
              <GradientText variant="primary">Product</GradientText>
            </h3>
            <ul className="space-y-2">
              {footerLinks.product.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-blue-300 transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-geist font-bold text-sm mb-4">
              <GradientText variant="primary">Company</GradientText>
            </h3>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-blue-300 transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-geist font-bold text-sm mb-4">
              <GradientText variant="primary">Resources</GradientText>
            </h3>
            <ul className="space-y-2">
              {footerLinks.resources.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-blue-300 transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-geist font-bold text-sm mb-4">
              <GradientText variant="primary">Legal</GradientText>
            </h3>
            <ul className="space-y-2">
              {footerLinks.legal.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-blue-300 transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Social Links */}
        <div className="flex items-center justify-center space-x-6 mb-8">
          {socialLinks.map((social) => {
            const Icon = social.icon;
            return (
              <Link
                key={social.href}
                href={social.href}
                className="p-2 rounded-lg bg-gradient-to-tr from-zinc-300/10 via-gray-400/10 to-transparent border-[1px] border-white/10 hover:scale-110 hover:border-blue-500/50 transition-all duration-300"
                aria-label={social.label}
              >
                <Icon className="w-5 h-5 text-gray-400 hover:text-blue-300 transition-colors" />
              </Link>
            );
          })}
        </div>

        {/* Bottom Section */}
        <div className="pt-8 border-t border-gray-800 flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
          <p className="text-gray-400 text-sm">
            © 2025 CyFuture AI. All rights reserved.
          </p>
          <div className="flex items-center space-x-6 text-sm text-gray-400">
            <Link
              href="/privacy"
              className="hover:text-blue-300 transition-colors"
            >
              Privacy
            </Link>
            <Link
              href="/terms"
              className="hover:text-blue-300 transition-colors"
            >
              Terms
            </Link>
            <Link
              href="/cookies"
              className="hover:text-blue-300 transition-colors"
            >
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default FooterClean;
