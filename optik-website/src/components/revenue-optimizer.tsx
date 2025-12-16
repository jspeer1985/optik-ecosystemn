'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Zap, DollarSign, TrendingUp, Users, Star, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

interface RevenueOptimizerProps {
  className?: string
}

export function RevenueOptimizer({ className = '' }: RevenueOptimizerProps) {
  const [activeFeature, setActiveFeature] = useState(0)
  const [earnings, setEarnings] = useState({ daily: 0, monthly: 0, total: 0 })

  const features = [
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Instant Deployment",
      description: "Launch your token in 60 seconds and start earning immediately",
      revenue: "$50 fee per token",
      color: "from-cyan-500 to-blue-600"
    },
    {
      icon: <DollarSign className="w-6 h-6" />,
      title: "Trading Fees",
      description: "Earn 0.25% on every trade through your token's liquidity",
      revenue: "Passive income stream",
      color: "from-green-500 to-emerald-600"
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: "AI Optimization",
      description: "OptiK AI maximizes your token's performance and marketing",
      revenue: "+300% avg. ROI",
      color: "from-rose-500 to-pink-600"
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Referral Program",
      description: "Earn 20% commission on every referral you bring",
      revenue: "Up to $1,000/month",
      color: "from-orange-500 to-red-600"
    }
  ]

  useEffect(() => {
    // Simulate real-time earnings counter
    const interval = setInterval(() => {
      setEarnings(prev => ({
        daily: prev.daily + Math.random() * 50,
        monthly: prev.monthly + Math.random() * 200,
        total: prev.total + Math.random() * 100
      }))
    }, 2000)

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    // Auto-cycle through features
    const interval = setInterval(() => {
      setActiveFeature(prev => (prev + 1) % features.length)
    }, 4000)

    return () => clearInterval(interval)
  }, [features.length])

  return (
    <div className={className}>
      {/* Real-time Earnings Display */}
      <Card className="mb-8 bg-gradient-to-r from-green-500/10 to-emerald-500/10 border-green-400/20" glow>
        <CardContent className="text-center">
          <h3 className="text-xl font-semibold mb-4 text-green-400">Platform Earnings (Live)</h3>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <div className="text-2xl font-bold text-white">
                ${earnings.daily.toLocaleString('en-US', { maximumFractionDigits: 0 })}
              </div>
              <div className="text-sm text-gray-400">Today</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-white">
                ${earnings.monthly.toLocaleString('en-US', { maximumFractionDigits: 0 })}
              </div>
              <div className="text-sm text-gray-400">This Month</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-white">
                $2.4M
              </div>
              <div className="text-sm text-gray-400">Total Volume</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Interactive Revenue Features */}
      <div className="grid lg:grid-cols-2 gap-8 mb-8">
        <div>
          <h3 className="text-2xl font-bold mb-6 gradient-text">Revenue Streams</h3>
          <div className="space-y-4">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className={`p-4 rounded-lg cursor-pointer transition-all duration-300 border ${
                  activeFeature === index
                    ? 'border-cyan-400/50 bg-cyan-500/10'
                    : 'border-white/10 bg-white/5 hover:border-white/20'
                }`}
                onClick={() => setActiveFeature(index)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-lg bg-gradient-to-r ${feature.color}`}>
                    {feature.icon}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-white">{feature.title}</h4>
                    <p className="text-sm text-gray-400 mt-1">{feature.description}</p>
                    <div className="text-cyan-400 font-medium mt-2">{feature.revenue}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Feature Showcase */}
        <div className="relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeFeature}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Card className={`bg-gradient-to-br ${features[activeFeature].color}/10 border-none`}>
                <CardContent className="text-center">
                  <div className={`w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r ${features[activeFeature].color} flex items-center justify-center`}>
                    {React.cloneElement(features[activeFeature].icon, { className: 'w-8 h-8 text-white' })}
                  </div>
                  <h3 className="text-2xl font-bold mb-4">{features[activeFeature].title}</h3>
                  <p className="text-gray-300 mb-6">{features[activeFeature].description}</p>
                  <div className="text-3xl font-bold text-white mb-6">
                    {features[activeFeature].revenue}
                  </div>
                  <Button 
                    variant="gradient" 
                    className="w-full" 
                    icon={<ArrowRight />}
                    iconPosition="right"
                  >
                    Start Earning Now
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Success Stories */}
      <Card className="bg-gradient-to-r from-rose-500/10 to-pink-500/10 border-rose-400/20">
        <CardContent>
          <h3 className="text-xl font-semibold mb-6 text-center">Success Stories</h3>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              { name: "Alex M.", earned: "$12,500", time: "30 days", tokens: 5 },
              { name: "Sarah K.", earned: "$8,900", time: "21 days", tokens: 3 },
              { name: "Mike D.", earned: "$15,300", time: "45 days", tokens: 7 }
            ].map((story, index) => (
              <div key={index} className="text-center p-4 bg-white/5 rounded-lg">
                <div className="flex items-center justify-center gap-1 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <div className="text-lg font-bold text-green-400">{story.earned}</div>
                <div className="text-sm text-gray-400">in {story.time}</div>
                <div className="text-xs text-gray-500">{story.tokens} tokens launched</div>
                <div className="text-sm font-medium text-white mt-2">"{story.name}"</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Call-to-Action */}
      <div className="text-center mt-8">
        <Button 
          variant="revenue" 
          size="xl" 
          className="font-bold text-xl px-12 py-4"
          pulse
          glow
        >
          🚀 Launch Your First Token - $25 (50% OFF)
        </Button>
        <p className="text-sm text-gray-400 mt-3">
          ⏰ Limited time offer • 🔥 Join 12,450+ successful creators
        </p>
      </div>
    </div>
  )
}