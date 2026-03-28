'use client'
// src/components/layout/Footer.tsx

import Link from 'next/link'
import { useLanguageStore } from '@/stores/languageStore'
import { Phone, Mail, MapPin, Youtube, Facebook, Instagram } from 'lucide-react'

const LINKS = {
  Services: [
    { href: '/pvc-cards', label: 'PVC Card Printing', labelHi: 'PVC कार्ड प्रिंटिंग' },
    { href: '/services#digital', label: 'Digital Services', labelHi: 'डिजिटल सेवाएं' },
    { href: '/services#printing', label: 'Printing Services', labelHi: 'प्रिंटिंग सेवाएं' },
    { href: '/services#online', label: 'Online Services', labelHi: 'ऑनलाइन सेवाएं' },
  ],
  Company: [
    { href: '/about', label: 'About Us', labelHi: 'हमारे बारे में' },
    { href: '/blog', label: 'Blog', labelHi: 'ब्लॉग' },
    { href: '/contact', label: 'Contact', labelHi: 'संपर्क' },
    { href: '/faq', label: 'FAQ', labelHi: 'FAQ' },
  ],
  Legal: [
    { href: '/privacy', label: 'Privacy Policy', labelHi: 'गोपनीयता नीति' },
    { href: '/terms', label: 'Terms of Service', labelHi: 'सेवा की शर्तें' },
    { href: '/refund', label: 'Refund Policy', labelHi: 'धनवापसी नीति' },
    { href: '/shipping', label: 'Shipping Policy', labelHi: 'शिपिंग नीति' },
  ],
}

export default function Footer() {
  const { isHindi } = useLanguageStore()
  const year = new Date().getFullYear()

  return (
    <footer className="bg-gray-950 text-gray-400">
      <div className="max-w-6xl mx-auto px-4 pt-16 pb-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-500 to-violet-600 flex items-center justify-center text-white font-bold text-lg">
                F
              </div>
              <div>
                <div className="font-bold text-white text-sm leading-tight">Fastkaam</div>
                <div className="text-[10px] text-gray-500 leading-tight">Computer & Printing Press</div>
              </div>
            </div>
            <p className="text-sm text-gray-500 leading-relaxed mb-4">
              {isHindi
                ? 'प्रीमियम PVC कार्ड प्रिंटिंग और डिजिटल सेवाएं।'
                : 'Premium PVC card printing and digital services for everyone.'}
            </p>
            <div className="flex gap-3">
              {[
                { icon: Youtube, href: '#', color: 'hover:text-red-500' },
                { icon: Facebook, href: '#', color: 'hover:text-blue-500' },
                { icon: Instagram, href: '#', color: 'hover:text-pink-500' },
              ].map(({ icon: Icon, href, color }) => (
                <a
                  key={href}
                  href={href}
                  className={`w-8 h-8 rounded-lg bg-gray-800 flex items-center justify-center transition-colors ${color}`}
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(LINKS).map(([category, links]) => (
            <div key={category}>
              <h3 className="text-white font-semibold text-sm mb-4">{category}</h3>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-gray-500 hover:text-orange-400 transition-colors"
                    >
                      {isHindi ? link.labelHi : link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Contact strip */}
        <div className="border-t border-gray-800 pt-8 mb-8">
          <div className="flex flex-wrap gap-6 text-sm">
            <a href={`tel:${process.env.NEXT_PUBLIC_PHONE_NUMBER}`} className="flex items-center gap-2 hover:text-orange-400 transition-colors">
              <Phone className="w-4 h-4 text-orange-500" />
              {process.env.NEXT_PUBLIC_PHONE_NUMBER || '+91-XXXXXXXXXX'}
            </a>
            <a href="mailto:hello@fastkaam.in" className="flex items-center gap-2 hover:text-orange-400 transition-colors">
              <Mail className="w-4 h-4 text-orange-500" />
              hello@fastkaam.in
            </a>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-orange-500" />
              Your City, State, India
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-gray-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-600">
          <div>© {year} Fastkaam Computer & Printing Press. All rights reserved.</div>
          <div className="flex items-center gap-1">
            Made with ❤️ in India
          </div>
        </div>
      </div>
    </footer>
  )
}
