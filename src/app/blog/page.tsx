// src/app/blog/page.tsx
import type { Metadata } from 'next'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { Calendar, Eye, ArrowRight } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Blog — PVC Card Printing Tips & Guides',
  description: 'Read our latest guides on PVC card printing, Aadhaar, PAN, ABHA cards and digital services.',
}

async function getPosts(page: number) {
  const limit = 9
  const skip = (page - 1) * limit
  const [posts, total] = await Promise.all([
    prisma.blogPost.findMany({
      where: { published: true },
      orderBy: { publishedAt: 'desc' },
      skip,
      take: limit,
      select: { id: true, title: true, slug: true, excerpt: true, featuredImage: true, publishedAt: true, views: true },
    }),
    prisma.blogPost.count({ where: { published: true } }),
  ])
  return { posts, total, totalPages: Math.ceil(total / limit) }
}

export default async function BlogPage({ searchParams }: { searchParams: { page?: string } }) {
  const page = Number(searchParams.page || 1)
  const { posts, total, totalPages } = await getPosts(page)

  return (
    <div className="min-h-screen pt-20 pb-16">
      {/* Header */}
      <div className="bg-gradient-to-br from-blue-600 to-teal-600 py-14 px-4 text-white text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold mb-3">Blog & Guides</h1>
        <p className="text-white/70 max-w-xl mx-auto">
          Tips, guides and updates about PVC card printing and digital services
        </p>
      </div>

      <div className="max-w-5xl mx-auto px-4">
        {posts.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <div className="text-5xl mb-4">📝</div>
            <div className="font-medium">No posts published yet</div>
          </div>
        ) : (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
              {posts.map((post) => (
                <Link key={post.id} href={`/blog/${post.slug}`} className="group">
                  <article className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-all hover:-translate-y-1 h-full flex flex-col">
                    <div className="aspect-video overflow-hidden bg-gradient-to-br from-blue-50 to-teal-50 dark:from-blue-950 dark:to-teal-950">
                      {post.featuredImage ? (
                        <img src={post.featuredImage} alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-4xl">📝</div>
                      )}
                    </div>
                    <div className="p-5 flex-1 flex flex-col">
                      <h2 className="font-bold text-gray-800 dark:text-gray-100 text-sm leading-snug mb-2 line-clamp-2 group-hover:text-orange-500 transition-colors">
                        {post.title}
                      </h2>
                      {post.excerpt && (
                        <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mb-3 flex-1">{post.excerpt}</p>
                      )}
                      <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-100 dark:border-gray-700">
                        <div className="flex items-center gap-3 text-xs text-gray-400">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {post.publishedAt
                              ? new Date(post.publishedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
                              : ''}
                          </span>
                          {post.views > 0 && (
                            <span className="flex items-center gap-1">
                              <Eye className="w-3 h-3" /> {post.views}
                            </span>
                          )}
                        </div>
                        <span className="text-xs text-orange-500 font-semibold group-hover:gap-2 flex items-center gap-1">
                          Read <ArrowRight className="w-3 h-3" />
                        </span>
                      </div>
                    </div>
                  </article>
                </Link>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <Link key={p} href={`/blog?page=${p}`}
                    className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm font-medium transition-all ${
                      p === page
                        ? 'bg-orange-500 text-white shadow-md'
                        : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-orange-300'
                    }`}>
                    {p}
                  </Link>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
