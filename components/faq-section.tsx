"use client"

import { useState } from "react"
import { Plus, Minus } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

export function FAQSection() {
  const [openItems, setOpenItems] = useState<number[]>([])

  const toggleItem = (index: number) => {
    setOpenItems((prev) => (prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]))
  }

  const faqs = [
    {
      question: " What is VerifiChain, and how does it fundamentally solve the problem?",
      answer:
          "VerifiChain is a cutting-edge platform that leverages blockchain technology and AI to ensure the integrity and authenticity of financial transactions. By creating immutable records on the blockchain, VerifiChain eliminates the risk of data tampering and fraud, providing a transparent and trustworthy environment for financial operations.",},
    {
      question: ": Why is a blockchain solution better than a purely AI-based one, like ClearTax or Tally?",
      answer:
        " AI-based solutions are excellent at correcting human errors, but they can't prevent a fraudulent document from being created in the first place. Our system is a paradigm shift. We use blockchain to create an unbreakable chain of trust between the buyer and seller. This prevents fraud at its source and moves reconciliation from a reactive, error-correcting task to a proactive, fraud-preventing one. We see ourselves as a commodity killer for the existing market.",
    },
    {
      question: "How does this align with the Indian government's vision for GST?",
      answer:
        "The Indian government is pushing for greater transparency and digitization in financial transactions, especially with the implementation of GST. VerifiChain aligns perfectly with this vision by providing a secure, transparent, and efficient way to manage and verify transactions. Our platform not only facilitates compliance with GST regulations but also enhances the overall integrity of the financial ecosystem in India.",},
    {
      question: "You mentioned off-chain storage. What happens if the off-chain invoice is lost or tampered with?",
      answer:
        "Great question! While the blockchain stores a secure hash of the invoice, the actual document is stored off-chain for efficiency. If the off-chain invoice is lost, the hash on the blockchain still serves as proof that the invoice existed in its original form. If tampered with, the hash verification will fail, alerting users to discrepancies. We also recommend best practices for off-chain storage, such as using secure cloud services with regular backups.",},
    {
      question: "How do you handle the technical complexity and cost of using a blockchain?",
      answer:
        "We understand that blockchain technology can be complex and costly. That's why we've designed VerifiChain to be user-friendly and cost-effective. Our platform abstracts away the technical complexities, allowing users to interact with the blockchain seamlessly through our intuitive interface. Additionally, we utilize efficient consensus mechanisms and layer-2 solutions to minimize transaction costs, making it affordable for businesses of all sizes.",},
  ]

  return (
    <section id="faq" className="relative overflow-hidden pb-120 pt-24">
      {/* Background blur effects */}
      <div className="bg-primary/20 absolute top-1/2 -right-20 z-[-1] h-64 w-64 rounded-full opacity-80 blur-3xl"></div>
      <div className="bg-primary/20 absolute top-1/2 -left-20 z-[-1] h-64 w-64 rounded-full opacity-80 blur-3xl"></div>

      <div className="z-10 container mx-auto px-4">
        <motion.div
          className="flex justify-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="border-primary/40 text-primary inline-flex items-center gap-2 rounded-full border px-3 py-1 uppercase">
            <span>✶</span>
            <span className="text-sm">Faqs</span>
          </div>
        </motion.div>

        <motion.h2
          className="mx-auto mt-6 max-w-xl text-center text-4xl font-medium md:text-[54px] md:leading-[60px]"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
        >
          Questions? We've got{" "}
          <span className="bg-gradient-to-b from-foreground via-rose-200 to-primary bg-clip-text text-transparent">
            answers
          </span>
        </motion.h2>

        <div className="mx-auto mt-12 flex max-w-xl flex-col gap-6">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              className="from-secondary/40 to-secondary/10 rounded-2xl border border-white/10 bg-gradient-to-b p-6 shadow-[0px_2px_0px_0px_rgba(255,255,255,0.1)_inset] transition-all duration-300 hover:border-white/20 cursor-pointer"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => toggleItem(index)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault()
                  toggleItem(index)
                }
              }}
              {...(index === faqs.length - 1 && { "data-faq": faq.question })}
            >
              <div className="flex items-start justify-between">
                <h3 className="m-0 font-medium pr-4">{faq.question}</h3>
                <motion.div
                  animate={{ rotate: openItems.includes(index) ? 180 : 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className=""
                >
                  {openItems.includes(index) ? (
                    <Minus className="text-primary flex-shrink-0 transition duration-300" size={24} />
                  ) : (
                    <Plus className="text-primary flex-shrink-0 transition duration-300" size={24} />
                  )}
                </motion.div>
              </div>
              <AnimatePresence>
                {openItems.includes(index) && (
                  <motion.div
                    className="mt-4 text-muted-foreground leading-relaxed overflow-hidden"
                    initial={{ opacity: 0, height: 0, marginTop: 0 }}
                    animate={{ opacity: 1, height: "auto", marginTop: 16 }}
                    exit={{ opacity: 0, height: 0, marginTop: 0 }}
                    transition={{
                      duration: 0.4,
                      ease: "easeInOut",
                      opacity: { duration: 0.2 },
                    }}
                  >
                    {faq.answer}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
