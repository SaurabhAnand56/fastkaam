'use client'
// src/components/ui/WhatsAppFloat.tsx

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Phone, X, MessageCircle } from 'lucide-react'

const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '919999999999'
const PHONE_NUMBER = process.env.NEXT_PUBLIC_PHONE_NUMBER || '+91-9999999999'

export default function WhatsAppFloat() {
  const [open, setOpen] = useState(false)

  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    'Hello! I am interested in PVC card printing services at Fastkaam.'
  )}`

  return (
    <div className="fixed bottom-6 right-4 z-50 flex flex-col items-end gap-3">
      {/* Popup options */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            className="flex flex-col gap-2 items-end"
          >
            {/* WhatsApp */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl px-4 py-3 shadow-lg hover:shadow-xl transition-all group"
            >
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Chat on WhatsApp
              </span>
              <div className="w-9 h-9 bg-green-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <MessageCircle className="w-5 h-5 text-white" />
              </div>
            </a>

            {/* Call */}
            <a
              href={`tel:${PHONE_NUMBER}`}
              className="flex items-center gap-3 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl px-4 py-3 shadow-lg hover:shadow-xl transition-all group"
            >
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Call Us Now
              </span>
              <div className="w-9 h-9 bg-blue-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Phone className="w-5 h-5 text-white" />
              </div>
            </a>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main FAB */}
      <motion.button
        onClick={() => setOpen(!open)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="relative w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl shadow-2xl shadow-green-500/40 flex items-center justify-center text-white"
      >
        <AnimatePresence mode="wait">
          {open ? (
            <motion.div key="x" initial={{ rotate: -90 }} animate={{ rotate: 0 }} exit={{ rotate: 90 }}>
              <X className="w-6 h-6" />
            </motion.div>
          ) : (
            <motion.div key="wa" initial={{ rotate: 90 }} animate={{ rotate: 0 }} exit={{ rotate: -90 }}>
              <MessageCircle className="w-6 h-6" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Pulse ring */}
        {!open && (
          <span className="absolute inset-0 rounded-2xl bg-green-500 animate-ping opacity-20" />
        )}
      </motion.button>
    </div>
  )
}
