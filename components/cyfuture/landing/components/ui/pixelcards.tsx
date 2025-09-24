import { cn } from "../../../../lib/utils"
import { motion } from "framer-motion"
import React from "react"

interface CanvasProps {
  gap?: number
  speed?: number
  colors?: string
}

interface PixelCardProps {
  className?: string
  children?: React.ReactNode
  style?: React.CSSProperties
  label?: string
  canvasProps?: CanvasProps
  number?: number
  icon?: string
  desc?: string
  color?: string
}

export function PixelCard({ 
  className, 
  children, 
  style, 
  label,
  canvasProps,
  number,
  icon,
  desc,
  color,
  ...props 
}: PixelCardProps) {
  return (
    <motion.div
      className={cn(
        "relative overflow-hidden rounded-lg border bg-background/60 backdrop-blur-sm p-6",
        className
      )}
      style={style}
      {...props}
    >
      {/* Canvas background effect */}
      {canvasProps && (
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            background: `linear-gradient(45deg, ${canvasProps.colors?.split(',')[0] || '#fff'}, ${canvasProps.colors?.split(',')[1] || '#fda4af'})`
          }}
        />
      )}
      
      <div className="relative z-10">
        {/* Icon */}
        {icon && (
          <div className="mb-4">
            <div className={cn(
              "inline-flex h-10 w-10 items-center justify-center rounded-md text-sm font-medium",
              color === 'rose' ? 'bg-rose-100 text-rose-600' : 'bg-primary/10 text-primary'
            )}>
              {icon}
            </div>
          </div>
        )}
        
        {/* Label */}
        {label && (
          <h3 className="text-lg font-semibold text-foreground mb-2">
            {label}
          </h3>
        )}
        
        {/* Number */}
        {number && (
          <div className="text-3xl font-bold text-foreground mb-2">
            {number}
          </div>
        )}
        
        {/* Description */}
        {desc && (
          <p className="text-sm text-muted-foreground">
            {desc}
          </p>
        )}
        
        {/* Children content */}
        {children}
      </div>
    </motion.div>
  )
}
