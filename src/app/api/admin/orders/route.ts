// src/app/api/admin/orders/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

async function requireAdmin(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== 'ADMIN') {
    throw new Error('Unauthorized')
  }
  return session
}

// GET /api/admin/orders
export async function GET(req: NextRequest) {
  try {
    await requireAdmin(req)
    const { searchParams } = new URL(req.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const status = searchParams.get('status') || undefined
    const search = searchParams.get('search') || ''
    const skip = (page - 1) * limit

    const where: any = {}
    if (status) where.status = status
    if (search) {
      where.OR = [
        { orderId: { contains: search, mode: 'insensitive' } },
        { user: { email: { contains: search, mode: 'insensitive' } } },
        { user: { name: { contains: search, mode: 'insensitive' } } },
      ]
    }

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        include: {
          user: { select: { name: true, email: true, phone: true } },
          items: true,
          payment: true,
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.order.count({ where }),
    ])

    return NextResponse.json({ orders, total, page, totalPages: Math.ceil(total / limit) })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: e.message === 'Unauthorized' ? 401 : 500 })
  }
}

// PATCH /api/admin/orders — bulk status update
export async function PATCH(req: NextRequest) {
  try {
    await requireAdmin(req)
    const { orderIds, status } = await req.json()
    await prisma.order.updateMany({
      where: { id: { in: orderIds } },
      data: { status },
    })
    return NextResponse.json({ success: true, updated: orderIds.length })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
