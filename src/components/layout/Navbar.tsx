'use client'
// src/components/layout/Navbar.tsx

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useTheme } from 'next-themes'
import { useSession } from 'next-auth/react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Sun, Moon, ShoppingCart, User, Globe } from 'lucide-react'
import { useCartStore } from '@/stores/cartStore'
import { useLanguageStore } from '@/stores/languageStore'

const NAV_LINKS = [
  { href: '/', label: 'Home', labelHi: 'होम' },
  { href: '/services', label: 'Services', labelHi: 'सेवाएं' },
  { href: '/pvc-cards', label: 'PVC Cards', labelHi: 'PVC कार्ड' },
  { href: '/blog', label: 'Blog', labelHi: 'ब्लॉग' },
  { href: '/about', label: 'About', labelHi: 'हमारे बारे में' },
  { href: '/contact', label: 'Contact', labelHi: 'संपर्क' },
]

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { theme, setTheme } = useTheme()
  const { data: session } = useSession()
  const { itemCount } = useCartStore()
  const { isHindi, toggleLanguage } = useLanguageStore()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/95 dark:bg-gray-950/95 backdrop-blur-md shadow-sm border-b border-gray-100 dark:border-gray-800'
          : 'bg-transparent'
      }`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-500 to-violet-600 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-orange-500/30 group-hover:scale-105 transition-transform">
              F
            </div>
            <div className="hidden sm:block">
              <div className="font-bold text-gray-900 dark:text-white leading-tight text-sm">
                Fastkaam
              </div>
              <div className="text-[10px] text-gray-500 dark:text-gray-400 leading-tight">
                Computer & Printing Press
              </div>
            </div>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-3 py-2 rounded-lg text-sm text-gray-600 dark:text-gray-300 hover:text-orange-600 dark:hover:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-950/30 transition-all font-medium"
              >
                {isHindi ? link.labelHi : link.label}
              </Link>
            ))}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            {/* Hindi Toggle */}
            <button
              onClick={toggleLanguage}
              title="Toggle Hindi"
              className="p-2 rounded-lg text-gray-500 hover:text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-950/30 transition-all text-xs font-bold"
            >
              {isHindi ? 'EN' : 'हि'}
            </button>

            {/* Dark Mode */}
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2 rounded-lg text-gray-500 hover:text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-950/30 transition-all"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Cart */}
            <Link
              href="/cart"
              className="relative p-2 rounded-lg text-gray-500 hover:text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-950/30 transition-all"
            >
              <ShoppingCart className="w-4 h-4" />
              {itemCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-orange-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </Link>

            {/* Auth */}
            {session ? (
              <Link
                href={session.user.role === 'ADMIN' ? '/admin' : '/dashboard'}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gradient-to-r from-orange-500 to-violet-600 text-white text-sm font-medium hover:opacity-90 transition-opacity"
              >
                <User className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{session.user.name?.split(' ')[0]}</span>
              </Link>
            ) : (
              <Link
                href="/login"
                className="px-4 py-1.5 rounded-lg bg-gradient-to-r from-orange-500 to-violet-600 text-white text-sm font-medium hover:opacity-90 transition-opacity shadow-md shadow-orange-500/25"
              >
                {isHindi ? 'लॉगिन' : 'Login'}
              </Link>
            )}

            {/* Mobile menu */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white dark:bg-gray-950 border-t border-gray-100 dark:border-gray-800"
          >
            <div className="px-4 py-3 flex flex-col gap-1">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-3 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-orange-50 dark:hover:bg-orange-950/30 hover:text-orange-600 transition-all"
                >
                  {isHindi ? link.labelHi : link.label}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
