'use client';

import React, { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { motion } from 'framer-motion';
import {
  Coins,
  DollarSign,
  Rocket,
  AlertTriangle,
  CheckCircle,
  Loader
} from 'lucide-react';
import { CreateTokenForm } from '@/components/memecoin/create-token-form';

export default function CreateToken() {
  const { connected, publicKey } = useWallet();
  const [step, setStep] = useState(1);
  const [tokenData, setTokenData] = useState({
    name: '',
    symbol: '',
    description: '',
    image: '',
    decimals: 9,
    supply: 1000000,
    website: '',
    twitter: '',
    telegram: ''
  });
  const [deploymentStatus, setDeploymentStatus] = useState<'idle' | 'creating' | 'paying' | 'deploying' | 'success' | 'error'>('idle');
  const [mintAddress, setMintAddress] = useState<string | null>(null);
  const [transactionSignature, setTransactionSignature] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const steps = [
    { number: 1, title: 'Token Details', description: 'Basic information about your token' },
    { number: 2, title: 'Review & Pay', description: 'Review details and make payment' },
    { number: 3, title: 'Deploy', description: 'Deploy your token to Solana' },
    { number: 4, title: 'Complete', description: 'Token successfully created' }
  ];

  const handleTokenCreate = async (data: any) => {
    setTokenData(data);
    setStep(2);
  };

  const handlePayment = async () => {
    if (!connected || !publicKey) {
      setError('Please connect your wallet first');
      return;
    }

    setDeploymentStatus('paying');
    setError(null);

    try {
      // Create Stripe checkout session
      const response = await fetch('/api/payment/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: 50, // $50 for basic deployment
          tokenName: tokenData.name,
          tokenSymbol: tokenData.symbol,
          successUrl: `${window.location.origin}/launchpad/create?step=3&session_id={CHECKOUT_SESSION_ID}`,
          cancelUrl: `${window.location.origin}/launchpad/create?step=2`
        })
      });

      const { url } = await response.json();

      if (url) {
        window.location.href = url;
      } else {
        throw new Error('Failed to create payment session');
      }
    } catch (err) {
      console.error('Payment error:', err);
      setError('Failed to initiate payment. Please try again.');
      setDeploymentStatus('error');
    }
  };

  const handleDeploy = async () => {
    if (!connected || !publicKey) {
      setError('Please connect your wallet first');
      return;
    }

    setDeploymentStatus('creating');
    setError(null);

    try {
      // Step 1: Create token
      const createResponse = await fetch('/api/incoin/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...tokenData,
          creatorWallet: publicKey.toString()
        })
      });

      const createData = await createResponse.json();

      if (!createData.success) {
        throw new Error(createData.error || 'Failed to create token');
      }

      setDeploymentStatus('deploying');

      // Step 2: Sign transaction with wallet
      const { solana } = window as any;
      if (!solana?.isPhantom) {
        throw new Error('Phantom wallet not found');
      }

      const transaction = Buffer.from(createData.transaction, 'base64');
      const signedTransaction = await solana.signTransaction(transaction);

      // Step 3: Deploy to Solana
      const deployResponse = await fetch('/api/incoin/deploy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          signedTransaction: Buffer.from(signedTransaction.serialize()).toString('base64'),
          mintKeypair: createData.mintKeypair,
          metadata: createData.metadata,
          creatorWallet: publicKey.toString(),
          tokenData
        })
      });

      const deployData = await deployResponse.json();

      if (!deployData.success) {
        throw new Error(deployData.error || 'Failed to deploy token');
      }

      setMintAddress(deployData.mintAddress);
      setTransactionSignature(deployData.transactionSignature);
      setDeploymentStatus('success');
      setStep(4);

    } catch (err) {
      console.error('Deployment error:', err);
      setError(err instanceof Error ? err.message : 'Failed to deploy token');
      setDeploymentStatus('error');
    }
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="text-center mb-8">
              <Coins size={48} className="mx-auto text-purple-400 mb-4" />
              <h2 className="text-2xl font-bold text-white mb-2">Create Your Token</h2>
              <p className="text-gray-300">Fill in the details for your new memecoin</p>
            </div>
            <CreateTokenForm onSubmit={handleTokenCreate} />
          </motion.div>
        );

      case 2:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="text-center mb-8">
              <DollarSign size={48} className="mx-auto text-green-400 mb-4" />
              <h2 className="text-2xl font-bold text-white mb-2">Review & Payment</h2>
              <p className="text-gray-300">Review your token details and complete payment</p>
            </div>

            {/* Token Preview */}
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Token Preview</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-gray-300 text-sm">Name</label>
                  <p className="text-white font-medium">{tokenData.name}</p>
                </div>
                <div>
                  <label className="text-gray-300 text-sm">Symbol</label>
                  <p className="text-white font-medium">{tokenData.symbol}</p>
                </div>
                <div className="md:col-span-2">
                  <label className="text-gray-300 text-sm">Description</label>
                  <p className="text-white font-medium">{tokenData.description}</p>
                </div>
                <div>
                  <label className="text-gray-300 text-sm">Supply</label>
                  <p className="text-white font-medium">{tokenData.supply.toLocaleString()}</p>
                </div>
                <div>
                  <label className="text-gray-300 text-sm">Decimals</label>
                  <p className="text-white font-medium">{tokenData.decimals}</p>
                </div>
              </div>
            </div>

            {/* Pricing */}
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Deployment Cost</h3>
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Token Creation & Deployment</span>
                <span className="text-2xl font-bold text-white">$50.00</span>
              </div>
              <p className="text-gray-400 text-sm mt-2">
                Includes Solana network fees, metadata storage, and platform service
              </p>
            </div>

            <button
              onClick={handlePayment}
              disabled={deploymentStatus === 'paying'}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 text-white py-4 rounded-xl font-semibold transition-all flex items-center justify-center gap-2"
            >
              {deploymentStatus === 'paying' ? (
                <>
                  <Loader size={20} className="animate-spin" />
                  Processing Payment...
                </>
              ) : (
                <>
                  <DollarSign size={20} />
                  Pay & Continue
                </>
              )}
            </button>
          </motion.div>
        );

      case 3:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="text-center mb-8">
              <Rocket size={48} className="mx-auto text-blue-400 mb-4" />
              <h2 className="text-2xl font-bold text-white mb-2">Deploy Token</h2>
              <p className="text-gray-300">
                {deploymentStatus === 'success'
                  ? 'Token successfully deployed!'
                  : 'Ready to deploy your token to Solana'}
              </p>
            </div>

            {deploymentStatus === 'success' ? (
              <div className="bg-green-500/20 border border-green-500/30 rounded-xl p-6 text-center">
                <CheckCircle size={48} className="mx-auto text-green-400 mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">Deployment Successful!</h3>
                <p className="text-gray-300 mb-4">Your token has been deployed to Solana</p>

                <div className="space-y-2 text-left">
                  <div className="flex justify-between">
                    <span className="text-gray-300">Mint Address:</span>
                    <span className="text-white font-mono text-sm">{mintAddress}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Transaction:</span>
                    <a
                      href={`https://explorer.solana.com/tx/${transactionSignature}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:text-blue-300 font-mono text-sm underline"
                    >
                      View on Explorer
                    </a>
                  </div>
                </div>
              </div>
            ) : (
              <button
                onClick={handleDeploy}
                disabled={deploymentStatus !== 'idle' || !connected}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 text-white py-4 rounded-xl font-semibold transition-all flex items-center justify-center gap-2"
              >
                {deploymentStatus === 'creating' && (
                  <>
                    <Loader size={20} className="animate-spin" />
                    Creating Token...
                  </>
                )}
                {deploymentStatus === 'deploying' && (
                  <>
                    <Loader size={20} className="animate-spin" />
                    Deploying to Solana...
                  </>
                )}
                {deploymentStatus === 'idle' && (
                  <>
                    <Rocket size={20} />
                    Deploy Token
                  </>
                )}
              </button>
            )}
          </motion.div>
        );

      case 4:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-center space-y-6"
          >
            <CheckCircle size={64} className="mx-auto text-green-400" />
            <h2 className="text-3xl font-bold text-white">Congratulations!</h2>
            <p className="text-xl text-gray-300">
              Your token {tokenData.name} ({tokenData.symbol}) has been successfully created and deployed!
            </p>

            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 text-left">
              <h3 className="text-lg font-semibold text-white mb-4">Token Information</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-300">Mint Address:</span>
                  <span className="text-white font-mono text-sm">{mintAddress}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Transaction:</span>
                  <a
                    href={`https://explorer.solana.com/tx/${transactionSignature}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-300 underline"
                  >
                    View on Solana Explorer
                  </a>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => {
                  setStep(1);
                  setTokenData({
                    name: '',
                    symbol: '',
                    description: '',
                    image: '',
                    decimals: 9,
                    supply: 1000000,
                    website: '',
                    twitter: '',
                    telegram: ''
                  });
                  setDeploymentStatus('idle');
                  setMintAddress(null);
                  setTransactionSignature(null);
                  setError(null);
                }}
                className="flex-1 bg-white/10 hover:bg-white/20 text-white py-3 rounded-xl font-semibold transition-all"
              >
                Create Another Token
              </button>
              <a
                href="/dashboard"
                className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-3 rounded-xl font-semibold text-center transition-all"
              >
                View Dashboard
              </a>
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  if (!connected) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center bg-white/10 backdrop-blur-md rounded-xl p-8 max-w-md"
        >
          <AlertTriangle size={48} className="mx-auto text-yellow-400 mb-4" />
          <h2 className="text-2xl font-bold text-white mb-4">Wallet Required</h2>
          <p className="text-gray-300 mb-6">
            Please connect your Solana wallet to create and deploy tokens.
          </p>
          <p className="text-sm text-gray-400">
            We recommend using Phantom, Solflare, or any other Solana-compatible wallet.
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Progress Steps */}
        <div className="mb-12">
          <div className="flex items-center justify-between">
            {steps.map((s, index) => (
              <div key={s.number} className="flex items-center">
                <div className={`
                  flex items-center justify-center w-10 h-10 rounded-full border-2 
                  ${step >= s.number
                    ? 'bg-purple-600 border-purple-600 text-white'
                    : 'border-gray-600 text-gray-400'
                  }
                `}>
                  {step > s.number ? <CheckCircle size={20} /> : s.number}
                </div>
                <div className="ml-3 hidden sm:block">
                  <p className={`text-sm font-medium ${step >= s.number ? 'text-white' : 'text-gray-400'}`}>
                    {s.title}
                  </p>
                  <p className="text-xs text-gray-500">{s.description}</p>
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-12 h-0.5 ml-4 ${step > s.number ? 'bg-purple-600' : 'bg-gray-600'}`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-500/20 border border-red-500/30 rounded-xl p-4 mb-6 flex items-center gap-3"
          >
            <AlertTriangle size={20} className="text-red-400 flex-shrink-0" />
            <p className="text-red-300">{error}</p>
          </motion.div>
        )}

        {/* Main Content */}
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-8">
          {renderStepContent()}
        </div>

        {/* Navigation */}
        {step > 1 && step < 4 && (
          <div className="flex justify-between mt-6">
            <button
              onClick={() => setStep(step - 1)}
              className="bg-white/10 hover:bg-white/20 text-white px-6 py-2 rounded-lg transition-all"
            >
              Back
            </button>
          </div>
        )}
      </div>
    </div>
  );
}