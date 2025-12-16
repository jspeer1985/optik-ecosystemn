'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Search, Home, ArrowLeft, Sparkles } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-lg"
      >
        {/* Animated 404 */}
        <motion.div
          initial={{ scale: 0.5 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", bounce: 0.4 }}
          className="mb-8"
        >
          <div className="relative">
            <h1 className="text-9xl font-bold text-transparent bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text">
              404
            </h1>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              className="absolute -top-4 -right-4"
            >
              <Sparkles size={32} className="text-yellow-400" />
            </motion.div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="space-y-4 mb-8"
        >
          <h2 className="text-3xl font-bold text-white">Page Not Found</h2>
          <p className="text-gray-300 text-lg">
            Oops! The page you&apos;re looking for seems to have disappeared into the crypto void.
          </p>
          <p className="text-gray-400">
            Don&apos;t worry, even the best traders sometimes take a wrong turn.
          </p>
        </motion.div>

        {/* Search Suggestion */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white/10 backdrop-blur-md rounded-xl p-6 mb-8"
        >
          <div className="flex items-center gap-3 mb-3">
            <Search size={20} className="text-purple-400" />
            <h3 className="text-lg font-semibold text-white">What are you looking for?</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
            <Link href="/launchpad" className="text-gray-300 hover:text-white transition-colors">
              • Token Launchpad
            </Link>
            <Link href="/dashboard" className="text-gray-300 hover:text-white transition-colors">
              • User Dashboard
            </Link>
            <Link href="/launchpad/create" className="text-gray-300 hover:text-white transition-colors">
              • Create Token
            </Link>
            <Link href="/" className="text-gray-300 hover:text-white transition-colors">
              • Home Page
            </Link>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <button
            onClick={() => window.history.back()}
            className="flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-lg font-semibold transition-all"
          >
            <ArrowLeft size={16} />
            Go Back
          </button>

          <Link
            href="/"
            className="flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-3 rounded-lg font-semibold transition-all"
          >
            <Home size={16} />
            Go Home
          </Link>
        </motion.div>

        {/* Fun Message */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-gray-500 text-sm mt-8"
        >
          🚀 Lost in space? Our rockets only go to the moon! 🌙
        </motion.p>
      </motion.div>
    </div>
  );
}