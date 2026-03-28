'use client'
// src/app/payment/callback/PaymentCallbackClient.tsx

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { CheckCircle, XCircle, Loader2, ArrowRight } from 'lucide-react'

export default function PaymentCallbackClient() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [status, setStatus] = useState<'loading' | 'success' | 'failed'>('loading')
  const [orderId, setOrderId] = useState('')

  useEffect(() => {
    const txnStatus = searchParams.get('STATUS') || searchParams.get('status')
    const orderIdParam = searchParams.get('ORDERID') || searchParams.get('orderId')
    setOrderId(orderIdParam || '')

    if (txnStatus === 'TXN_SUCCESS') {
      setStatus('success')
      setTimeout(() => router.push('/dashboard'), 3000)
    } else if (txnStatus === 'TXN_FAILURE') {
      setStatus('failed')
    } else {
      setTimeout(() => {
        const s = searchParams.get('STATUS')
        setStatus(s === 'TXN_SUCCESS' ? 'success' : 'failed')
      }, 500)
    }
  }, [searchParams, router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-xl p-10 max-w-md w-full text-center"
      >
        {status === 'loading' && (
          <>
            <Loader2 className="w-16 h-16 animate-spin text-orange-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-2">Processing Payment...</h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm">Please wait while we confirm your payment.</p>
          </>
        )}

        {status === 'success' && (
          <>
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', delay: 0.1 }}>
              <div className="w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-10 h-10 text-green-500" />
              </div>
            </motion.div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">Payment Successful! 🎉</h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-2">Your order has been placed successfully.</p>
            {orderId && <p className="text-xs font-mono text-gray-400 mb-6">Order ID: {orderId}</p>}
            <p className="text-xs text-gray-400 mb-6">Redirecting to dashboard in 3 seconds...</p>
            <Link href="/dashboard"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-violet-600 text-white font-bold text-sm hover:opacity-90 transition-opacity">
              Go to Dashboard <ArrowRight className="w-4 h-4" />
            </Link>
          </>
        )}

        {status === 'failed' && (
          <>
            <div className="w-20 h-20 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mx-auto mb-4">
              <XCircle className="w-10 h-10 text-red-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">Payment Failed</h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">
              Your payment could not be processed. Your cart is still saved — please try again.
            </p>
            <div className="flex gap-3 justify-center">
              <Link href="/cart"
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-violet-600 text-white font-bold text-sm hover:opacity-90">
                Try Again
              </Link>
              <Link href="/contact"
                className="px-5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400 font-medium text-sm hover:bg-gray-50 dark:hover:bg-gray-700">
                Contact Support
              </Link>
            </div>
          </>
        )}
      </motion.div>
    </div>
  )
}
