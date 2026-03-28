// src/app/api/admin/products/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

async function requireAdmin() {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== 'ADMIN') throw new Error('Unauthorized')
}

const UpdateSchema = z.object({
  name:        z.string().min(2).max(100).optional(),
  nameHindi:   z.string().optional(),
  price:       z.number().min(1).max(10000).optional(),
  description: z.string().optional(),
  isActive:    z.boolean().optional(),
  sortOrder:   z.number().optional(),
})

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await requireAdmin()
    const body = await req.json()
    const parsed = UpdateSchema.safeParse(body)
    if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
    const product = await prisma.cardProduct.update({ where: { id: params.id }, data: parsed.data })
    return NextResponse.json({ product })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: e.message === 'Unauthorized' ? 401 : 500 })
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await requireAdmin()
    const body = await req.json()
    const product = await prisma.cardProduct.update({ where: { id: params.id }, data: body })
    return NextResponse.json({ product })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
