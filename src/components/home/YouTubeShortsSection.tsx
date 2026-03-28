'use client'
// src/components/home/YouTubeShortsSection.tsx

import { motion } from 'framer-motion'
import { useLanguageStore } from '@/stores/languageStore'
import { Play, ExternalLink } from 'lucide-react'

// Replace with actual YouTube Shorts IDs from your channel
const SHORTS = [
  { id: 'dQw4w9WgXcQ', title: 'How to order PVC card',       titleHi: 'PVC कार्ड कैसे ऑर्डर करें' },
  { id: 'dQw4w9WgXcQ', title: 'Card preview demo',            titleHi: 'कार्ड प्रीव्यू डेमो' },
  { id: 'dQw4w9WgXcQ', title: 'Quality showcase',             titleHi: 'क्वालिटी शोकेस' },
]

const CHANNEL_URL = 'https://youtube.com/@fastkaam' // Update with actual channel

export default function YouTubeShortsSection() {
  const { isHindi } = useLanguageStore()

  return (
    <section className="py-20 px-4 bg-white dark:bg-gray-950">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 bg-red-50 dark:bg-red-950/30 border border-red-100 dark:border-red-800 rounded-full px-4 py-1.5 text-sm font-medium text-red-600 dark:text-red-400 mb-4"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            {isHindi ? 'YouTube Shorts' : 'Watch on YouTube'}
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2"
          >
            {isHindi ? 'हमारा काम देखें' : 'See Our Work in Action'}
          </motion.h2>
        </div>

        {/* Shorts grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {SHORTS.map((short, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="rounded-3xl overflow-hidden border border-gray-100 dark:border-gray-800 shadow-md hover:shadow-xl transition-shadow"
            >
              {/* Shorts player - 9:16 aspect ratio */}
              <div className="relative" style={{ paddingBottom: '177.78%' }}>
                <iframe
                  className="absolute inset-0 w-full h-full"
                  src={`https://www.youtube.com/embed/${short.id}?rel=0&modestbranding=1`}
                  title={short.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  loading="lazy"
                />
              </div>
              <div className="p-3 bg-white dark:bg-gray-800">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate">
                  {isHindi ? short.titleHi : short.title}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA to channel */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="text-center mt-8"
        >
          <a
            href={CHANNEL_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-red-600 text-white font-semibold text-sm hover:bg-red-700 transition-colors shadow-lg shadow-red-500/25"
          >
            <Play className="w-4 h-4 fill-current" />
            {isHindi ? 'YouTube चैनल देखें' : 'Visit YouTube Channel'}
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </motion.div>
      </div>
    </section>
  )
}
