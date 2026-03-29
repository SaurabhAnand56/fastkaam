// src/app/api/admin/analytics/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const now = new Date()
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
  const sevenDaysAgo  = new Date(now.getTime() -  7 * 24 * 60 * 60 * 1000)

  const [
    totalOrders, totalRevenue, totalUsers,
    ordersThisMonth, revenueThisMonth,
    ordersThisWeek, newUsersThisWeek,
    ordersByStatus, ordersByCardType,
    topRevenueOrders,
  ] = await Promise.all([
    prisma.order.count(),
    prisma.order.aggregate({ _sum: { totalAmount: true }, where: { paymentStatus: 'PAID' } }),
    prisma.user.count({ where: { role: 'USER' } }),
    prisma.order.count({ where: { createdAt: { gte: thirtyDaysAgo } } }),
    prisma.order.aggregate({ _sum: { totalAmount: true }, where: { paymentStatus: 'PAID', createdAt: { gte: thirtyDaysAgo } } }),
    prisma.order.count({ where: { createdAt: { gte: sevenDaysAgo } } }),
    prisma.user.count({ where: { role: 'USER', createdAt: { gte: sevenDaysAgo } } }),
    prisma.order.groupBy({ by: ['status'], _count: { status: true } }),
    prisma.orderItem.groupBy({ by: ['cardType'], _count: { cardType: true }, _sum: { quantity: true } }),
    prisma.order.findMany({
      take: 5,
      orderBy: { totalAmount: 'desc' },
      where: { paymentStatus: 'PAID' },
      select: {
        id: true,
        orderId: true,
        totalAmount: true,
        createdAt: true,
        user: {
          select: { name: true, email: true },
        },
      },
    }),
  ])

  return NextResponse.json({
    summary: {
      totalOrders,
      totalRevenue: Number(totalRevenue._sum.totalAmount ?? 0),
      totalUsers,
      ordersThisMonth,
      revenueThisMonth: Number(revenueThisMonth._sum.totalAmount ?? 0),
      ordersThisWeek,
      newUsersThisWeek,
    },
    ordersByStatus,
    ordersByCardType,
    topRevenueOrders,
  })
}
