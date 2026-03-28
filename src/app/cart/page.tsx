'use client'
// src/app/cart/page.tsx

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { ShoppingCart, Trash2, Plus, Minus, ArrowRight, ShieldCheck, Loader2 } from 'lucide-react'
import { useCartStore } from '@/stores/cartStore'
import axios from 'axios'
import toast from 'react-hot-toast'

export default function CartPage() {
  const { items, removeItem, updateQuantity, totalAmount, itemCount } = useCartStore()
  const { data: session } = useSession()
  const [checkingOut, setCheckingOut] = useState(false)
  const [address, setAddress] = useState({ name: '', line1: '', city: '', state: '', pincode: '', phone: '' })
  const [showAddressForm, setShowAddressForm] = useState(false)

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!session) { toast.error('Please login to checkout'); return }
    if (!address.name || !address.line1 || !address.city || !address.pincode) {
      toast.error('Please fill in your shipping address')
      return
    }
    setCheckingOut(true)
    try {
      const { data } = await axios.post('/api/payment/initiate', { shippingAddress: address })

      // Submit Paytm form
      const form = document.createElement('form')
      form.method = 'POST'
      form.action = data.paytmUrl

      Object.entries(data.paytmParams).forEach(([key, value]) => {
        const input = document.createElement('input')
        input.type = 'hidden'
        input.name = key
        input.value = value as string
        form.appendChild(input)
      })

      document.body.appendChild(form)
      form.submit()
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Checkout failed. Try again.')
      setCheckingOut(false)
    }
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="w-20 h-20 rounded-3xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center mx-auto mb-4">
            <ShoppingCart className="w-10 h-10 text-gray-300 dark:text-gray-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">Your cart is empty</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-6">Add PVC card orders to get started</p>
          <Link href="/pvc-cards"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-orange-500 to-violet-600 text-white font-bold hover:opacity-90 transition-opacity shadow-lg">
            Browse PVC Cards <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-20 pb-16 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Shopping Cart ({itemCount} item{itemCount > 1 ? 's' : ''})
        </h1>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Cart items */}
          <div className="md:col-span-2 space-y-3">
            <AnimatePresence>
              {items.map((item) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-5"
                >
                  <div className="flex items-start gap-4">
                    {/* Card previews */}
                    <div className="flex gap-2 flex-shrink-0">
                      {[item.frontPreview, item.backPreview].map((src, i) => (
                        <div key={i} className="w-16 h-10 rounded-lg overflow-hidden border border-gray-100 dark:border-gray-700">
                          {src ? (
                            <img src={src} alt={i === 0 ? 'Front' : 'Back'} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-xs text-gray-400">
                              {i === 0 ? 'F' : 'B'}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-gray-800 dark:text-gray-100 text-sm">{item.cardName}</div>
                      <div className="text-xs text-gray-400 mt-0.5">₹{item.unitPrice} per card</div>
                    </div>

                    <div className="flex items-center gap-3 flex-shrink-0">
                      {/* Quantity */}
                      <div className="flex items-center gap-1 border border-gray-200 dark:border-gray-600 rounded-xl overflow-hidden">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        >
                          <Minus className="w-3.5 h-3.5 text-gray-500" />
                        </button>
                        <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        >
                          <Plus className="w-3.5 h-3.5 text-gray-500" />
                        </button>
                      </div>

                      <div className="font-bold text-orange-500 text-sm w-16 text-right">
                        ₹{item.unitPrice * item.quantity}
                      </div>

                      <button
                        onClick={() => removeItem(item.id)}
                        className="p-1.5 text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Shipping address form */}
            {showAddressForm && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-5"
              >
                <h3 className="font-semibold text-gray-800 dark:text-gray-100 mb-4">Shipping Address</h3>
                <form onSubmit={handleCheckout} className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs text-gray-500 mb-1 block">Full Name *</label>
                      <input type="text" value={address.name} onChange={e => setAddress(a => ({ ...a, name: e.target.value }))} required
                        className="w-full px-3 py-2 text-sm rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500/30" />
                    </div>
                    <div>
                      <label className="text-xs text-gray-500 mb-1 block">Phone *</label>
                      <input type="tel" value={address.phone} onChange={e => setAddress(a => ({ ...a, phone: e.target.value }))} required
                        className="w-full px-3 py-2 text-sm rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500/30" />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 mb-1 block">Address *</label>
                    <input type="text" value={address.line1} onChange={e => setAddress(a => ({ ...a, line1: e.target.value }))} required
                      placeholder="House/Flat no., Street, Area"
                      className="w-full px-3 py-2 text-sm rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500/30" />
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="text-xs text-gray-500 mb-1 block">City *</label>
                      <input type="text" value={address.city} onChange={e => setAddress(a => ({ ...a, city: e.target.value }))} required
                        className="w-full px-3 py-2 text-sm rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500/30" />
                    </div>
                    <div>
                      <label className="text-xs text-gray-500 mb-1 block">State</label>
                      <input type="text" value={address.state} onChange={e => setAddress(a => ({ ...a, state: e.target.value }))}
                        className="w-full px-3 py-2 text-sm rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500/30" />
                    </div>
                    <div>
                      <label className="text-xs text-gray-500 mb-1 block">Pincode *</label>
                      <input type="text" value={address.pincode} onChange={e => setAddress(a => ({ ...a, pincode: e.target.value }))} required maxLength={6}
                        className="w-full px-3 py-2 text-sm rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500/30" />
                    </div>
                  </div>
                  <button type="submit" disabled={checkingOut}
                    className="w-full py-3.5 rounded-xl bg-gradient-to-r from-orange-500 to-violet-600 text-white font-bold text-sm hover:opacity-90 transition-opacity shadow-lg disabled:opacity-60 flex items-center justify-center gap-2">
                    {checkingOut ? <><Loader2 className="w-4 h-4 animate-spin" /> Processing...</> : <>Proceed to Payment — ₹{totalAmount}</>}
                  </button>
                </form>
              </motion.div>
            )}
          </div>

          {/* Order summary sidebar */}
          <div>
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-5 sticky top-24">
              <h3 className="font-bold text-gray-800 dark:text-gray-100 mb-4">Order Summary</h3>

              <div className="space-y-2 mb-4 text-sm">
                <div className="flex justify-between text-gray-500 dark:text-gray-400">
                  <span>Subtotal ({itemCount} items)</span>
                  <span>₹{totalAmount}</span>
                </div>
                <div className="flex justify-between text-gray-500 dark:text-gray-400">
                  <span>Shipping</span>
                  <span className="text-green-500 font-medium">Free</span>
                </div>
                <div className="border-t border-gray-100 dark:border-gray-700 pt-2 flex justify-between font-bold text-base text-gray-800 dark:text-gray-100">
                  <span>Total</span>
                  <span className="text-orange-500">₹{totalAmount}</span>
                </div>
              </div>

              {!session ? (
                <Link href="/login?callbackUrl=/cart"
                  className="block w-full py-3 text-center rounded-xl bg-gradient-to-r from-orange-500 to-violet-600 text-white font-bold text-sm hover:opacity-90 transition-opacity shadow-lg">
                  Login to Checkout
                </Link>
              ) : (
                <button
                  onClick={() => setShowAddressForm(true)}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-orange-500 to-violet-600 text-white font-bold text-sm hover:opacity-90 transition-opacity shadow-lg flex items-center justify-center gap-2"
                >
                  Checkout <ArrowRight className="w-4 h-4" />
                </button>
              )}

              <div className="flex items-center gap-2 mt-4 text-xs text-gray-400">
                <ShieldCheck className="w-4 h-4 text-green-500" />
                Secured by Paytm Payment Gateway
              </div>

              <div className="flex gap-2 mt-3 justify-center flex-wrap">
                {['UPI', 'Debit', 'Credit', 'Net Banking'].map(m => (
                  <span key={m} className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-500 px-2 py-1 rounded-lg">{m}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
