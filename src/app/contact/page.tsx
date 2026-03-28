'use client'
// src/app/contact/page.tsx

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Phone, Mail, MapPin, MessageCircle, Clock, Send, Loader2, CheckCircle } from 'lucide-react'
import axios from 'axios'
import toast from 'react-hot-toast'
import { useLanguageStore } from '@/stores/languageStore'

const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '919999999999'
const PHONE_NUMBER = process.env.NEXT_PUBLIC_PHONE_NUMBER || '+91-9999999999'
const MAPS_EMBED_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_EMBED_KEY || ''

// Replace with actual coordinates of your shop
const SHOP_LAT  = '28.6139'
const SHOP_LNG  = '77.2090'
const SHOP_NAME = encodeURIComponent('Fastkaam Computer & Printing Press')

export default function ContactPage() {
  const { isHindi } = useLanguageStore()
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' })
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name || !form.email || !form.message) { toast.error('Please fill required fields'); return }
    setLoading(true)
    try {
      await axios.post('/api/contact', form)
      setSent(true)
      toast.success('Message sent! We\'ll reply soon.')
    } catch {
      toast.error('Failed to send. Try WhatsApp instead.')
    } finally {
      setLoading(false)
    }
  }

  const field = (key: keyof typeof form) => ({
    value: form[key],
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm(f => ({ ...f, [key]: e.target.value })),
  })

  return (
    <div className="min-h-screen pt-20 pb-16">
      {/* Header */}
      <div className="bg-gradient-to-br from-teal-600 to-blue-700 py-14 px-4 text-white text-center mb-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl md:text-4xl font-bold mb-3">
            {isHindi ? 'हमसे संपर्क करें' : 'Get in Touch'}
          </h1>
          <p className="text-white/70 max-w-xl mx-auto">
            {isHindi
              ? 'कोई भी सवाल हो — WhatsApp करें, कॉल करें या फॉर्म भरें।'
              : 'Have questions? WhatsApp us, call us, or fill the form below.'}
          </p>
        </motion.div>
      </div>

      <div className="max-w-5xl mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Contact info */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4 mb-8"
            >
              {[
                {
                  icon: MessageCircle,
                  color: 'bg-green-500',
                  label: isHindi ? 'WhatsApp' : 'WhatsApp',
                  value: `+${WHATSAPP_NUMBER}`,
                  href: `https://wa.me/${WHATSAPP_NUMBER}`,
                },
                {
                  icon: Phone,
                  color: 'bg-blue-500',
                  label: isHindi ? 'फोन' : 'Phone',
                  value: PHONE_NUMBER,
                  href: `tel:${PHONE_NUMBER}`,
                },
                {
                  icon: Mail,
                  color: 'bg-orange-500',
                  label: isHindi ? 'ईमेल' : 'Email',
                  value: 'hello@fastkaam.in',
                  href: 'mailto:hello@fastkaam.in',
                },
                {
                  icon: MapPin,
                  color: 'bg-violet-500',
                  label: isHindi ? 'पता' : 'Address',
                  value: 'Your Shop Address, City, State - 000000',
                  href: `https://maps.google.com/?q=${SHOP_LAT},${SHOP_LNG}`,
                },
                {
                  icon: Clock,
                  color: 'bg-amber-500',
                  label: isHindi ? 'समय' : 'Hours',
                  value: isHindi ? 'सोम–शनि: सुबह 9 – शाम 7' : 'Mon–Sat: 9am – 7pm',
                  href: undefined,
                },
              ].map(({ icon: Icon, color, label, value, href }) => (
                <a
                  key={label}
                  href={href}
                  target={href?.startsWith('http') ? '_blank' : undefined}
                  rel="noopener noreferrer"
                  className={`flex items-start gap-4 p-4 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 ${href ? 'hover:shadow-md transition-shadow cursor-pointer' : 'cursor-default'}`}
                >
                  <div className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center flex-shrink-0`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="text-xs text-gray-400 font-medium mb-0.5">{label}</div>
                    <div className="text-sm font-semibold text-gray-800 dark:text-gray-100">{value}</div>
                  </div>
                </a>
              ))}
            </motion.div>

            {/* Google Maps embed */}
            <div className="rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-700 shadow-sm h-48">
              <iframe
                title="Fastkaam Location"
                width="100%"
                height="100%"
                loading="lazy"
                allowFullScreen
                src={`https://www.google.com/maps/embed/v1/place?key=${MAPS_EMBED_KEY}&q=${SHOP_NAME}&center=${SHOP_LAT},${SHOP_LNG}&zoom=16`}
                className="border-0"
              />
            </div>
          </div>

          {/* Contact form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 }}
          >
            {sent ? (
              <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-10 flex flex-col items-center justify-center text-center h-full">
                <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-4">
                  <CheckCircle className="w-8 h-8 text-green-500" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-2">
                  {isHindi ? 'संदेश भेज दिया!' : 'Message Sent!'}
                </h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">
                  {isHindi ? 'हम 24 घंटे में जवाब देंगे।' : "We'll get back to you within 24 hours."}
                </p>
                <button
                  onClick={() => { setSent(false); setForm({ name: '', email: '', phone: '', subject: '', message: '' }) }}
                  className="text-orange-500 text-sm font-semibold hover:underline"
                >
                  {isHindi ? 'दूसरा संदेश भेजें' : 'Send another message'}
                </button>
              </div>
            ) : (
              <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6">
                <h2 className="font-bold text-gray-800 dark:text-gray-100 mb-5">
                  {isHindi ? 'संदेश भेजें' : 'Send a Message'}
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1 block">
                        {isHindi ? 'नाम *' : 'Name *'}
                      </label>
                      <input type="text" {...field('name')} required placeholder="Ramesh"
                        className="w-full px-3 py-2.5 text-sm rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500/30" />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1 block">
                        {isHindi ? 'फोन' : 'Phone'}
                      </label>
                      <input type="tel" {...field('phone')} placeholder="9876543210"
                        className="w-full px-3 py-2.5 text-sm rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500/30" />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1 block">
                      {isHindi ? 'ईमेल *' : 'Email *'}
                    </label>
                    <input type="email" {...field('email')} required placeholder="you@example.com"
                      className="w-full px-3 py-2.5 text-sm rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500/30" />
                  </div>

                  <div>
                    <label className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1 block">
                      {isHindi ? 'विषय' : 'Subject'}
                    </label>
                    <select {...field('subject')}
                      className="w-full px-3 py-2.5 text-sm rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-500/30">
                      <option value="">Select subject</option>
                      <option value="PVC Card Order">PVC Card Order</option>
                      <option value="Order Status">Order Status</option>
                      <option value="Digital Services">Digital Services</option>
                      <option value="Printing Services">Printing Services</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1 block">
                      {isHindi ? 'संदेश *' : 'Message *'}
                    </label>
                    <textarea {...field('message')} required rows={4} placeholder={isHindi ? 'आपका संदेश...' : 'Your message...'}
                      className="w-full px-3 py-2.5 text-sm rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500/30 resize-none" />
                  </div>

                  <button type="submit" disabled={loading}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-teal-600 to-blue-600 text-white font-bold text-sm hover:opacity-90 transition-opacity shadow-lg disabled:opacity-60 flex items-center justify-center gap-2">
                    {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Sending...</> : <><Send className="w-4 h-4" /> {isHindi ? 'भेजें' : 'Send Message'}</>}
                  </button>
                </form>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  )
}
