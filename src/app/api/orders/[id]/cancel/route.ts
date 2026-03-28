// src/app/api/orders/[id]/cancel/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const order = await prisma.order.findUnique({
    where: { id: params.id },
    select: { userId: true, status: true },
  })

  if (!order) return NextResponse.json({ error: 'Order not found' }, { status: 404 })
  if (order.userId !== session.user.id) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  if (!['PENDING', 'PROCESSING'].includes(order.status)) {
    return NextResponse.json({ error: 'Order cannot be cancelled at this stage' }, { status: 400 })
  }

  const updated = await prisma.order.update({
    where: { id: params.id },
    data: { status: 'CANCELLED' },
  })

  return NextResponse.json({ order: updated })
}
