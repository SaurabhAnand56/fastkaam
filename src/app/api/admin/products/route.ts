// src/app/api/admin/products/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

async function requireAdmin(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== 'ADMIN') throw new Error('Unauthorized')
}

export async function GET(req: NextRequest) {
  try {
    await requireAdmin(req)
    const products = await prisma.cardProduct.findMany({ orderBy: { sortOrder: 'asc' } })
    return NextResponse.json({ products })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: e.message === 'Unauthorized' ? 401 : 500 })
  }
}

const ProductSchema = z.object({
  name: z.string().min(2).max(100),
  nameHindi: z.string().optional(),
  price: z.number().min(1).max(10000),
  description: z.string().optional(),
  isActive: z.boolean().default(true),
  sortOrder: z.number().default(10),
})

export async function POST(req: NextRequest) {
  try {
    await requireAdmin(req)
    const body = await req.json()
    const parsed = ProductSchema.safeParse(body)
    if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })

    const product = await prisma.cardProduct.create({
      data: { ...parsed.data, type: 'CUSTOM' },
    })
    return NextResponse.json({ product }, { status: 201 })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
