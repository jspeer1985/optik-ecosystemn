'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { AlertTriangle, Home, RefreshCcw } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-md"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring" }}
          className="bg-red-500/20 rounded-full p-6 w-24 h-24 mx-auto mb-6 flex items-center justify-center"
        >
          <AlertTriangle size={48} className="text-red-400" />
        </motion.div>
        
        <h1 className="text-3xl font-bold text-white mb-4">Something went wrong!</h1>
        <p className="text-gray-300 mb-2">An unexpected error occurred while processing your request.</p>
        
        {error.message && (
          <p className="text-red-300 text-sm mb-6 bg-red-500/10 rounded-lg p-3 border border-red-500/20">
            {error.message}
          </p>
        )}
        
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={reset}
            className="flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-3 rounded-lg font-semibold transition-all"
          >
            <RefreshCcw size={16} />
            Try Again
          </button>
          
          <Link
            href="/"
            className="flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-lg font-semibold transition-all"
          >
            <Home size={16} />
            Go Home
          </Link>
        </div>
        
        <p className="text-gray-400 text-xs mt-8">
          If this problem persists, please contact our support team.
        </p>
      </motion.div>
    </div>
  );
}