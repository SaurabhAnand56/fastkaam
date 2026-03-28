// src/app/api/blog/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const BlogSchema = z.object({
  title: z.string().min(5).max(200),
  titleHindi: z.string().optional(),
  slug: z.string().min(3).max(200).regex(/^[a-z0-9-]+$/),
  content: z.string().min(10),
  excerpt: z.string().max(300).optional(),
  featuredImage: z.string().url().optional(),
  metaTitle: z.string().max(60).optional(),
  metaDesc: z.string().max(160).optional(),
  metaKeywords: z.string().optional(),
  published: z.boolean().default(false),
})

// GET /api/blog — public list of published posts
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const page = parseInt(searchParams.get('page') || '1')
  const limit = parseInt(searchParams.get('limit') || '9')
  const skip = (page - 1) * limit

  const [posts, total] = await Promise.all([
    prisma.blogPost.findMany({
      where: { published: true },
      orderBy: { publishedAt: 'desc' },
      skip,
      take: limit,
      select: {
        id: true,
        title: true,
        slug: true,
        excerpt: true,
        featuredImage: true,
        publishedAt: true,
        views: true,
      },
    }),
    prisma.blogPost.count({ where: { published: true } }),
  ])

  return NextResponse.json({ posts, total, page, totalPages: Math.ceil(total / limit) })
}

// POST /api/blog — admin creates post
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const body = await req.json()
  const parsed = BlogSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  // Check slug uniqueness
  const existing = await prisma.blogPost.findUnique({ where: { slug: parsed.data.slug } })
  if (existing) {
    return NextResponse.json({ error: 'Slug already exists' }, { status: 409 })
  }

  const post = await prisma.blogPost.create({
    data: {
      ...parsed.data,
      publishedAt: parsed.data.published ? new Date() : null,
    },
  })

  return NextResponse.json({ post }, { status: 201 })
}
