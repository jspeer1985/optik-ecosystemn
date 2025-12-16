'use client'

import React from 'react'
import { motion, HTMLMotionProps } from 'framer-motion'
import { Loader, ArrowRight, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success' | 'gradient' | 'revenue'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  loading?: boolean
  icon?: React.ReactNode
  iconPosition?: 'left' | 'right'
  pulse?: boolean
  glow?: boolean
  children: React.ReactNode
}

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  iconPosition = 'left',
  pulse = false,
  glow = false,
  className = '',
  children,
  disabled,
  ...props
}: ButtonProps) {
  const baseClasses = 'inline-flex items-center justify-center rounded-lg font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#0f0f23] disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group'
  
  const variantClasses = {
    primary: 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:shadow-[0_0_30px_rgba(0,240,255,0.5)] focus:ring-cyan-500 border-0',
    secondary: 'bg-white/10 text-white border border-white/20 hover:bg-white/20 hover:border-cyan-400/50 backdrop-blur-sm focus:ring-cyan-400',
    outline: 'border border-cyan-400/50 text-cyan-400 hover:bg-cyan-400/10 hover:border-cyan-400 focus:ring-cyan-500 bg-transparent',
    ghost: 'text-white hover:bg-white/10 focus:ring-gray-500 border-0 bg-transparent',
    danger: 'bg-gradient-to-r from-red-500 to-red-600 text-white hover:shadow-[0_0_20px_rgba(239,68,68,0.5)] focus:ring-red-500 border-0',
    success: 'bg-gradient-to-r from-green-500 to-green-600 text-white hover:shadow-[0_0_20px_rgba(34,197,94,0.5)] focus:ring-green-500 border-0',
    gradient: 'bg-gradient-to-r from-cyan-400 via-blue-500 to-magenta-500 text-white hover:shadow-[0_0_30px_rgba(139,92,246,0.5)] focus:ring-rose-500 border-0',
    revenue: 'bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 text-white font-bold hover:shadow-[0_0_25px_rgba(251,191,36,0.6)] focus:ring-yellow-500 border-0 animate-pulse'
  }
  
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm gap-1',
    md: 'px-4 py-2.5 text-base gap-2',
    lg: 'px-6 py-3 text-lg gap-2',
    xl: 'px-8 py-4 text-xl gap-3'
  }

  const renderIcon = () => {
    if (loading) return <Loader size={size === 'sm' ? 14 : size === 'lg' ? 20 : size === 'xl' ? 24 : 16} className="animate-spin" />
    if (variant === 'revenue' && !icon) return <Sparkles size={size === 'sm' ? 14 : size === 'lg' ? 20 : size === 'xl' ? 24 : 16} />
    return icon
  }

  const motionProps = {
    whileHover: { scale: glow ? 1.05 : 1.02, y: -1 },
    whileTap: { scale: 0.98 },
    transition: { type: "spring", stiffness: 400, damping: 25 }
  }

  return (
    <motion.button
      {...motionProps}
      className={cn(
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        pulse && 'animate-pulse',
        glow && 'hover:shadow-2xl',
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {/* Shimmer effect for revenue variant */}
      {variant === 'revenue' && (
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
      )}
      
      {renderIcon() && iconPosition === 'left' && (
        <span className={loading ? '' : 'group-hover:rotate-12 transition-transform'}>
          {renderIcon()}
        </span>
      )}
      
      <span className="relative z-10">
        {loading ? 'Processing...' : children}
      </span>
      
      {renderIcon() && iconPosition === 'right' && (
        <span className={loading ? '' : 'group-hover:translate-x-1 transition-transform'}>
          {renderIcon() || <ArrowRight size={size === 'sm' ? 14 : size === 'lg' ? 20 : size === 'xl' ? 24 : 16} />}
        </span>
      )}
    </motion.button>
  )
}