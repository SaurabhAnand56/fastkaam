'use client'
// src/app/admin/products/page.tsx — PVC Product Management

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, Pencil, ToggleLeft, ToggleRight, Save, X, Loader2, IndianRupee } from 'lucide-react'
import axios from 'axios'
import toast from 'react-hot-toast'

interface Product {
  id: string
  name: string
  nameHindi: string | null
  type: string
  price: number
  description: string | null
  isActive: boolean
  sortOrder: number
}

const EMPTY: Omit<Product, 'id'> = {
  name: '', nameHindi: '', type: 'CUSTOM', price: 30,
  description: '', isActive: true, sortOrder: 10,
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editForm, setEditForm] = useState<Partial<Product>>({})
  const [saving, setSaving] = useState(false)

  useEffect(() => { fetchProducts() }, [])

  const fetchProducts = async () => {
    try {
      const { data } = await axios.get('/api/admin/products')
      setProducts(data.products)
    } catch { toast.error('Failed to load products') }
    finally { setLoading(false) }
  }

  const startEdit = (p: Product) => {
    setEditingId(p.id)
    setEditForm({ ...p })
  }

  const saveEdit = async () => {
    if (!editingId) return
    setSaving(true)
    try {
      await axios.put(`/api/admin/products/${editingId}`, editForm)
      toast.success('Product updated')
      setEditingId(null)
      fetchProducts()
    } catch { toast.error('Save failed') }
    finally { setSaving(false) }
  }

  const toggleActive = async (id: string, isActive: boolean) => {
    try {
      await axios.patch(`/api/admin/products/${id}`, { isActive: !isActive })
      setProducts(products.map(p => p.id === id ? { ...p, isActive: !isActive } : p))
      toast.success(`Product ${!isActive ? 'enabled' : 'disabled'}`)
    } catch { toast.error('Toggle failed') }
  }

  return (
    <div className="min-h-screen pt-16 bg-gray-50 dark:bg-gray-900 flex">
      <div className="hidden md:block w-60 flex-shrink-0" />
      <main className="flex-1 p-6 max-w-4xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">PVC Products</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">Manage card types and pricing</p>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-16"><Loader2 className="w-8 h-8 animate-spin text-orange-500" /></div>
        ) : (
          <div className="space-y-3">
            {products.map((product, i) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-5"
              >
                {editingId === product.id ? (
                  /* Edit mode */
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs text-gray-500 mb-1 block">Name (English)</label>
                        <input
                          value={editForm.name || ''}
                          onChange={e => setEditForm(f => ({ ...f, name: e.target.value }))}
                          className="w-full px-3 py-2 text-sm rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500/30"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-gray-500 mb-1 block">Name (Hindi)</label>
                        <input
                          value={editForm.nameHindi || ''}
                          onChange={e => setEditForm(f => ({ ...f, nameHindi: e.target.value }))}
                          className="w-full px-3 py-2 text-sm rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500/30"
                          placeholder="हिंदी नाम"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs text-gray-500 mb-1 block">Price (₹)</label>
                        <input
                          type="number"
                          value={editForm.price || ''}
                          onChange={e => setEditForm(f => ({ ...f, price: Number(e.target.value) }))}
                          min="1"
                          className="w-full px-3 py-2 text-sm rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500/30"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-gray-500 mb-1 block">Sort Order</label>
                        <input
                          type="number"
                          value={editForm.sortOrder || ''}
                          onChange={e => setEditForm(f => ({ ...f, sortOrder: Number(e.target.value) }))}
                          className="w-full px-3 py-2 text-sm rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500/30"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-xs text-gray-500 mb-1 block">Description</label>
                      <textarea
                        value={editForm.description || ''}
                        onChange={e => setEditForm(f => ({ ...f, description: e.target.value }))}
                        rows={2}
                        className="w-full px-3 py-2 text-sm rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500/30 resize-none"
                      />
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={saveEdit}
                        disabled={saving}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-orange-500 text-white text-sm font-semibold hover:bg-orange-600 disabled:opacity-60"
                      >
                        {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                        Save
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400 text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700"
                      >
                        <X className="w-3.5 h-3.5" /> Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  /* View mode */
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="font-semibold text-gray-800 dark:text-gray-100">{product.name}</span>
                        {product.nameHindi && (
                          <span className="text-xs text-gray-400 font-hind">{product.nameHindi}</span>
                        )}
                        <span className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-500 px-2 py-0.5 rounded-full font-mono">
                          {product.type}
                        </span>
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400 line-clamp-1">
                        {product.description}
                      </div>
                    </div>

                    <div className="flex items-center gap-3 flex-shrink-0">
                      <div className="flex items-center gap-1 font-bold text-orange-500">
                        <IndianRupee className="w-3.5 h-3.5" />
                        {product.price}
                      </div>

                      <button
                        onClick={() => toggleActive(product.id, product.isActive)}
                        className={`transition-colors ${product.isActive ? 'text-green-500' : 'text-gray-300 dark:text-gray-600'}`}
                        title={product.isActive ? 'Disable product' : 'Enable product'}
                      >
                        {product.isActive
                          ? <ToggleRight className="w-7 h-7" />
                          : <ToggleLeft className="w-7 h-7" />}
                      </button>

                      <button
                        onClick={() => startEdit(product)}
                        className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      >
                        <Pencil className="w-4 h-4 text-blue-500" />
                      </button>
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
