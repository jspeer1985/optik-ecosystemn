'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Users, DollarSign, TrendingUp, Zap, Star, Trophy, Target } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

interface ConversionFunnelProps {
  className?: string
}

export function ConversionFunnel({ className = '' }: ConversionFunnelProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [conversionData, setConversionData] = useState({
    visitors: 10000,
    signups: 2500,
    trials: 1200,
    purchases: 450
  })

  const funnelSteps = [
    {
      icon: <Users className="w-6 h-6" />,
      title: "Discover OptiK",
      description: "Learn about token creation platform",
      count: conversionData.visitors,
      percentage: 100,
      color: "from-blue-400 to-blue-600"
    },
    {
      icon: <Target className="w-6 h-6" />,
      title: "Sign Up Free",
      description: "Create account and explore features",
      count: conversionData.signups,
      percentage: Math.round((conversionData.signups / conversionData.visitors) * 100),
      color: "from-green-400 to-green-600"
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Try Demo", 
      description: "Test token creation process",
      count: conversionData.trials,
      percentage: Math.round((conversionData.trials / conversionData.visitors) * 100),
      color: "from-rose-400 to-rose-600"
    },
    {
      icon: <DollarSign className="w-6 h-6" />,
      title: "Launch Token",
      description: "Pay $50 and deploy to Solana",
      count: conversionData.purchases,
      percentage: Math.round((conversionData.purchases / conversionData.visitors) * 100),
      color: "from-yellow-400 to-orange-600"
    }
  ]

  const socialProof = [
    { metric: "$2.4M+", label: "Total Volume", icon: <TrendingUp /> },
    { metric: "12,450+", label: "Active Users", icon: <Users /> },
    { metric: "156", label: "Tokens Launched", icon: <Zap /> },
    { metric: "4.9/5", label: "User Rating", icon: <Star /> }
  ]

  const urgencyIndicators = [
    "🔥 5 people launched tokens in the last hour",
    "⚡ 23 users currently designing tokens", 
    "💎 $45,000 earned by users today",
    "🚀 Limited 50% discount ending soon"
  ]

  const [urgencyIndex, setUrgencyIndex] = useState(0)

  useEffect(() => {
    // Cycle through urgency indicators
    const interval = setInterval(() => {
      setUrgencyIndex(prev => (prev + 1) % urgencyIndicators.length)
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    // Auto-advance through funnel steps
    const interval = setInterval(() => {
      setCurrentStep(prev => (prev + 1) % funnelSteps.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className={className}>
      {/* Social Proof Header */}
      <div className="text-center mb-8">
        <motion.div 
          key={urgencyIndex}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-block bg-gradient-to-r from-cyan-500/20 to-rose-500/20 border border-cyan-400/30 rounded-full px-6 py-2 mb-4"
        >
          <span className="text-cyan-400 font-medium">
            {urgencyIndicators[urgencyIndex]}
          </span>
        </motion.div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {socialProof.map((item, index) => (
            <Card key={index} className="text-center" hover={false}>
              <CardContent className="py-4">
                <div className="text-cyan-400 mb-2">{item.icon}</div>
                <div className="text-2xl font-bold text-white">{item.metric}</div>
                <div className="text-sm text-gray-400">{item.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Conversion Funnel Visualization */}
      <Card className="mb-8">
        <CardContent>
          <h3 className="text-2xl font-bold text-center mb-8 gradient-text">
            Join Thousands of Successful Token Creators
          </h3>
          
          <div className="space-y-6">
            {funnelSteps.map((step, index) => {
              const isActive = currentStep === index
              const isCompleted = currentStep > index
              
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`relative p-6 rounded-xl border transition-all duration-500 ${
                    isActive 
                      ? 'border-cyan-400/50 bg-cyan-500/10 scale-105'
                      : isCompleted
                      ? 'border-green-400/30 bg-green-500/5'
                      : 'border-white/10 bg-white/5'
                  }`}
                  style={{
                    width: `${Math.max(20, 100 - (index * 15))}%`,
                    marginLeft: `${index * 7.5}%`
                  }}
                >
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-lg bg-gradient-to-r ${
                      isCompleted ? 'from-green-400 to-green-600' : step.color
                    }`}>
                      {isCompleted ? <Trophy className="w-6 h-6" /> : step.icon}
                    </div>
                    
                    <div className="flex-1">
                      <h4 className="font-semibold text-white text-lg">{step.title}</h4>
                      <p className="text-gray-400 text-sm">{step.description}</p>
                      
                      <div className="mt-2 flex items-center gap-4">
                        <span className="text-2xl font-bold text-white">
                          {step.count.toLocaleString()}
                        </span>
                        <span className={`text-sm font-medium ${
                          step.percentage > 20 ? 'text-green-400' : 'text-yellow-400'
                        }`}>
                          {step.percentage}%
                        </span>
                      </div>
                    </div>
                    
                    {isActive && (
                      <motion.div
                        animate={{ 
                          scale: [1, 1.2, 1],
                          opacity: [0.5, 1, 0.5]
                        }}
                        transition={{ 
                          duration: 2, 
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                        className="w-4 h-4 bg-cyan-400 rounded-full"
                      />
                    )}
                  </div>
                  
                  {/* Progress bar */}
                  <div className="mt-4 h-2 bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${step.percentage}%` }}
                      transition={{ duration: 1, delay: index * 0.1 }}
                      className={`h-full bg-gradient-to-r ${step.color}`}
                    />
                  </div>
                </motion.div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Revenue Potential Calculator */}
      <Card className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border-green-400/20">
        <CardContent>
          <h3 className="text-xl font-semibold text-center mb-6 text-green-400">
            🎯 Your Revenue Potential
          </h3>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">$12,500</div>
              <div className="text-green-400 font-medium mb-1">Average Monthly</div>
              <div className="text-sm text-gray-400">From 3 successful tokens</div>
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">45 Days</div>
              <div className="text-green-400 font-medium mb-1">Break-even Time</div>
              <div className="text-sm text-gray-400">Including platform fees</div>
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">300%</div>
              <div className="text-green-400 font-medium mb-1">Average ROI</div>
              <div className="text-sm text-gray-400">Within first 6 months</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Final CTA */}
      <div className="text-center mt-8">
        <div className="mb-4">
          <span className="text-yellow-400 font-bold text-lg">
            ⏰ Special Launch Offer: 50% OFF
          </span>
        </div>
        
        <Button 
          variant="revenue" 
          size="xl" 
          className="font-bold text-xl px-12 py-4 mb-3"
          pulse
          glow
        >
          🚀 Start Creating Tokens - Only $25
        </Button>
        
        <div className="flex items-center justify-center gap-4 text-sm text-gray-400">
          <span>✅ No hidden fees</span>
          <span>✅ 30-day guarantee</span>
          <span>✅ Free AI assistance</span>
        </div>
        
        <p className="text-xs text-gray-500 mt-2">
          🔒 SSL secured • 💳 Stripe payments • 🛡️ Risk-free trial
        </p>
      </div>
    </div>
  )
}