'use client'
// src/components/home/HeroSection.tsx

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, Star, Shield, Zap } from 'lucide-react'
import { useLanguageStore } from '@/stores/languageStore'

const BADGES = [
  { icon: Star, text: '4.9★ Rating', textHi: '4.9★ रेटिंग' },
  { icon: Shield, text: 'Secure Payment', textHi: 'सुरक्षित भुगतान' },
  { icon: Zap, text: 'Fast Delivery', textHi: 'तेज डिलीवरी' },
]

const FLOATING_CARDS = [
  { top: '15%', left: '5%', label: 'Aadhaar Card', price: '₹30', color: 'from-blue-500 to-blue-700' },
  { top: '60%', left: '2%', label: 'PAN Card', price: '₹30', color: 'from-amber-500 to-orange-600' },
  { top: '20%', right: '3%', label: 'ABHA Card', price: '₹35', color: 'from-green-500 to-emerald-700' },
  { top: '65%', right: '2%', label: 'Kisan Card', price: '₹30', color: 'from-yellow-500 to-lime-600' },
]

export default function HeroSection() {
  const { isHindi } = useLanguageStore()

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-violet-950 via-purple-900 to-gray-950" />

      {/* Animated orbs */}
      <motion.div
        animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-20 left-1/4 w-72 h-72 bg-orange-500/20 rounded-full blur-3xl pointer-events-none"
      />
      <motion.div
        animate={{ x: [0, -20, 0], y: [0, 30, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
        className="absolute bottom-20 right-1/4 w-96 h-96 bg-violet-500/20 rounded-full blur-3xl pointer-events-none"
      />
      <motion.div
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-3xl pointer-events-none"
      />

      {/* Floating card previews */}
      {FLOATING_CARDS.map((card, i) => (
        <motion.div
          key={card.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: [0, -8, 0] }}
          transition={{
            opacity: { delay: 0.8 + i * 0.15, duration: 0.5 },
            y: { duration: 3 + i * 0.5, repeat: Infinity, ease: 'easeInOut', delay: i * 0.7 },
          }}
          style={{ top: card.top, left: (card as any).left, right: (card as any).right }}
          className="absolute hidden lg:block"
        >
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-3 shadow-2xl">
            <div className={`w-24 h-14 rounded-xl bg-gradient-to-br ${card.color} flex items-end p-2`}>
              <div className="w-full h-1.5 bg-white/30 rounded-full" />
            </div>
            <div className="mt-2 text-center">
              <div className="text-white text-xs font-semibold">{card.label}</div>
              <div className="text-orange-300 text-xs font-bold">{card.price}</div>
            </div>
          </div>
        </motion.div>
      ))}

      {/* Main content */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 text-center pt-20">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-5 py-2 text-sm text-white/80 mb-8"
        >
          <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          {isHindi ? 'भारत की #1 PVC कार्ड प्रिंटिंग सेवा' : "India's #1 PVC Card Printing Service"}
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tight mb-6"
        >
          {isHindi ? (
            <>प्रीमियम <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-pink-400">PVC कार्ड</span><br />प्रिंटिंग सेवा</>
          ) : (
            <>Premium <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-pink-400">PVC Card</span><br />Printing Service</>
          )}
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          className="text-lg md:text-xl text-white/70 max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          {isHindi
            ? 'आधार, पैन, ABHA, आयुष्मान, किसान कार्ड — प्रीमियम PVC में। तेज प्रिंटिंग, घर तक डिलीवरी।'
            : 'Aadhaar, PAN, ABHA, Ayushman, Kisan cards in premium PVC. Fast printing, doorstep delivery across India.'}
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55 }}
          className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
        >
          <Link
            href="/pvc-cards"
            className="group inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-orange-500 to-pink-500 text-white font-bold text-lg hover:opacity-90 transition-all shadow-2xl shadow-orange-500/40 hover:scale-105"
          >
            {isHindi ? 'अभी ऑर्डर करें' : 'Order Now'}
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            href="/services"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 text-white font-semibold text-lg hover:bg-white/20 transition-all"
          >
            {isHindi ? 'सेवाएं देखें' : 'View Services'}
          </Link>
        </motion.div>

        {/* Trust badges */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="flex flex-wrap items-center justify-center gap-6"
        >
          {BADGES.map(({ icon: Icon, text, textHi }) => (
            <div key={text} className="flex items-center gap-2 text-white/60 text-sm">
              <Icon className="w-4 h-4 text-orange-400" />
              {isHindi ? textHi : text}
            </div>
          ))}
        </motion.div>
      </div>

      {/* Bottom wave */}
      <div className="absolute bottom-0 inset-x-0">
        <svg viewBox="0 0 1440 80" className="w-full fill-white dark:fill-gray-950">
          <path d="M0,40 C360,80 1080,0 1440,40 L1440,80 L0,80 Z" />
        </svg>
      </div>
    </section>
  )
}
