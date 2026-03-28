'use client'
// src/app/admin/blog/new/page.tsx (reuse for edit too)

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowLeft, Save, Eye, Loader2, ImagePlus } from 'lucide-react'
import axios from 'axios'
import toast from 'react-hot-toast'
import { generateSlug } from '@/lib/utils'
import { uploadToCloudinary } from '@/lib/cloudinary-client'

export default function NewBlogPostPage() {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [form, setForm] = useState({
    title: '',
    titleHindi: '',
    slug: '',
    content: '',
    excerpt: '',
    featuredImage: '',
    metaTitle: '',
    metaDesc: '',
    metaKeywords: '',
    published: false,
  })

  const field = (key: keyof typeof form) => ({
    value: form[key] as string,
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const value = e.target.value
      setForm((f) => {
        const update: any = { [key]: value }
        // Auto-generate slug from title
        if (key === 'title' && !f.slug) update.slug = generateSlug(value)
        // Auto-fill meta title from title
        if (key === 'title' && !f.metaTitle) update.metaTitle = value.slice(0, 60)
        return { ...f, ...update }
      })
    },
  })

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const url = await uploadToCloudinary(file, 'blog')
      setForm((f) => ({ ...f, featuredImage: url }))
      toast.success('Image uploaded')
    } catch {
      toast.error('Image upload failed')
    } finally {
      setUploading(false)
    }
  }

  const handleSave = async (publish = false) => {
    if (!form.title || !form.slug || !form.content) {
      toast.error('Title, slug, and content are required')
      return
    }
    setSaving(true)
    try {
      await axios.post('/api/blog', { ...form, published: publish })
      toast.success(publish ? 'Post published!' : 'Draft saved!')
      router.push('/admin/blog')
    } catch (err: any) {
      const msg = err.response?.data?.error
      if (typeof msg === 'object') toast.error('Validation error — check fields')
      else toast.error(msg || 'Save failed')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="min-h-screen pt-16 bg-gray-50 dark:bg-gray-900 flex">
      <div className="hidden md:block w-60 flex-shrink-0" />
      <main className="flex-1 p-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Link href="/admin/blog" className="p-2 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                <ArrowLeft className="w-4 h-4 text-gray-500" />
              </Link>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">New Blog Post</h1>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleSave(false)}
                disabled={saving}
                className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400 text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors disabled:opacity-60"
              >
                {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                Save Draft
              </button>
              <button
                onClick={() => handleSave(true)}
                disabled={saving}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-violet-600 text-white text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-60"
              >
                <Eye className="w-3.5 h-3.5" /> Publish
              </button>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Main editor */}
            <div className="md:col-span-2 space-y-4">
              <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-5 space-y-4">
                {/* Title */}
                <div>
                  <label className="text-xs font-medium text-gray-500 mb-1.5 block">Title (English) *</label>
                  <input type="text" {...field('title')} placeholder="How to get PVC Aadhaar card printed..."
                    className="w-full px-4 py-3 text-lg font-semibold rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-100 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500/30" />
                </div>

                {/* Hindi title */}
                <div>
                  <label className="text-xs font-medium text-gray-500 mb-1.5 block">Title (Hindi)</label>
                  <input type="text" {...field('titleHindi')} placeholder="PVC आधार कार्ड कैसे प्रिंट करवाएं..."
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-100 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500/30 font-hind" />
                </div>

                {/* Slug */}
                <div>
                  <label className="text-xs font-medium text-gray-500 mb-1.5 block">URL Slug *</label>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-400">/blog/</span>
                    <input type="text" {...field('slug')} placeholder="how-to-get-pvc-aadhaar-card-printed"
                      className="flex-1 px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-sm text-gray-800 dark:text-gray-100 font-mono focus:outline-none focus:ring-2 focus:ring-orange-500/30" />
                  </div>
                </div>

                {/* Excerpt */}
                <div>
                  <label className="text-xs font-medium text-gray-500 mb-1.5 block">Excerpt (max 300 chars)</label>
                  <textarea {...field('excerpt')} rows={2} maxLength={300} placeholder="Short description shown in blog listings..."
                    className="w-full px-3 py-2.5 text-sm rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500/30 resize-none" />
                  <div className="text-right text-xs text-gray-400">{form.excerpt.length}/300</div>
                </div>
              </div>

              {/* Content editor */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-5">
                <label className="text-xs font-medium text-gray-500 mb-2 block">Content (HTML) *</label>
                <div className="mb-2 flex flex-wrap gap-1">
                  {[
                    ['Bold', '<strong>', '</strong>'],
                    ['H2', '<h2>', '</h2>'],
                    ['H3', '<h3>', '</h3>'],
                    ['UL', '<ul>\n  <li>', '</li>\n</ul>'],
                    ['OL', '<ol>\n  <li>', '</li>\n</ol>'],
                    ['Link', '<a href="">', '</a>'],
                    ['Para', '<p>', '</p>'],
                  ].map(([label, open, close]) => (
                    <button
                      key={label}
                      type="button"
                      onClick={() => setForm(f => ({ ...f, content: f.content + `${open}${close}` }))}
                      className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors font-mono"
                    >
                      {label}
                    </button>
                  ))}
                </div>
                <textarea
                  value={form.content}
                  onChange={(e) => setForm(f => ({ ...f, content: e.target.value }))}
                  rows={18}
                  placeholder="<h2>Introduction</h2>&#10;<p>Your blog post content here...</p>"
                  className="w-full px-4 py-3 text-sm rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500/30 font-mono resize-none"
                />
                <div className="text-xs text-gray-400 mt-1">HTML content. Use the buttons above to insert tags.</div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-4">
              {/* Featured Image */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-5">
                <label className="text-xs font-medium text-gray-500 mb-3 block">Featured Image</label>
                {form.featuredImage ? (
                  <div className="relative">
                    <img src={form.featuredImage} alt="Featured" className="w-full aspect-video object-cover rounded-xl mb-2" />
                    <button
                      onClick={() => setForm(f => ({ ...f, featuredImage: '' }))}
                      className="text-xs text-red-500 hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <label className="block border-2 border-dashed border-gray-200 dark:border-gray-600 rounded-xl p-6 text-center cursor-pointer hover:border-orange-400 transition-colors">
                    <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                    {uploading ? (
                      <Loader2 className="w-6 h-6 animate-spin text-orange-500 mx-auto" />
                    ) : (
                      <>
                        <ImagePlus className="w-6 h-6 text-gray-300 mx-auto mb-2" />
                        <div className="text-xs text-gray-400">Click to upload image</div>
                      </>
                    )}
                  </label>
                )}
              </div>

              {/* SEO */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-5 space-y-3">
                <h3 className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">SEO</h3>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Meta Title (max 60)</label>
                  <input type="text" {...field('metaTitle')} maxLength={60}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500/30" />
                  <div className="text-right text-xs text-gray-400">{form.metaTitle.length}/60</div>
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Meta Description (max 160)</label>
                  <textarea {...field('metaDesc')} rows={3} maxLength={160}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500/30 resize-none" />
                  <div className="text-right text-xs text-gray-400">{form.metaDesc.length}/160</div>
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Keywords (comma-separated)</label>
                  <input type="text" {...field('metaKeywords')} placeholder="PVC card, Aadhaar card printing"
                    className="w-full px-3 py-2 text-sm rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500/30" />
                </div>
              </div>

              {/* Preview card */}
              {form.metaTitle && (
                <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-5">
                  <h3 className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-3">Google Preview</h3>
                  <div className="text-blue-600 dark:text-blue-400 text-sm font-medium line-clamp-1">{form.metaTitle}</div>
                  <div className="text-xs text-green-600 dark:text-green-500 my-0.5">fastkaam.in/blog/{form.slug}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">{form.metaDesc}</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
