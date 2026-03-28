'use client'
// src/app/admin/users/page.tsx

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Search, ShieldOff, Shield, Loader2, Mail, Phone } from 'lucide-react'
import axios from 'axios'
import toast from 'react-hot-toast'

interface User {
  id: string; name: string; email: string; phone?: string
  role: string; isBlocked: boolean; createdAt: string; _count: { orders: number }
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [toggling, setToggling] = useState<string | null>(null)

  useEffect(() => { fetchUsers() }, [])

  const fetchUsers = async () => {
    try {
      const { data } = await axios.get('/api/admin/users')
      setUsers(data.users)
    } catch { toast.error('Failed to load users') }
    finally { setLoading(false) }
  }

  const toggleBlock = async (id: string, isBlocked: boolean) => {
    setToggling(id)
    try {
      await axios.put(`/api/admin/users/${id}`, { isBlocked: !isBlocked })
      setUsers(users.map(u => u.id === id ? { ...u, isBlocked: !isBlocked } : u))
      toast.success(isBlocked ? 'User unblocked' : 'User blocked')
    } catch { toast.error('Action failed') }
    finally { setToggling(null) }
  }

  const filtered = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="min-h-screen pt-16 bg-gray-50 dark:bg-gray-900 flex">
      <div className="hidden md:block w-60 flex-shrink-0" />
      <main className="flex-1 p-6">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Users</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">{users.length} registered users</p>
            </div>
          </div>

          {/* Search */}
          <div className="relative mb-5">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text" placeholder="Search by name or email..." value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/30"
            />
          </div>

          {loading ? (
            <div className="flex justify-center py-16"><Loader2 className="w-8 h-8 animate-spin text-orange-500" /></div>
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 dark:border-gray-700">
                    {['User', 'Contact', 'Orders', 'Joined', 'Status', 'Action'].map(h => (
                      <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 dark:divide-gray-700/50">
                  {filtered.map((user, i) => (
                    <motion.tr key={user.id}
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.03 }}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors"
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-orange-400 to-violet-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                            {user.name?.[0]?.toUpperCase()}
                          </div>
                          <div>
                            <div className="font-medium text-gray-800 dark:text-gray-100">{user.name}</div>
                            {user.role === 'ADMIN' && (
                              <span className="text-xs text-violet-600 dark:text-violet-400 font-semibold">Admin</span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 mb-1">
                          <Mail className="w-3 h-3" /> {user.email}
                        </div>
                        {user.phone && (
                          <div className="flex items-center gap-1 text-xs text-gray-400">
                            <Phone className="w-3 h-3" /> {user.phone}
                          </div>
                        )}
                      </td>
                      <td className="px-5 py-4">
                        <span className="font-semibold text-gray-700 dark:text-gray-300">{user._count.orders}</span>
                      </td>
                      <td className="px-5 py-4 text-xs text-gray-400">
                        {new Date(user.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: '2-digit' })}
                      </td>
                      <td className="px-5 py-4">
                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                          user.isBlocked
                            ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                            : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                        }`}>
                          {user.isBlocked ? 'Blocked' : 'Active'}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        {user.role !== 'ADMIN' && (
                          <button
                            onClick={() => toggleBlock(user.id, user.isBlocked)}
                            disabled={toggling === user.id}
                            className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg transition-all disabled:opacity-50 ${
                              user.isBlocked
                                ? 'text-green-600 hover:bg-green-50 dark:hover:bg-green-950/30'
                                : 'text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30'
                            }`}
                          >
                            {toggling === user.id
                              ? <Loader2 className="w-3 h-3 animate-spin" />
                              : user.isBlocked ? <Shield className="w-3 h-3" /> : <ShieldOff className="w-3 h-3" />}
                            {user.isBlocked ? 'Unblock' : 'Block'}
                          </button>
                        )}
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
              {filtered.length === 0 && (
                <div className="text-center py-12 text-gray-400 text-sm">No users found</div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
