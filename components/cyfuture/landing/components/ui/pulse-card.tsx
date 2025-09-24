import { cn } from "../../../../lib/utils"
import { motion } from "framer-motion"
import React from "react"

interface CardHoverEffectProps {
  className?: string
  children?: React.ReactNode
  style?: React.CSSProperties
  title?: string
  description?: string
  icon?: React.ReactNode
  variant?: string
  glowEffect?: boolean
  size?: "sm" | "md" | "lg"
  showGridLines?: boolean
}

export function CardHoverEffect({ 
  className, 
  children, 
  style, 
  title,
  description,
  icon,
  variant,
  glowEffect,
  size = "md",
  showGridLines,
  ...props 
}: CardHoverEffectProps) {
  const sizeClasses = {
    sm: "p-4",
    md: "p-6", 
    lg: "p-8"
  }

  return (
    <motion.div
      className={cn(
        "group relative overflow-hidden rounded-lg border bg-background/60 backdrop-blur-sm hover:scale-105 transition-transform duration-300",
        sizeClasses[size],
        className
      )}
      style={style}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      {...props}
    >
      {/* Glow effect */}
      {glowEffect && (
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      )}
      
      {/* Grid lines */}
      {showGridLines && (
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
      )}
      
      <div className="relative z-10">
        {/* Icon */}
        {icon && (
          <div className="mb-4">
            <div className={cn(
              "inline-flex h-12 w-12 items-center justify-center rounded-md",
              variant === 'rose' ? 'bg-rose-100 text-rose-600' : 'bg-primary/10 text-primary'
            )}>
              {icon}
            </div>
          </div>
        )}
        
        {/* Title */}
        {title && (
          <h3 className="text-xl font-semibold text-foreground mb-2">
            {title}
          </h3>
        )}
        
        {/* Description */}
        {description && (
          <p className="text-sm text-muted-foreground">
            {description}
          </p>
        )}
        
        {/* Children content */}
        {children}
      </div>
    </motion.div>
  )
}
