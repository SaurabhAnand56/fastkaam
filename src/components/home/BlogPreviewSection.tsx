// src/components/home/BlogPreviewSection.tsx
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { ArrowRight, Calendar, Eye } from 'lucide-react'

async function getLatestPosts() {
  try {
    return await prisma.blogPost.findMany({
      where: { published: true },
      orderBy: { publishedAt: 'desc' },
      take: 3,
      select: {
        id: true,
        title: true,
        slug: true,
        excerpt: true,
        featuredImage: true,
        publishedAt: true,
        views: true,
      },
    })
  } catch {
    return []
  }
}

export default async function BlogPreviewSection() {
  const posts = await getLatestPosts()

  if (!posts.length) return null

  return (
    <section className="py-20 px-4 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-10">
          <div>
            <div className="inline-flex items-center gap-2 bg-blue-50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-800 rounded-full px-4 py-1.5 text-sm font-medium text-blue-600 dark:text-blue-400 mb-3">
              📝 Latest from Blog
            </div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Tips & Guides</h2>
          </div>
          <Link href="/blog" className="hidden sm:flex items-center gap-1 text-orange-500 font-semibold text-sm hover:gap-2 transition-all">
            View all <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {posts.map((post) => (
            <Link key={post.id} href={`/blog/${post.slug}`} className="group">
              <article className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-all hover:-translate-y-1">
                {post.featuredImage ? (
                  <div className="aspect-video overflow-hidden">
                    <img
                      src={post.featuredImage}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                ) : (
                  <div className="aspect-video bg-gradient-to-br from-violet-100 to-orange-100 dark:from-violet-950 dark:to-orange-950 flex items-center justify-center text-4xl">
                    📝
                  </div>
                )}
                <div className="p-5">
                  <h3 className="font-bold text-gray-800 dark:text-gray-100 text-sm leading-snug mb-2 line-clamp-2 group-hover:text-orange-500 transition-colors">
                    {post.title}
                  </h3>
                  {post.excerpt && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mb-3">{post.excerpt}</p>
                  )}
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
                </div>
              </article>
            </Link>
          ))}
        </div>

        <div className="sm:hidden text-center mt-6">
          <Link href="/blog" className="text-orange-500 font-semibold text-sm">View all posts →</Link>
        </div>
      </div>
    </section>
  )
}
