'use client'
// src/components/home/TestimonialsSection.tsx

import { motion } from 'framer-motion'
import { Star } from 'lucide-react'
import { useLanguageStore } from '@/stores/languageStore'

const TESTIMONIALS = [
  {
    name: 'Ramesh Kumar',
    location: 'Delhi',
    avatar: 'RK',
    color: 'from-blue-400 to-blue-600',
    rating: 5,
    text: 'Got my Aadhaar PVC card in just 2 days. Quality is excellent — looks exactly like a bank card. Very happy with Fastkaam!',
    textHi: 'सिर्फ 2 दिन में आधार PVC कार्ड मिल गया। क्वालिटी शानदार है — बिल्कुल बैंक कार्ड जैसा दिखता है।',
  },
  {
    name: 'Priya Sharma',
    location: 'Mumbai',
    avatar: 'PS',
    color: 'from-pink-400 to-rose-600',
    rating: 5,
    text: 'The PAN card printing is amazing. Perfect size, great lamination. Ordered 5 for my family — all perfect!',
    textHi: 'PAN कार्ड प्रिंटिंग अद्भुत है। परफेक्ट साइज, बेहतरीन लैमिनेशन। परिवार के लिए 5 ऑर्डर किए — सब परफेक्ट!',
  },
  {
    name: 'Suresh Patel',
    location: 'Gujarat',
    avatar: 'SP',
    color: 'from-green-400 to-emerald-600',
    rating: 5,
    text: 'Fast service, great quality, and very affordable prices. The WhatsApp support is instant. Highly recommended!',
    textHi: 'तेज सेवा, बेहतरीन गुणवत्ता और बहुत किफायती दाम। WhatsApp सपोर्ट तुरंत मिलता है। बहुत अच्छा!',
  },
  {
    name: 'Anita Singh',
    location: 'UP',
    avatar: 'AS',
    color: 'from-violet-400 to-purple-600',
    rating: 5,
    text: 'Ordered Ayushman Bharat card for my parents. The quality is premium and delivery was super fast. Thank you!',
    textHi: 'माता-पिता के लिए आयुष्मान भारत कार्ड ऑर्डर किया। क्वालिटी प्रीमियम है और डिलीवरी बहुत तेज थी।',
  },
  {
    name: 'Mohammad Ali',
    location: 'Hyderabad',
    avatar: 'MA',
    color: 'from-amber-400 to-orange-600',
    rating: 5,
    text: 'Best PVC card printing service in India. The upload process is easy and the preview feature is great!',
    textHi: 'भारत की सर्वश्रेष्ठ PVC कार्ड प्रिंटिंग सेवा। अपलोड प्रक्रिया आसान है और प्रीव्यू फीचर बहुत अच्छा है!',
  },
  {
    name: 'Kavitha Nair',
    location: 'Kerala',
    avatar: 'KN',
    color: 'from-teal-400 to-cyan-600',
    rating: 5,
    text: 'Used for Kisan card printing for my father. Very professional service and the card is excellent quality.',
    textHi: 'पिताजी के लिए किसान कार्ड प्रिंटिंग के लिए उपयोग किया। बहुत पेशेवर सेवा और कार्ड उत्कृष्ट गुणवत्ता का है।',
  },
]

export default function TestimonialsSection() {
  const { isHindi } = useLanguageStore()

  return (
    <section className="py-20 px-4 bg-gray-50 dark:bg-gray-900 overflow-hidden">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 bg-yellow-50 dark:bg-yellow-950/30 border border-yellow-100 dark:border-yellow-800 rounded-full px-4 py-1.5 text-sm font-medium text-yellow-600 dark:text-yellow-400 mb-4"
          >
            ⭐ {isHindi ? 'ग्राहकों की राय' : 'Customer Reviews'}
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2"
          >
            {isHindi ? 'हमारे ग्राहक क्या कहते हैं' : 'What Our Customers Say'}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-gray-500 dark:text-gray-400"
          >
            {isHindi ? '5,000+ खुश ग्राहकों का विश्वास' : 'Trusted by 5,000+ happy customers across India'}
          </motion.p>
        </div>

        {/* Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {TESTIMONIALS.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-5 hover:shadow-lg transition-shadow"
            >
              {/* Stars */}
              <div className="flex gap-0.5 mb-3">
                {Array.from({ length: t.rating }).map((_, j) => (
                  <Star key={j} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>

              {/* Review */}
              <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed mb-4">
                "{isHindi ? t.textHi : t.text}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-3 pt-3 border-t border-gray-100 dark:border-gray-700">
                <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${t.color} flex items-center justify-center text-white text-xs font-bold`}>
                  {t.avatar}
                </div>
                <div>
                  <div className="font-semibold text-gray-800 dark:text-gray-100 text-sm">{t.name}</div>
                  <div className="text-xs text-gray-400">{t.location}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
