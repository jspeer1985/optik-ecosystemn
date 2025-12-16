'use client';

import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center"
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="relative mb-8 mx-auto w-16 h-16"
        >
          <div className="absolute inset-0 rounded-full border-4 border-purple-600/30"></div>
          <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-purple-400"></div>
        </motion.div>

        <motion.div
          initial={{ y: 10 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="space-y-4"
        >
          <h2 className="text-2xl font-bold text-white flex items-center justify-center gap-2">
            <Sparkles size={24} className="text-purple-400" />
            Loading Optik
          </h2>
          <p className="text-gray-300">Preparing your crypto experience...</p>
        </motion.div>

        <motion.div
          animate={{ opacity: [1, 0.5, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="mt-8"
        >
          <div className="flex justify-center space-x-1">
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                animate={{ y: [0, -8, 0] }}
                transition={{
                  duration: 0.6,
                  repeat: Infinity,
                  delay: i * 0.2
                }}
                className="w-2 h-2 bg-purple-400 rounded-full"
              />
            ))}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}