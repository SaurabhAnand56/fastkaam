// src/app/api/admin/orders/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { sendOrderStatusUpdateEmail } from '@/lib/email'
import { z } from 'zod'

const UpdateSchema = z.object({
  status: z.enum(['PENDING','PROCESSING','PRINTING','SHIPPED','DELIVERED','CANCELLED']).optional(),
  notes:  z.string().optional(),
})

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json()
  const parsed = UpdateSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })

  const order = await prisma.order.update({
    where: { id: params.id },
    data: parsed.data,
    include: { user: { select: { email: true, name: true } } },
  })

  // Send status update email if notable status change
  if (parsed.data.status && ['PRINTING','SHIPPED','DELIVERED','CANCELLED'].includes(parsed.data.status)) {
    sendOrderStatusUpdateEmail({
      to: order.user.email!,
      name: order.user.name || 'Customer',
      orderId: order.orderId,
      status: parsed.data.status,
    }).catch(console.error)
  }

  return NextResponse.json({ order })
}

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const order = await prisma.order.findUnique({
    where: { id: params.id },
    include: { user: true, items: true, payment: true },
  })
  if (!order) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json({ order })
}
