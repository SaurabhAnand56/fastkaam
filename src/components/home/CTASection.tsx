'use client'
// src/components/home/CTASection.tsx

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, MessageCircle } from 'lucide-react'
import { useLanguageStore } from '@/stores/languageStore'

export default function CTASection() {
  const { isHindi } = useLanguageStore()
  const whatsappUrl = `https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER}?text=${encodeURIComponent('Hi! I want to order PVC cards from Fastkaam.')}`

  return (
    <section className="py-20 px-4 bg-white dark:bg-gray-950">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative rounded-3xl overflow-hidden"
        >
          {/* Gradient background */}
          <div className="absolute inset-0 bg-gradient-to-br from-orange-500 via-pink-500 to-violet-600" />

          {/* Decorative circles */}
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-white/10 rounded-full blur-2xl" />
          <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-white/10 rounded-full blur-2xl" />

          {/* Content */}
          <div className="relative text-center py-16 px-8">
            <div className="text-4xl mb-4">🖨️</div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              {isHindi
                ? 'आज ही अपना PVC कार्ड ऑर्डर करें!'
                : 'Ready to Get Your PVC Card?'}
            </h2>
            <p className="text-white/80 text-lg mb-8 max-w-xl mx-auto">
              {isHindi
                ? 'सिर्फ ₹30 से शुरू — इमेज अपलोड करें, ऑर्डर करें, घर पर पाएं।'
                : 'Starting at just ₹30 — upload your image, place your order, get it delivered home.'}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/pvc-cards"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-white text-orange-600 font-bold text-lg hover:bg-orange-50 transition-all shadow-xl group"
              >
                {isHindi ? 'अभी ऑर्डर करें' : 'Order Now'}
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-white/20 backdrop-blur-sm border border-white/30 text-white font-bold text-lg hover:bg-white/30 transition-all"
              >
                <MessageCircle className="w-5 h-5" />
                {isHindi ? 'WhatsApp करें' : 'WhatsApp Us'}
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
