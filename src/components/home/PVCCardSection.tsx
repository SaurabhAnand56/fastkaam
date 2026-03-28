'use client'
// src/components/home/PVCCardSection.tsx

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, CheckCircle } from 'lucide-react'
import { useLanguageStore } from '@/stores/languageStore'

const CARDS = [
  { name: 'Aadhaar', nameHi: 'आधार', price: '₹30', color: 'from-blue-500 to-blue-700', emoji: '🪪' },
  { name: 'PAN',     nameHi: 'पैन',   price: '₹30', color: 'from-amber-500 to-orange-600', emoji: '💳' },
  { name: 'ABHA',    nameHi: 'ABHA',  price: '₹35', color: 'from-green-500 to-emerald-700', emoji: '🏥' },
  { name: 'Kisan',   nameHi: 'किसान', price: '₹30', color: 'from-yellow-500 to-lime-600', emoji: '🌾' },
  { name: 'Custom',  nameHi: 'कस्टम', price: '₹50', color: 'from-violet-500 to-purple-700', emoji: '✨' },
]

const FEATURES = [
  { en: '760 micron thick PVC', hi: '760 माइक्रोन PVC' },
  { en: 'Waterproof & durable', hi: 'वाटरप्रूफ और टिकाऊ' },
  { en: 'Wallet-size fit', hi: 'वॉलेट साइज' },
  { en: 'Glossy finish', hi: 'ग्लॉसी फिनिश' },
  { en: 'Fast delivery', hi: 'तेज डिलीवरी' },
  { en: 'Secure payments', hi: 'सुरक्षित भुगतान' },
]

export default function PVCCardSection() {
  const { isHindi } = useLanguageStore()

  return (
    <section className="py-20 px-4 bg-gradient-to-br from-violet-950 via-purple-900 to-gray-950 overflow-hidden relative">
      {/* Subtle orb */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto relative">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left text */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 bg-orange-500/20 border border-orange-500/30 rounded-full px-4 py-1.5 text-sm font-medium text-orange-300 mb-6"
            >
              🪪 {isHindi ? 'हमारी खास सेवा' : 'Our Flagship Service'}
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-3xl md:text-4xl font-bold text-white mb-4 leading-tight"
            >
              {isHindi ? (
                <>प्रीमियम <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-pink-400">PVC कार्ड</span> प्रिंटिंग</>
              ) : (
                <>Premium <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-pink-400">PVC Card</span> Printing</>
              )}
            </motion.h2>

            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-white/60 mb-8 leading-relaxed"
            >
              {isHindi
                ? 'अपने सरकारी कार्ड को टिकाऊ PVC फॉर्मेट में बनवाएं। कागज से बेहतर, बटुए में फिट।'
                : 'Convert your government cards into durable PVC format. Better than paper, fits your wallet perfectly.'}
            </motion.p>

            {/* Features grid */}
            <div className="grid grid-cols-2 gap-2 mb-8">
              {FEATURES.map(({ en, hi }) => (
                <div key={en} className="flex items-center gap-2 text-sm text-white/70">
                  <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                  {isHindi ? hi : en}
                </div>
              ))}
            </div>

            <Link
              href="/pvc-cards"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-orange-500 to-pink-500 text-white font-bold hover:opacity-90 transition-all shadow-2xl shadow-orange-500/40 group"
            >
              {isHindi ? 'अभी ऑर्डर करें' : 'Order Now — Starting ₹30'}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Right: Card grid display */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-2 gap-4"
          >
            {CARDS.map((card, i) => (
              <motion.div
                key={card.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 + i * 0.07 }}
                className={`${i === 4 ? 'col-span-2' : ''} bg-white/10 backdrop-blur-sm border border-white/15 rounded-2xl p-4 hover:bg-white/15 transition-all cursor-default group`}
              >
                <div className={`w-full h-16 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-between px-4 mb-3 shadow-lg`}>
                  <span className="text-2xl">{card.emoji}</span>
                  <div className="text-right">
                    <div className="text-white/60 text-[10px] uppercase tracking-wider">Fastkaam</div>
                    <div className="text-white text-xs font-bold">PVC</div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white font-semibold text-sm">
                    {isHindi ? card.nameHi : card.name}
                  </span>
                  <span className="text-orange-300 font-bold text-sm">{card.price}</span>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
