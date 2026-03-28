'use client'
// src/app/admin/blog/page.tsx — Blog CMS

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Plus, Pencil, Trash2, Eye, EyeOff, Loader2, Search } from 'lucide-react'
import axios from 'axios'
import toast from 'react-hot-toast'

export default function AdminBlogPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [posts, setPosts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [deleting, setDeleting] = useState<string | null>(null)

  useEffect(() => {
    if (status === 'unauthenticated' || (session && session.user.role !== 'ADMIN')) {
      router.push('/login')
    }
  }, [session, status, router])

  useEffect(() => {
    fetchPosts()
  }, [])

  const fetchPosts = async () => {
    try {
      const { data } = await axios.get('/api/admin/blog')
      setPosts(data.posts)
    } catch {
      toast.error('Failed to load posts')
    } finally {
      setLoading(false)
    }
  }

  const togglePublish = async (id: string, published: boolean) => {
    try {
      await axios.put(`/api/admin/blog/${id}`, { published: !published })
      setPosts(posts.map((p) => (p.id === id ? { ...p, published: !published } : p)))
      toast.success(published ? 'Post unpublished' : 'Post published!')
    } catch {
      toast.error('Failed to update post')
    }
  }

  const deletePost = async (id: string) => {
    if (!confirm('Delete this post? This cannot be undone.')) return
    setDeleting(id)
    try {
      await axios.delete(`/api/admin/blog/${id}`)
      setPosts(posts.filter((p) => p.id !== id))
      toast.success('Post deleted')
    } catch {
      toast.error('Delete failed')
    } finally {
      setDeleting(null)
    }
  }

  const filtered = posts.filter((p) =>
    p.title.toLowerCase().includes(search.toLowerCase()) ||
    p.slug.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="min-h-screen pt-16 bg-gray-50 dark:bg-gray-900 flex">
      {/* Sidebar placeholder */}
      <div className="hidden md:block w-60 flex-shrink-0" />

      <main className="flex-1 p-6">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Blog CMS</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">{posts.length} posts total</p>
            </div>
            <Link
              href="/admin/blog/new"
              className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-orange-500 to-violet-600 text-white rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity shadow-lg"
            >
              <Plus className="w-4 h-4" />
              New Post
            </Link>
          </div>

          {/* Search */}
          <div className="relative mb-5">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search posts..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/30"
            />
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-16 text-center">
              <div className="text-gray-400 mb-3 text-4xl">📝</div>
              <div className="text-gray-600 dark:text-gray-400 font-medium">No posts found</div>
              <Link href="/admin/blog/new" className="text-orange-500 text-sm hover:underline mt-2 inline-block">
                Write your first post →
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {filtered.map((post, i) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-5 flex items-center gap-4"
                >
                  {/* Thumbnail */}
                  {post.featuredImage ? (
                    <img
                      src={post.featuredImage}
                      alt={post.title}
                      className="w-20 h-14 rounded-xl object-cover flex-shrink-0"
                    />
                  ) : (
                    <div className="w-20 h-14 rounded-xl bg-gray-100 dark:bg-gray-700 flex items-center justify-center flex-shrink-0 text-2xl">
                      📝
                    </div>
                  )}

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <h3 className="font-semibold text-gray-800 dark:text-gray-100 text-sm truncate">
                        {post.title}
                      </h3>
                      <span className={`flex-shrink-0 text-xs px-2 py-0.5 rounded-full font-medium ${
                        post.published
                          ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                          : 'bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400'
                      }`}>
                        {post.published ? 'Published' : 'Draft'}
                      </span>
                    </div>
                    <div className="text-xs text-gray-400 font-mono">/{post.slug}</div>
                    <div className="text-xs text-gray-400 mt-0.5">
                      {new Date(post.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      {post.views > 0 && ` · ${post.views} views`}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      onClick={() => togglePublish(post.id, post.published)}
                      title={post.published ? 'Unpublish' : 'Publish'}
                      className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                      {post.published
                        ? <EyeOff className="w-4 h-4 text-gray-400" />
                        : <Eye className="w-4 h-4 text-green-500" />
                      }
                    </button>
                    <Link
                      href={`/admin/blog/${post.id}/edit`}
                      className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                      <Pencil className="w-4 h-4 text-blue-500" />
                    </Link>
                    <button
                      onClick={() => deletePost(post.id)}
                      disabled={deleting === post.id}
                      className="p-2 rounded-xl hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors disabled:opacity-50"
                    >
                      {deleting === post.id
                        ? <Loader2 className="w-4 h-4 animate-spin text-red-400" />
                        : <Trash2 className="w-4 h-4 text-red-400" />
                      }
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
