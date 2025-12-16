'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft, Home, AlertTriangle } from 'lucide-react';

export default function Forbidden() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-lg"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring" }}
          className="bg-orange-500/20 rounded-full p-6 w-24 h-24 mx-auto mb-6 flex items-center justify-center"
        >
          <AlertTriangle size={48} className="text-orange-400" />
        </motion.div>

        <h1 className="text-3xl font-bold text-white mb-4">Forbidden</h1>
        <p className="text-gray-300 mb-2">
          You don&apos;t have the necessary permissions to access this resource.
        </p>
        <p className="text-gray-400 mb-8">
          This area is restricted. If you need access, please contact an administrator.
        </p>

        <div className="flex flex-col sm:flex-row gap-4">
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
        </div>
      </motion.div>
    </div>
  );
}