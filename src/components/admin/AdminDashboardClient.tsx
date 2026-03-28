'use client'
// src/components/admin/AdminDashboardClient.tsx

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import {
  Package, Users, IndianRupee, Clock, ChevronRight,
  BarChart3, FileText, Settings, LogOut, Menu, X
} from 'lucide-react'
import axios from 'axios'
import toast from 'react-hot-toast'
import { signOut } from 'next-auth/react'

const STATUS_COLORS: Record<string, string> = {
  PENDING:    'bg-yellow-100 text-yellow-700',
  PROCESSING: 'bg-blue-100 text-blue-700',
  PRINTING:   'bg-violet-100 text-violet-700',
  SHIPPED:    'bg-orange-100 text-orange-700',
  DELIVERED:  'bg-green-100 text-green-700',
  CANCELLED:  'bg-red-100 text-red-700',
}

const ORDER_STATUSES = ['PENDING','PROCESSING','PRINTING','SHIPPED','DELIVERED','CANCELLED']

const NAV = [
  { href: '/admin', label: 'Dashboard', icon: BarChart3 },
  { href: '/admin/orders', label: 'Orders', icon: Package },
  { href: '/admin/blog', label: 'Blog', icon: FileText },
  { href: '/admin/users', label: 'Users', icon: Users },
  { href: '/admin/products', label: 'Products', icon: Settings },
]

export default function AdminDashboardClient({ analytics }: { analytics: any }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [updatingOrder, setUpdatingOrder] = useState<string | null>(null)

  const updateOrderStatus = async (orderId: string, status: string) => {
    setUpdatingOrder(orderId)
    try {
      await axios.put(`/api/admin/orders/${orderId}`, { status })
      toast.success('Order status updated')
      window.location.reload()
    } catch {
      toast.error('Update failed')
    } finally {
      setUpdatingOrder(null)
    }
  }

  const STATS = [
    { label: 'Total Orders', value: analytics.totalOrders, icon: Package, color: 'from-blue-500 to-blue-700' },
    { label: 'Total Revenue', value: `₹${Number(analytics.totalRevenue).toLocaleString('en-IN')}`, icon: IndianRupee, color: 'from-green-500 to-emerald-700' },
    { label: 'Total Users', value: analytics.totalUsers, icon: Users, color: 'from-violet-500 to-purple-700' },
    { label: 'Pending Orders', value: analytics.pendingOrders, icon: Clock, color: 'from-orange-500 to-red-600' },
  ]

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900 pt-16">
      {/* Sidebar */}
      <aside className={`fixed left-0 top-16 bottom-0 w-60 bg-white dark:bg-gray-800 border-r border-gray-100 dark:border-gray-700 z-40 transform transition-transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>
        <div className="p-4">
          <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-3">Admin Panel</div>
          <nav className="space-y-1">
            {NAV.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-orange-50 dark:hover:bg-orange-950/30 hover:text-orange-600 dark:hover:text-orange-400 transition-all"
              >
                <Icon className="w-4 h-4" />
                {label}
              </Link>
            ))}
          </nav>
          <div className="mt-6 border-t border-gray-100 dark:border-gray-700 pt-4">
            <button
              onClick={() => signOut({ callbackUrl: '/' })}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-all w-full"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 md:ml-60 p-6">
        {/* Mobile header */}
        <div className="md:hidden flex items-center gap-3 mb-6">
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 rounded-xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
            {sidebarOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
          <h1 className="font-bold text-gray-800 dark:text-gray-100">Admin Dashboard</h1>
        </div>

        <div className="hidden md:block mb-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm">Welcome back, Admin</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {STATS.map((stat, i) => {
            const Icon = stat.icon
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-5"
              >
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-3`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <div className="text-2xl font-bold text-gray-800 dark:text-gray-100">{stat.value}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{stat.label}</div>
              </motion.div>
            )
          })}
        </div>

        {/* Order status breakdown */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-5">
            <h2 className="font-bold text-gray-800 dark:text-gray-100 mb-4">Orders by Status</h2>
            <div className="space-y-3">
              {analytics.ordersByStatus.map(({ status, _count }: any) => {
                const pct = analytics.totalOrders > 0 ? Math.round((_count.status / analytics.totalOrders) * 100) : 0
                return (
                  <div key={status}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className={`font-medium px-2 py-0.5 rounded-md text-xs ${STATUS_COLORS[status]}`}>{status}</span>
                      <span className="text-gray-500 dark:text-gray-400">{_count.status} ({pct}%)</span>
                    </div>
                    <div className="h-1.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="h-full bg-gradient-to-r from-orange-400 to-violet-500 rounded-full"
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Quick links */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-5">
            <h2 className="font-bold text-gray-800 dark:text-gray-100 mb-4">Quick Actions</h2>
            <div className="space-y-2">
              {[
                { href: '/admin/blog/new', label: 'Write New Blog Post', icon: FileText },
                { href: '/admin/orders?status=PENDING', label: 'View Pending Orders', icon: Clock },
                { href: '/admin/products', label: 'Manage PVC Products', icon: Settings },
                { href: '/admin/users', label: 'Manage Users', icon: Users },
              ].map(({ href, label, icon: Icon }) => (
                <Link
                  key={href}
                  href={href}
                  className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4 text-orange-500" />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-gray-500 transition-colors" />
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden">
          <div className="flex items-center justify-between p-5 border-b border-gray-100 dark:border-gray-700">
            <h2 className="font-bold text-gray-800 dark:text-gray-100">Recent Orders</h2>
            <Link href="/admin/orders" className="text-sm text-orange-500 font-medium hover:underline">
              View all →
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-50 dark:border-gray-700">
                  {['Order ID', 'Customer', 'Items', 'Amount', 'Status', 'Action'].map((h) => (
                    <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-gray-700">
                {analytics.recentOrders.map((order: any) => (
                  <tr key={order.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                    <td className="px-5 py-3.5 font-mono text-xs text-gray-600 dark:text-gray-400">{order.orderId}</td>
                    <td className="px-5 py-3.5">
                      <div className="font-medium text-gray-800 dark:text-gray-100 text-sm">{order.user.name}</div>
                      <div className="text-xs text-gray-400">{order.user.email}</div>
                    </td>
                    <td className="px-5 py-3.5 text-gray-500 dark:text-gray-400">{order.items.length} cards</td>
                    <td className="px-5 py-3.5 font-semibold text-gray-800 dark:text-gray-100">
                      ₹{Number(order.totalAmount).toLocaleString('en-IN')}
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`px-2 py-1 rounded-lg text-xs font-medium ${STATUS_COLORS[order.status]}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <select
                        value={order.status}
                        disabled={updatingOrder === order.id}
                        onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                        className="text-xs border border-gray-200 dark:border-gray-600 rounded-lg px-2 py-1 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 disabled:opacity-50"
                      >
                        {ORDER_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  )
}
