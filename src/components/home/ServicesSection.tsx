'use client'
// src/components/home/ServicesSection.tsx

import { motion } from 'framer-motion'
import { useLanguageStore } from '@/stores/languageStore'
import {
  Monitor, Printer, Globe, FileText, Camera, CreditCard,
  Wifi, FileCheck, Stamp, BookOpen, PenTool, QrCode
} from 'lucide-react'

const SERVICES = [
  {
    category: 'Digital Services',
    categoryHi: 'डिजिटल सेवाएं',
    color: 'from-blue-500 to-blue-700',
    bg: 'bg-blue-50 dark:bg-blue-950/30',
    items: [
      { icon: Monitor, name: 'Computer Work', nameHi: 'कंप्यूटर कार्य' },
      { icon: FileText, name: 'Data Entry', nameHi: 'डेटा एंट्री' },
      { icon: PenTool, name: 'DTP & Design', nameHi: 'DTP & डिज़ाइन' },
      { icon: Camera, name: 'Photo Editing', nameHi: 'फोटो एडिटिंग' },
    ],
  },
  {
    category: 'Printing Services',
    categoryHi: 'प्रिंटिंग सेवाएं',
    color: 'from-orange-500 to-red-600',
    bg: 'bg-orange-50 dark:bg-orange-950/30',
    items: [
      { icon: Printer, name: 'PVC Card Printing', nameHi: 'PVC कार्ड प्रिंटिंग' },
      { icon: BookOpen, name: 'Book Binding', nameHi: 'बुक बाइंडिंग' },
      { icon: FileCheck, name: 'Document Print', nameHi: 'डॉक्यूमेंट प्रिंट' },
      { icon: Stamp, name: 'Stamp Making', nameHi: 'स्टाम्प बनाना' },
    ],
  },
  {
    category: 'Online Services',
    categoryHi: 'ऑनलाइन सेवाएं',
    color: 'from-green-500 to-emerald-700',
    bg: 'bg-green-50 dark:bg-green-950/30',
    items: [
      { icon: Globe, name: 'Govt. Portals', nameHi: 'सरकारी पोर्टल' },
      { icon: CreditCard, name: 'Recharge & Bills', nameHi: 'रिचार्ज और बिल' },
      { icon: Wifi, name: 'Internet Services', nameHi: 'इंटरनेट सेवाएं' },
      { icon: QrCode, name: 'CSC Services', nameHi: 'CSC सेवाएं' },
    ],
  },
]

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
}
const item = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
}

export default function ServicesSection() {
  const { isHindi } = useLanguageStore()

  return (
    <section className="py-20 px-4 bg-white dark:bg-gray-950">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-14">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 bg-orange-50 dark:bg-orange-950/30 border border-orange-100 dark:border-orange-800 rounded-full px-4 py-1.5 text-sm font-medium text-orange-600 dark:text-orange-400 mb-4"
          >
            🛠️ {isHindi ? 'हमारी सेवाएं' : 'What We Offer'}
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4"
          >
            {isHindi ? 'सभी सेवाएं एक जगह' : 'All Services Under One Roof'}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-gray-500 dark:text-gray-400 max-w-xl mx-auto"
          >
            {isHindi
              ? 'डिजिटल, प्रिंटिंग और ऑनलाइन — सब कुछ एक ही जगह पर।'
              : 'Digital work, printing, and online services — everything at Fastkaam.'}
          </motion.p>
        </div>

        {/* Service categories */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid md:grid-cols-3 gap-6"
        >
          {SERVICES.map((category) => (
            <motion.div
              key={category.category}
              variants={item}
              className={`${category.bg} rounded-3xl p-6 border border-gray-100 dark:border-gray-800`}
            >
              {/* Category header */}
              <div className="flex items-center gap-3 mb-5">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${category.color} flex items-center justify-center shadow-lg`}>
                  <span className="text-white text-lg">●</span>
                </div>
                <h3 className="font-bold text-gray-800 dark:text-gray-100">
                  {isHindi ? category.categoryHi : category.category}
                </h3>
              </div>

              {/* Services list */}
              <div className="grid grid-cols-2 gap-3">
                {category.items.map(({ icon: Icon, name, nameHi }) => (
                  <div
                    key={name}
                    className="flex items-center gap-2 bg-white dark:bg-gray-800/50 rounded-xl p-3 hover:shadow-md transition-shadow cursor-default"
                  >
                    <div className={`w-7 h-7 rounded-lg bg-gradient-to-br ${category.color} flex items-center justify-center flex-shrink-0`}>
                      <Icon className="w-3.5 h-3.5 text-white" />
                    </div>
                    <span className="text-xs font-medium text-gray-700 dark:text-gray-300 leading-tight">
                      {isHindi ? nameHi : name}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
