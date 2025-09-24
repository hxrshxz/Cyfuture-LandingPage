"use client"

import { motion } from "framer-motion"
import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Sparkles } from "lucide-react"
import AuthModal from "@/components/AuthModal"
import { useAuth } from "@/contexts/AuthContext"
import { useRouter } from "next/navigation"

export default function Hero() {
  const [mounted, setMounted] = useState(false)
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const { isAuthenticated } = useAuth()
  const router = useRouter()

  const handleGetStarted = () => {
    if (isAuthenticated) {
      router.push('/dashboard')
    } else {
      setIsAuthModalOpen(true)
    }
  }

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <>
      <section className="relative overflow-hidden min-h-screen flex flex-col bg-gradient-to-br from-slate-950 via-black to-slate-900">
        {/* Enhanced Background Elements */}
        <div className="absolute inset-0 z-0">
          {/* Floating Orbs with More Spacing */}
          <motion.div
            animate={{ 
              x: [0, 100, 0], 
              y: [0, -50, 0],
              scale: [1, 1.2, 1] 
            }}
            transition={{ 
              duration: 20, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
            className="absolute top-1/4 left-1/4 w-80 h-80 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-full blur-3xl"
          />
          <motion.div
            animate={{ 
              x: [0, -80, 0], 
              y: [0, 60, 0],
              scale: [1, 0.8, 1] 
            }}
            transition={{ 
              duration: 25, 
              repeat: Infinity, 
              ease: "easeInOut",
              delay: 5
            }}
            className="absolute top-1/3 right-1/4 w-64 h-64 bg-gradient-to-r from-purple-500/15 to-pink-500/15 rounded-full blur-3xl"
          />
          <motion.div
            animate={{ 
              x: [0, 50, 0], 
              y: [0, -30, 0],
              scale: [1, 1.1, 1] 
            }}
            transition={{ 
              duration: 18, 
              repeat: Infinity, 
              ease: "easeInOut",
              delay: 10
            }}
            className="absolute bottom-1/3 left-1/3 w-72 h-72 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 rounded-full blur-3xl"
          />
          
          {/* Enhanced Grid Pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:120px_120px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]" />
        </div>

        <div className="container mx-auto px-8 py-40 sm:py-56 relative z-10 flex-1 flex flex-col max-w-8xl">
          <div className="mx-auto max-w-7xl text-center flex-1 flex flex-col justify-center">
            
            {/* Floating Badge with Enhanced Animation */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="mb-20"
            >
              <motion.div
                animate={{ y: [0, -15, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="inline-block"
              >
                <Badge variant="secondary" className="inline-flex items-center gap-4 px-8 py-4 text-base bg-gradient-to-r from-slate-800/80 to-slate-700/80 border border-slate-600/50 backdrop-blur-sm shadow-2xl rounded-2xl">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                  >
                    <Sparkles className="h-5 w-5 text-cyan-400" />
                  </motion.div>
                  AI-Powered Financial Assistant
                </Badge>
              </motion.div>
            </motion.div>

            {/* Enhanced Main Heading with Dramatic Spacing */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, delay: 0.3, ease: "easeOut" }}
              className="mb-28"
            >
              <h1 className="text-6xl font-extrabold tracking-tight sm:text-8xl lg:text-9xl xl:text-[10rem] leading-[0.9] space-y-8">
                <motion.div
                  initial={{ opacity: 0, x: -100 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 1, delay: 0.5 }}
                  className="block text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-slate-300"
                >
                  Transform Your
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, x: 100 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 1, delay: 0.7 }}
                  className="block bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent"
                >
                  Financial Future
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1, delay: 0.9 }}
                  className="block text-slate-300 italic font-light text-4xl sm:text-6xl lg:text-7xl xl:text-8xl"
                >
                  with AI Intelligence
                </motion.div>
              </h1>
            </motion.div>

            {/* Enhanced Description with Generous Spacing */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 1.1 }}
              className="mx-auto mb-32 max-w-5xl space-y-12"
            >
              <p className="text-2xl sm:text-3xl lg:text-4xl text-slate-300 leading-relaxed font-light">
                Experience the next generation of financial management with our AI-powered assistant.
              </p>
              <p className="text-xl sm:text-2xl text-slate-400 leading-relaxed max-w-4xl mx-auto">
                Advanced analytics, intelligent insights, and seamless blockchain integration 
                to revolutionize how you manage your finances and investments.
              </p>
            </motion.div>

            {/* Enhanced CTA Section with Dramatic Spacing */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 1.3 }}
              className="flex flex-col items-center gap-20"
            >
              {/* Spectacular CTA Button */}
              <div className="relative group">
                {/* Multiple Glowing Layers */}
                <div className="absolute -inset-2 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 rounded-3xl blur-xl opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-pulse"></div>
                <div className="absolute -inset-1 bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-500 rounded-3xl blur-lg opacity-50 group-hover:opacity-75 transition duration-1000"></div>
                
                <button 
                  onClick={handleGetStarted}
                  className="relative bg-black border border-slate-600/50 rounded-3xl px-16 py-8 text-white font-bold text-xl hover:bg-slate-900 transition-all duration-500 flex items-center gap-6 group-hover:scale-105 shadow-2xl"
                >
                  <div className="flex items-center gap-6">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                      className="w-8 h-8"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="32"
                        height="32"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="w-8 h-8 text-cyan-400"
                      >
                        <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                      </svg>
                    </motion.div>
                    <span className="bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                      {isAuthenticated ? "Go to Dashboard" : "Launch AI Assistant"}
                    </span>
                    <motion.div
                      className="w-8 h-8 text-cyan-400"
                      animate={{ x: [0, 8, 0] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="32"
                        height="32"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M5 12h14" />
                        <path d="m12 5 7 7-7 7" />
                      </svg>
                    </motion.div>
                  </div>
                </button>
              </div>

              {/* Feature Highlights with Enhanced Spacing */}
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 1.5 }}
                className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-6xl mx-auto"
              >
                <div className="text-center p-8 bg-gradient-to-b from-slate-800/50 to-slate-900/50 rounded-3xl border border-slate-700/50 backdrop-blur-sm hover:scale-105 transition-transform duration-300">
                  <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-2xl flex items-center justify-center">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-4">Smart Analytics</h3>
                  <p className="text-slate-400 leading-relaxed">AI-powered insights for your financial data with predictive modeling</p>
                </div>

                <div className="text-center p-8 bg-gradient-to-b from-slate-800/50 to-slate-900/50 rounded-3xl border border-slate-700/50 backdrop-blur-sm hover:scale-105 transition-transform duration-300">
                  <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-4">Secure Blockchain</h3>
                  <p className="text-slate-400 leading-relaxed">Enterprise-grade security with Web3 integration and smart contracts</p>
                </div>

                <div className="text-center p-8 bg-gradient-to-b from-slate-800/50 to-slate-900/50 rounded-3xl border border-slate-700/50 backdrop-blur-sm hover:scale-105 transition-transform duration-300">
                  <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-4">Real-time Processing</h3>
                  <p className="text-slate-400 leading-relaxed">Instant financial calculations and reporting with live market data</p>
                </div>
              </motion.div>
            </motion.div>
          </div>

          {/* Enhanced Social Proof Section */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.7 }}
            className="mt-32 pb-20"
          >
            <div className="text-center">
              <p className="text-slate-400 text-lg font-medium tracking-wider uppercase mb-12">
                Trusted by Financial Professionals Worldwide
              </p>
              <div className="flex items-center justify-center space-x-16 opacity-70">
                <div className="flex items-center space-x-4 hover:opacity-100 transition-opacity duration-300">
                  <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-2xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                    </svg>
                  </div>
                  <span className="text-slate-300 font-semibold text-lg">FinTech Pro</span>
                </div>
                <div className="flex items-center space-x-4 hover:opacity-100 transition-opacity duration-300">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                    </svg>
                  </div>
                  <span className="text-slate-300 font-semibold text-lg">CryptoVault</span>
                </div>
                <div className="flex items-center space-x-4 hover:opacity-100 transition-opacity duration-300">
                  <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M9 11H7l5-5 5 5h-2v5H9v-5zm5 7H7l2.5-2.5L11 17l1.5-1.5L15 18zm-2.5-8.5L10 8l1.5-1.5L13 8l-1.5 1.5z"/>
                    </svg>
                  </div>
                  <span className="text-slate-300 font-semibold text-lg">InvestAI</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
      
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
        initialMode="login" 
      />
    </>
  )
}
