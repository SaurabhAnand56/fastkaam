'use client'
// src/components/home/FAQSection.tsx

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { useLanguageStore } from '@/stores/languageStore'

const FAQS = [
  {
    q: 'What is the quality of PVC cards?',
    qHi: 'PVC कार्ड की क्वालिटी कैसी है?',
    a: 'We use premium 760 micron thick PVC material — the same thickness as standard credit/debit cards. Cards are waterproof, durable, and have a glossy finish.',
    aHi: 'हम 760 माइक्रोन मोटी प्रीमियम PVC सामग्री उपयोग करते हैं — जो क्रेडिट/डेबिट कार्ड जितनी मोटी है। कार्ड वाटरप्रूफ, टिकाऊ और ग्लॉसी फिनिश के साथ आते हैं।',
  },
  {
    q: 'How long does delivery take?',
    qHi: 'डिलीवरी में कितना समय लगता है?',
    a: 'Local orders (within city) are delivered within 1–2 days. Pan-India orders are shipped via courier and delivered in 3–5 business days.',
    aHi: 'स्थानीय ऑर्डर (शहर के भीतर) 1–2 दिनों में डिलीवर होते हैं। पूरे भारत के ऑर्डर कूरियर से 3–5 कार्य दिवसों में डिलीवर होते हैं।',
  },
  {
    q: 'What image format should I upload?',
    qHi: 'मुझे किस फॉर्मेट में इमेज अपलोड करनी चाहिए?',
    a: 'Upload JPG or PNG images. For best quality, use high-resolution images (300 DPI or more). Maximum file size is 5MB per image.',
    aHi: 'JPG या PNG इमेज अपलोड करें। सर्वोत्तम गुणवत्ता के लिए उच्च-रिज़ॉल्यूशन इमेज (300 DPI या अधिक) उपयोग करें। प्रति इमेज अधिकतम फ़ाइल साइज़ 5MB है।',
  },
  {
    q: 'Can I cancel or modify my order?',
    qHi: 'क्या मैं अपना ऑर्डर रद्द या बदल सकता हूं?',
    a: 'You can cancel your order within 1 hour of placing it, or before it moves to "Printing" status. After printing begins, cancellations are not possible.',
    aHi: 'आप ऑर्डर करने के 1 घंटे के भीतर, या "प्रिंटिंग" स्टेटस से पहले ऑर्डर रद्द कर सकते हैं। प्रिंटिंग शुरू होने के बाद रद्दीकरण संभव नहीं है।',
  },
  {
    q: 'Is my personal data safe?',
    qHi: 'क्या मेरा व्यक्तिगत डेटा सुरक्षित है?',
    a: 'Absolutely. All uploaded images are stored securely on Cloudinary with encrypted access. We never share your data with third parties. Images are deleted after 30 days.',
    aHi: 'बिल्कुल। सभी अपलोड की गई इमेज Cloudinary पर एन्क्रिप्टेड एक्सेस के साथ सुरक्षित रूप से संग्रहीत हैं। हम आपका डेटा किसी तीसरे पक्ष के साथ साझा नहीं करते। इमेज 30 दिनों के बाद हटा दी जाती हैं।',
  },
  {
    q: 'What payment methods are accepted?',
    qHi: 'कौन से भुगतान तरीके स्वीकार किए जाते हैं?',
    a: 'We accept UPI (GPay, PhonePe, Paytm), debit/credit cards, net banking, and Paytm wallet — all secured through Paytm Payment Gateway.',
    aHi: 'हम UPI (GPay, PhonePe, Paytm), डेबिट/क्रेडिट कार्ड, नेट बैंकिंग और Paytm वॉलेट स्वीकार करते हैं — सभी Paytm Payment Gateway के माध्यम से सुरक्षित।',
  },
]

export default function FAQSection() {
  const { isHindi } = useLanguageStore()
  const [open, setOpen] = useState<number | null>(null)

  return (
    <section className="py-20 px-4 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 bg-violet-50 dark:bg-violet-950/30 border border-violet-100 dark:border-violet-800 rounded-full px-4 py-1.5 text-sm font-medium text-violet-600 dark:text-violet-400 mb-4"
          >
            ❓ {isHindi ? 'सामान्य प्रश्न' : 'FAQ'}
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white"
          >
            {isHindi ? 'अक्सर पूछे जाने वाले प्रश्न' : 'Frequently Asked Questions'}
          </motion.h2>
        </div>

        <div className="space-y-3">
          {FAQS.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07 }}
              className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden"
            >
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between p-5 text-left hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors"
              >
                <span className="font-semibold text-gray-800 dark:text-gray-100 pr-4">
                  {isHindi ? faq.qHi : faq.q}
                </span>
                <motion.div
                  animate={{ rotate: open === i ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="flex-shrink-0"
                >
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                </motion.div>
              </button>
              <AnimatePresence>
                {open === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                  >
                    <div className="px-5 pb-5 text-sm text-gray-600 dark:text-gray-400 leading-relaxed border-t border-gray-100 dark:border-gray-700 pt-4">
                      {isHindi ? faq.aHi : faq.a}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
