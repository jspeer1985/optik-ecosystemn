'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useWallet } from '@solana/wallet-adapter-react'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Card, CardContent, CardHeader } from '../ui/card'
import { Coins, Upload, Palette, Settings } from 'lucide-react'

interface TokenFormData {
  name: string
  symbol: string
  description: string
  totalSupply: string
  decimals: string
  image: File | null
}

interface CreateTokenFormProps {
  onSubmit?: (data: any) => void | Promise<void>;
}

export function CreateTokenForm({ onSubmit }: CreateTokenFormProps = {}) {
  const { connected } = useWallet()
  const [formData, setFormData] = useState<TokenFormData>({
    name: '',
    symbol: '',
    description: '',
    totalSupply: '1000000',
    decimals: '9',
    image: null
  })
  const [isCreating, setIsCreating] = useState(false)
  const [step, setStep] = useState(1)

  const handleInputChange = (field: keyof TokenFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setFormData(prev => ({ ...prev, image: file }))
    }
  }

  const handleCreateToken = async () => {
    if (!connected) return

    setIsCreating(true)
    try {
      if (onSubmit) {
        await onSubmit(formData)
      } else {
        const response = await fetch('/api/incoin/create', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        })

        if (response.ok) {
          const result = await response.json()
          console.log('Token created:', result)
          // Reset form or redirect
        }
      }
    } catch (error) {
      console.error('Error creating token:', error)
    } finally {
      setIsCreating(false)
    }
  }

  const steps = [
    { title: 'Basic Info', icon: Coins },
    { title: 'Token Image', icon: Upload },
    { title: 'Customize', icon: Palette },
    { title: 'Review', icon: Settings }
  ]

  return (
    <div className="max-w-2xl mx-auto">
      {/* Step Progress */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {steps.map((stepInfo, index) => {
            const StepIcon = stepInfo.icon
            const stepNumber = index + 1
            const isActive = step === stepNumber
            const isCompleted = step > stepNumber

            return (
              <div key={stepNumber} className="flex items-center">
                <motion.div
                  animate={{
                    backgroundColor: isCompleted ? '#10b981' : isActive ? '#3b82f6' : '#e5e7eb',
                    color: isCompleted || isActive ? '#ffffff' : '#6b7280'
                  }}
                  className="flex items-center justify-center w-10 h-10 rounded-full border-2 border-gray-300"
                >
                  <StepIcon className="h-5 w-5" />
                </motion.div>
                <span className={`ml-2 text-sm font-medium ${isActive ? 'text-blue-600' : 'text-gray-500'}`}>
                  {stepInfo.title}
                </span>
                {index < steps.length - 1 && (
                  <div className="w-16 h-0.5 bg-gray-300 mx-4" />
                )}
              </div>
            )
          })}
        </div>
      </div>

      <Card>
        <CardHeader>
          <h2 className="text-2xl font-bold text-center">Create Your Memecoin</h2>
          <p className="text-gray-600 text-center">Launch your token on Solana in minutes</p>
        </CardHeader>
        <CardContent>
          {step === 1 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <Input
                label="Token Name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Enter token name"
              />
              <Input
                label="Token Symbol"
                value={formData.symbol}
                onChange={(e) => handleInputChange('symbol', e.target.value.toUpperCase())}
                placeholder="e.g., DOGE"
                maxLength={10}
              />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Describe your token..."
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Token Image
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors">
                  <Upload className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-600 mb-4">Click to upload or drag and drop</p>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="image-upload"
                  />
                  <label
                    htmlFor="image-upload"
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-blue-700 transition-colors"
                  >
                    Choose File
                  </label>
                  {formData.image && (
                    <p className="mt-2 text-sm text-green-600">
                      ✓ {formData.image.name}
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <Input
                label="Total Supply"
                type="number"
                value={formData.totalSupply}
                onChange={(e) => handleInputChange('totalSupply', e.target.value)}
                placeholder="1000000"
              />
              <Input
                label="Decimals"
                type="number"
                value={formData.decimals}
                onChange={(e) => handleInputChange('decimals', e.target.value)}
                min="0"
                max="18"
              />
            </motion.div>
          )}

          {step === 4 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold mb-4">Review Your Token</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Name:</span>
                    <span className="font-medium">{formData.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Symbol:</span>
                    <span className="font-medium">{formData.symbol}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Supply:</span>
                    <span className="font-medium">{Number(formData.totalSupply).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Decimals:</span>
                    <span className="font-medium">{formData.decimals}</span>
                  </div>
                  {formData.image && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Image:</span>
                      <span className="font-medium text-green-600">✓ Uploaded</span>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          <div className="flex justify-between mt-8">
            <Button
              variant="outline"
              onClick={() => setStep(Math.max(1, step - 1))}
              disabled={step === 1}
            >
              Previous
            </Button>

            {step < 4 ? (
              <Button
                onClick={() => setStep(Math.min(4, step + 1))}
                disabled={!formData.name || !formData.symbol}
              >
                Next
              </Button>
            ) : (
              <Button
                onClick={handleCreateToken}
                loading={isCreating}
                disabled={!connected || !formData.name || !formData.symbol}
              >
                {connected ? 'Create Token' : 'Connect Wallet First'}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}