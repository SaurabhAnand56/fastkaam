'use client'
// src/components/home/StatsSection.tsx

import { useEffect, useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { useLanguageStore } from '@/stores/languageStore'

const STATS = [
  { value: 5000, suffix: '+', label: 'Cards Printed', labelHi: 'कार्ड प्रिंट किए', color: 'text-orange-500' },
  { value: 1200, suffix: '+', label: 'Happy Customers', labelHi: 'खुश ग्राहक', color: 'text-violet-500' },
  { value: 6, suffix: '', label: 'Card Types', labelHi: 'कार्ड प्रकार', color: 'text-teal-500' },
  { value: 99, suffix: '%', label: 'Satisfaction', labelHi: 'संतुष्टि', color: 'text-pink-500' },
]

function Counter({ target, suffix }: { target: number; suffix: string }) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true })

  useEffect(() => {
    if (!inView) return
    const duration = 1800
    const step = target / (duration / 16)
    let current = 0
    const timer = setInterval(() => {
      current = Math.min(current + step, target)
      setCount(Math.floor(current))
      if (current >= target) clearInterval(timer)
    }, 16)
    return () => clearInterval(timer)
  }, [inView, target])

  return (
    <span ref={ref}>
      {count.toLocaleString('en-IN')}
      {suffix}
    </span>
  )
}

export default function StatsSection() {
  const { isHindi } = useLanguageStore()

  return (
    <section className="py-14 px-4 bg-white dark:bg-gray-950 border-y border-gray-100 dark:border-gray-800">
      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {STATS.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center"
            >
              <div className={`text-3xl md:text-4xl font-bold mb-1 ${stat.color}`}>
                <Counter target={stat.value} suffix={stat.suffix} />
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                {isHindi ? stat.labelHi : stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
