'use client'
// src/app/signup/page.tsx

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { signIn } from 'next-auth/react'
import { motion } from 'framer-motion'
import { Eye, EyeOff, Loader2, CheckCircle } from 'lucide-react'
import axios from 'axios'
import toast from 'react-hot-toast'

export default function SignupPage() {
  const router = useRouter()
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '' })
  const [showPwd, setShowPwd] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validate = () => {
    const e: Record<string, string> = {}
    if (!form.name.trim() || form.name.length < 2) e.name = 'Name must be at least 2 characters'
    if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) e.email = 'Enter a valid email address'
    if (form.password.length < 8) e.password = 'Password must be at least 8 characters'
    if (!form.password.match(/(?=.*[A-Z])(?=.*[0-9])/)) e.password = 'Password needs a number and uppercase letter'
    return e
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setLoading(true)
    setErrors({})

    try {
      await axios.post('/api/auth/register', form)
      toast.success('Account created! Signing you in...')
      const result = await signIn('credentials', {
        email: form.email,
        password: form.password,
        redirect: false,
      })
      if (result?.ok) router.push('/dashboard')
    } catch (err: any) {
      const msg = err.response?.data?.error || 'Registration failed'
      if (msg.includes('email')) setErrors({ email: 'This email is already registered' })
      else toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  const field = (key: keyof typeof form) => ({
    value: form[key],
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm((f) => ({ ...f, [key]: e.target.value }))
      if (errors[key]) setErrors((err) => ({ ...err, [key]: '' }))
    },
  })

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 px-4 py-16">
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-500 to-violet-600 flex items-center justify-center text-white font-bold text-2xl shadow-lg shadow-orange-500/30">F</div>
            <div className="text-left">
              <div className="font-bold text-gray-900 dark:text-white">Fastkaam</div>
              <div className="text-xs text-gray-500">Computer & Printing Press</div>
            </div>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mt-6 mb-1">Create your account</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm">Start ordering PVC cards today</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-xl p-8">
          {/* Google */}
          <button
            onClick={() => signIn('google', { callbackUrl: '/dashboard' })}
            className="w-full flex items-center justify-center gap-3 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 font-medium text-sm hover:bg-gray-50 dark:hover:bg-gray-600 transition-all mb-5 shadow-sm"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Sign up with Google
          </button>

          <div className="relative flex items-center gap-3 mb-5">
            <div className="flex-1 h-px bg-gray-100 dark:bg-gray-700" />
            <span className="text-xs text-gray-400">or with email</span>
            <div className="flex-1 h-px bg-gray-100 dark:bg-gray-700" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Full Name</label>
              <input type="text" {...field('name')} placeholder="Ramesh Kumar"
                className={`w-full px-4 py-3 rounded-xl border text-sm bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500/40 transition-all ${errors.name ? 'border-red-400' : 'border-gray-200 dark:border-gray-600'}`} />
              {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Email address</label>
              <input type="email" {...field('email')} placeholder="you@example.com"
                className={`w-full px-4 py-3 rounded-xl border text-sm bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500/40 transition-all ${errors.email ? 'border-red-400' : 'border-gray-200 dark:border-gray-600'}`} />
              {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Phone (optional)</label>
              <input type="tel" {...field('phone')} placeholder="9876543210"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 text-sm bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500/40 transition-all" />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Password</label>
              <div className="relative">
                <input type={showPwd ? 'text' : 'password'} {...field('password')} placeholder="Min 8 chars, 1 uppercase, 1 number"
                  className={`w-full px-4 py-3 pr-11 rounded-xl border text-sm bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500/40 transition-all ${errors.password ? 'border-red-400' : 'border-gray-200 dark:border-gray-600'}`} />
                <button type="button" onClick={() => setShowPwd(!showPwd)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                  {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}
            </div>

            <button type="submit" disabled={loading}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-orange-500 to-violet-600 text-white font-bold text-sm hover:opacity-90 transition-opacity shadow-lg shadow-orange-500/25 disabled:opacity-60 flex items-center justify-center gap-2">
              {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Creating account...</> : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-5">
            Already have an account?{' '}
            <Link href="/login" className="text-orange-500 font-semibold hover:underline">Sign in</Link>
          </p>
        </div>
      </motion.div>
    </div>
  )
}
