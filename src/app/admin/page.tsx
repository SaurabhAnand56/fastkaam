// src/app/admin/page.tsx
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import AdminDashboardClient from '@/components/admin/AdminDashboardClient'

async function getAnalytics() {
  const [
    totalOrders,
    totalRevenue,
    totalUsers,
    recentOrders,
    pendingOrders,
    ordersByStatus,
  ] = await Promise.all([
    prisma.order.count(),
    prisma.order.aggregate({
      _sum: { totalAmount: true },
      where: { paymentStatus: 'PAID' },
    }),
    prisma.user.count({ where: { role: 'USER' } }),
    prisma.order.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
      include: { user: { select: { name: true, email: true } }, items: true },
    }),
    prisma.order.count({ where: { status: 'PENDING' } }),
    prisma.order.groupBy({
      by: ['status'],
      _count: { status: true },
    }),
  ])

  return {
    totalOrders,
    totalRevenue: Number(totalRevenue._sum.totalAmount ?? 0),
    totalUsers,
    recentOrders,
    pendingOrders,
    ordersByStatus,
  }
}

export default async function AdminPage() {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== 'ADMIN') {
    redirect('/login?callbackUrl=/admin')
  }

  const analytics = await getAnalytics()

  return <AdminDashboardClient analytics={analytics} />
}
