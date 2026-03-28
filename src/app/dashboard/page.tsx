'use client'
// src/app/dashboard/page.tsx — User Dashboard

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import Link from 'next/link'
import {
  Package, Clock, CheckCircle, XCircle, Download,
  User, Mail, ChevronRight, Loader2
} from 'lucide-react'
import axios from 'axios'
import toast from 'react-hot-toast'

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: any }> = {
  PENDING:    { label: 'Pending',    color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400', icon: Clock },
  PROCESSING: { label: 'Processing', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',   icon: Loader2 },
  PRINTING:   { label: 'Printing',   color: 'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400', icon: Package },
  SHIPPED:    { label: 'Shipped',    color: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400', icon: Package },
  DELIVERED:  { label: 'Delivered',  color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',  icon: CheckCircle },
  CANCELLED:  { label: 'Cancelled',  color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',      icon: XCircle },
}

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({ total: 0, pending: 0, delivered: 0 })

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/login?callbackUrl=/dashboard')
  }, [status, router])

  useEffect(() => {
    if (session) fetchOrders()
  }, [session])

  const fetchOrders = async () => {
    try {
      const { data } = await axios.get('/api/orders?limit=20')
      setOrders(data.orders)
      setStats({
        total: data.total,
        pending: data.orders.filter((o: any) => ['PENDING', 'PROCESSING', 'PRINTING', 'SHIPPED'].includes(o.status)).length,
        delivered: data.orders.filter((o: any) => o.status === 'DELIVERED').length,
      })
    } catch {
      toast.error('Failed to load orders')
    } finally {
      setLoading(false)
    }
  }

  const cancelOrder = async (orderId: string) => {
    try {
      await axios.put(`/api/orders/${orderId}/cancel`)
      toast.success('Order cancelled')
      fetchOrders()
    } catch {
      toast.error('Cannot cancel this order')
    }
  }

  if (status === 'loading' || (status === 'authenticated' && loading)) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
      </div>
    )
  }

  if (status === 'unauthenticated') return null

  return (
    <div className="min-h-screen pt-20 pb-16 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-5xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 pt-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Hello, {session?.user?.name?.split(' ')[0]} 👋
            </h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm">Manage your orders and account</p>
          </div>
          <Link
            href="/pvc-cards"
            className="px-4 py-2 bg-gradient-to-r from-orange-500 to-violet-600 text-white rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity shadow-lg shadow-orange-500/25"
          >
            + New Order
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: 'Total Orders', value: stats.total, color: 'text-gray-800 dark:text-white' },
            { label: 'In Progress', value: stats.pending, color: 'text-orange-500' },
            { label: 'Delivered', value: stats.delivered, color: 'text-green-500' },
          ].map((s) => (
            <div key={s.label} className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-100 dark:border-gray-700 text-center">
              <div className={`text-3xl font-bold ${s.color} mb-1`}>{s.value}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Orders list */}
          <div className="md:col-span-2">
            <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4">Your Orders</h2>
            {orders.length === 0 ? (
              <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-12 text-center">
                <Package className="w-12 h-12 text-gray-200 dark:text-gray-700 mx-auto mb-3" />
                <div className="text-gray-500 dark:text-gray-400 font-medium">No orders yet</div>
                <Link href="/pvc-cards" className="text-orange-500 text-sm font-semibold hover:underline mt-2 inline-block">
                  Place your first order →
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {orders.map((order) => {
                  const cfg = STATUS_CONFIG[order.status]
                  const StatusIcon = cfg.icon
                  const canCancel = ['PENDING', 'PROCESSING'].includes(order.status)
                  return (
                    <motion.div
                      key={order.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-5"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-bold text-sm text-gray-800 dark:text-gray-100 truncate">
                              #{order.orderId}
                            </span>
                            <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${cfg.color}`}>
                              <StatusIcon className="w-3 h-3" />
                              {cfg.label}
                            </span>
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                            {order.items.length} item{order.items.length > 1 ? 's' : ''} ·{' '}
                            {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </div>
                          {/* Item thumbnails */}
                          <div className="flex gap-2">
                            {order.items.slice(0, 3).map((item: any, i: number) => (
                              <img
                                key={i}
                                src={item.frontImageUrl}
                                alt="card"
                                className="w-12 h-8 rounded-lg object-cover border border-gray-100 dark:border-gray-700"
                              />
                            ))}
                          </div>
                        </div>

                        <div className="text-right flex-shrink-0">
                          <div className="font-bold text-gray-800 dark:text-gray-100 mb-2">
                            ₹{Number(order.totalAmount).toLocaleString('en-IN')}
                          </div>
                          <div className="flex flex-col gap-1.5">
                            {order.status === 'DELIVERED' && (
                              <a
                                href={`/api/invoice/${order.id}`}
                                className="flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400 font-medium hover:underline"
                              >
                                <Download className="w-3.5 h-3.5" /> Invoice
                              </a>
                            )}
                            {canCancel && (
                              <button
                                onClick={() => cancelOrder(order.id)}
                                className="text-xs text-red-500 font-medium hover:underline"
                              >
                                Cancel
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            )}
          </div>

          {/* Profile sidebar */}
          <div>
            <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4">Profile</h2>
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-5">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-400 to-violet-600 flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                {session?.user?.name?.[0]?.toUpperCase()}
              </div>
              <div className="text-center mb-4">
                <div className="font-bold text-gray-800 dark:text-gray-100">{session?.user?.name}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">{session?.user?.email}</div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-700/50 rounded-xl p-3">
                  <Mail className="w-3.5 h-3.5" />
                  {session?.user?.email}
                </div>
              </div>
              <Link
                href="/dashboard/profile"
                className="mt-4 flex items-center justify-between text-sm text-orange-500 font-medium hover:underline"
              >
                Edit Profile <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
