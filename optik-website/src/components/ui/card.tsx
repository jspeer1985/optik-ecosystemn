'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface CardProps {
  children: React.ReactNode
  className?: string
  hover?: boolean
  glow?: boolean
  gradient?: boolean
}

export function Card({ children, className = '', hover = true, glow = false, gradient = false }: CardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={hover ? { y: -4, scale: 1.02 } : undefined}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={cn(
        'glass rounded-2xl border border-white/10 backdrop-blur-sm transition-all duration-300',
        hover && 'hover:border-cyan-400/30 hover:shadow-xl hover:shadow-cyan-500/10',
        glow && 'shadow-lg shadow-cyan-500/20',
        gradient && 'bg-gradient-to-br from-white/5 to-white/10',
        className
      )}
    >
      {children}
    </motion.div>
  )
}

interface CardHeaderProps {
  children: React.ReactNode
  className?: string
  center?: boolean
}

export function CardHeader({ children, className = '', center = false }: CardHeaderProps) {
  return (
    <div className={cn(
      'px-6 py-5 border-b border-white/10',
      center && 'text-center',
      className
    )}>
      {children}
    </div>
  )
}

interface CardContentProps {
  children: React.ReactNode
  className?: string
  padding?: 'none' | 'sm' | 'md' | 'lg'
}

export function CardContent({ children, className = '', padding = 'md' }: CardContentProps) {
  const paddingClasses = {
    none: '',
    sm: 'p-4',
    md: 'p-6', 
    lg: 'p-8'
  }
  
  return (
    <div className={cn(paddingClasses[padding], className)}>
      {children}
    </div>
  )
}

interface CardFooterProps {
  children: React.ReactNode
  className?: string
  center?: boolean
}

export function CardFooter({ children, className = '', center = false }: CardFooterProps) {
  return (
    <div className={cn(
      'px-6 py-4 border-t border-white/10 bg-white/5 rounded-b-2xl',
      center && 'text-center',
      className
    )}>
      {children}
    </div>
  )
}