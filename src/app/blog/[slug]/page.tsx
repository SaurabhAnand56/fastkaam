// src/app/blog/[slug]/page.tsx
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { Calendar, ArrowLeft, Eye } from 'lucide-react'

interface Props { params: { slug: string } }

async function getPost(slug: string) {
  const post = await prisma.blogPost.findUnique({
    where: { slug, published: true },
  })
  if (!post) notFound()
  // Increment view count
  await prisma.blogPost.update({ where: { slug }, data: { views: { increment: 1 } } }).catch(() => {})
  return post
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await prisma.blogPost.findUnique({
    where: { slug: params.slug, published: true },
    select: { title: true, metaTitle: true, metaDesc: true, featuredImage: true, excerpt: true },
  })
  if (!post) return {}
  return {
    title: post.metaTitle || post.title,
    description: post.metaDesc || post.excerpt || '',
    openGraph: {
      title: post.metaTitle || post.title,
      description: post.metaDesc || post.excerpt || '',
      images: post.featuredImage ? [{ url: post.featuredImage }] : [],
    },
  }
}

export default async function BlogPostPage({ params }: Props) {
  const post = await getPost(params.slug)

  // JSON-LD schema
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt || '',
    image: post.featuredImage || '',
    datePublished: post.publishedAt?.toISOString(),
    dateModified: post.updatedAt.toISOString(),
    publisher: {
      '@type': 'Organization',
      name: 'Fastkaam Computer & Printing Press',
      url: process.env.NEXT_PUBLIC_APP_URL,
    },
  }

  return (
    <div className="min-h-screen pt-20 pb-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      <article className="max-w-3xl mx-auto px-4 py-8">
        {/* Back link */}
        <Link href="/blog"
          className="inline-flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-orange-500 transition-colors mb-6">
          <ArrowLeft className="w-4 h-4" /> Back to Blog
        </Link>

        {/* Hero image */}
        {post.featuredImage && (
          <div className="aspect-video rounded-2xl overflow-hidden mb-8 border border-gray-100 dark:border-gray-700">
            <img src={post.featuredImage} alt={post.title} className="w-full h-full object-cover" />
          </div>
        )}

        {/* Title */}
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4 leading-tight">
          {post.title}
        </h1>

        {/* Meta */}
        <div className="flex items-center gap-4 text-sm text-gray-400 mb-8 pb-6 border-b border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-4 h-4" />
            {post.publishedAt
              ? new Date(post.publishedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
              : ''}
          </div>
          {post.views > 0 && (
            <div className="flex items-center gap-1.5">
              <Eye className="w-4 h-4" /> {post.views} views
            </div>
          )}
        </div>

        {/* Content */}
        <div
          className="prose prose-gray dark:prose-invert prose-headings:font-bold prose-a:text-orange-500 prose-img:rounded-xl max-w-none"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* CTA */}
        <div className="mt-12 p-6 bg-gradient-to-br from-orange-50 to-violet-50 dark:from-orange-950/30 dark:to-violet-950/30 rounded-2xl border border-orange-100 dark:border-orange-800/30 text-center">
          <h3 className="font-bold text-gray-800 dark:text-gray-100 text-lg mb-2">
            Ready to get your PVC card printed?
          </h3>
          <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">
            Premium quality starting at just ₹30. Fast delivery across India.
          </p>
          <Link href="/pvc-cards"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-violet-600 text-white font-bold text-sm hover:opacity-90 transition-opacity shadow-lg">
            Order Now — Starting ₹30
          </Link>
        </div>
      </article>
    </div>
  )
}
