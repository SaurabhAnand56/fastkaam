// src/app/payment/callback/page.tsx
import { Suspense } from 'react'
import PaymentCallbackClient from './PaymentCallbackClient'

export default function PaymentCallbackPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <PaymentCallbackClient />
    </Suspense>
  )
}
