import { cn } from "../../lib/utils"
import { motion } from "framer-motion"

interface BeamProps {
  className?: string
  children?: React.ReactNode
}

export function Beam({ className, children, ...props }: BeamProps) {
  return (
    <motion.div
      className={cn(
        "relative overflow-hidden rounded-lg bg-gradient-to-br from-background/80 to-background/60 backdrop-blur-sm border border-border/50",
        className
      )}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      {...props}
    >
      <div className="absolute inset-0 bg-grid-pattern opacity-10" />
      <div className="relative z-10 p-6">
        {children}
      </div>
    </motion.div>
  )
}