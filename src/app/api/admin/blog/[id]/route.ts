// src/app/api/admin/blog/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

async function requireAdmin() {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== 'ADMIN') throw new Error('Unauthorized')
}

// GET /api/admin/blog — all posts (published + drafts)
export async function GET(req: NextRequest) {
  try {
    await requireAdmin()
    const posts = await prisma.blogPost.findMany({
      orderBy: { createdAt: 'desc' },
      select: { id: true, title: true, slug: true, published: true, featuredImage: true, views: true, createdAt: true },
    })
    return NextResponse.json({ posts })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 401 })
  }
}

const UpdateSchema = z.object({
  title:        z.string().min(3).max(200).optional(),
  titleHindi:   z.string().optional(),
  slug:         z.string().min(3).max(200).optional(),
  content:      z.string().optional(),
  excerpt:      z.string().max(300).optional(),
  featuredImage:z.string().url().optional().or(z.literal('')),
  metaTitle:    z.string().max(60).optional(),
  metaDesc:     z.string().max(160).optional(),
  metaKeywords: z.string().optional(),
  published:    z.boolean().optional(),
})

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await requireAdmin()
    const body = await req.json()
    const parsed = UpdateSchema.safeParse(body)
    if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })

    const data: any = { ...parsed.data }
    if (parsed.data.published === true) data.publishedAt = new Date()
    if (parsed.data.published === false) data.publishedAt = null

    const post = await prisma.blogPost.update({ where: { id: params.id }, data })
    return NextResponse.json({ post })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await requireAdmin()
    await prisma.blogPost.delete({ where: { id: params.id } })
    return NextResponse.json({ success: true })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
