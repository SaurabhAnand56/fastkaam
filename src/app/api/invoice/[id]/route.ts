// src/app/api/invoice/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { jsPDF } from 'jspdf'

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const order = await prisma.order.findUnique({
    where: { id: params.id },
    include: { user: true, items: true, payment: true },
  })

  if (!order) return NextResponse.json({ error: 'Order not found' }, { status: 404 })

  // Only allow user to download their own invoice (or admin)
  if (order.userId !== session.user.id && session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  // Generate PDF
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })
  const pageWidth = doc.internal.pageSize.getWidth()
  const margin = 20

  // Header gradient (simulated with rect)
  doc.setFillColor(244, 97, 26) // orange
  doc.rect(0, 0, pageWidth, 40, 'F')

  // Logo / company name
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(22)
  doc.setFont('helvetica', 'bold')
  doc.text('Fastkaam', margin, 18)
  doc.setFontSize(9)
  doc.setFont('helvetica', 'normal')
  doc.text('Computer & Printing Press', margin, 25)
  doc.text('PVC Card Printing Specialist', margin, 31)

  // Invoice title on the right
  doc.setFontSize(16)
  doc.setFont('helvetica', 'bold')
  doc.text('INVOICE', pageWidth - margin, 18, { align: 'right' })
  doc.setFontSize(9)
  doc.setFont('helvetica', 'normal')
  doc.text(`#${order.orderId}`, pageWidth - margin, 25, { align: 'right' })
  doc.text(new Date(order.createdAt).toLocaleDateString('en-IN'), pageWidth - margin, 31, { align: 'right' })

  // Reset color
  doc.setTextColor(30, 30, 30)

  // Bill to section
  let y = 55
  doc.setFontSize(10)
  doc.setFont('helvetica', 'bold')
  doc.text('Bill To:', margin, y)
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9)
  y += 6
  doc.text(order.user.name || '', margin, y)
  y += 5
  doc.text(order.user.email || '', margin, y)

  const address = order.shippingAddress as any
  if (address) {
    y += 5
    doc.text(`${address.line1 || ''}, ${address.city || ''}, ${address.state || ''} - ${address.pincode || ''}`, margin, y)
  }

  // Order details section
  y += 15
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(10)
  doc.text('Order Status:', margin, y)
  doc.setFont('helvetica', 'normal')
  doc.text(order.status, margin + 35, y)
  y += 6
  doc.setFont('helvetica', 'bold')
  doc.text('Payment Status:', margin, y)
  doc.setFont('helvetica', 'normal')
  doc.text(order.paymentStatus, margin + 35, y)
  if (order.paymentId) {
    y += 6
    doc.setFont('helvetica', 'bold')
    doc.text('Transaction ID:', margin, y)
    doc.setFont('helvetica', 'normal')
    doc.text(order.paymentId, margin + 35, y)
  }

  // Items table header
  y += 15
  doc.setFillColor(245, 245, 245)
  doc.rect(margin, y - 4, pageWidth - 2 * margin, 10, 'F')
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(9)
  doc.text('Card Type', margin + 2, y + 2)
  doc.text('Qty', pageWidth - margin - 50, y + 2)
  doc.text('Unit Price', pageWidth - margin - 30, y + 2)
  doc.text('Subtotal', pageWidth - margin, y + 2, { align: 'right' })

  // Items rows
  doc.setFont('helvetica', 'normal')
  order.items.forEach((item) => {
    y += 10
    doc.text(item.cardType.replace('_', ' ') + ' Card', margin + 2, y)
    doc.text(String(item.quantity), pageWidth - margin - 50, y)
    doc.text(`Rs.${Number(item.unitPrice).toFixed(2)}`, pageWidth - margin - 30, y)
    doc.text(`Rs.${Number(item.subtotal).toFixed(2)}`, pageWidth - margin, y, { align: 'right' })

    // Divider
    doc.setDrawColor(230, 230, 230)
    doc.line(margin, y + 3, pageWidth - margin, y + 3)
  })

  // Total
  y += 12
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(11)
  doc.setFillColor(244, 97, 26)
  doc.rect(pageWidth - margin - 60, y - 5, 60, 12, 'F')
  doc.setTextColor(255, 255, 255)
  doc.text(`TOTAL: Rs.${Number(order.totalAmount).toFixed(2)}`, pageWidth - margin - 2, y + 3, { align: 'right' })

  // Footer
  doc.setTextColor(150, 150, 150)
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(8)
  doc.text('Thank you for choosing Fastkaam!', pageWidth / 2, 275, { align: 'center' })
  doc.text('For support: WhatsApp us or email hello@fastkaam.in', pageWidth / 2, 280, { align: 'center' })

  // Output as buffer
  const pdfBuffer = doc.output('arraybuffer')

  return new NextResponse(pdfBuffer, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="Fastkaam-Invoice-${order.orderId}.pdf"`,
    },
  })
}
