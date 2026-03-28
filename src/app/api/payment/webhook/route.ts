// src/app/api/payment/webhook/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendOrderConfirmationEmail } from '@/lib/email'

export async function POST(req: NextRequest) {
  try {
    const body = await req.formData()
    const paytmResponse: Record<string, string> = {}
    body.forEach((value, key) => { paytmResponse[key] = value.toString() })

    const { ORDER_ID, STATUS, TXNAMOUNT, TXNID, RESPMSG, CHECKSUMHASH } = paytmResponse

    // ⚠️ IMPORTANT: Verify checksum with Paytm SDK in production!
    // const isValid = await PaytmChecksum.verifySignature(paytmResponse, process.env.PAYTM_MERCHANT_KEY!, CHECKSUMHASH)
    // if (!isValid) return NextResponse.json({ error: 'Invalid checksum' }, { status: 400 })

    // Find order
    const order = await prisma.order.findUnique({
      where: { orderId: ORDER_ID },
      include: { user: { select: { email: true, name: true } }, payment: true },
    })

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    if (STATUS === 'TXN_SUCCESS') {
      // Update order and payment
      await prisma.$transaction([
        prisma.order.update({
          where: { orderId: ORDER_ID },
          data: {
            status: 'PROCESSING',
            paymentStatus: 'PAID',
            paymentId: TXNID,
          },
        }),
        prisma.payment.update({
          where: { orderId: order.id },
          data: {
            txnId: TXNID,
            status: 'PAID',
            gatewayResponse: paytmResponse,
          },
        }),
        // Clear user's cart
        prisma.cart.deleteMany({ where: { userId: order.userId } }),
      ])

      // Send confirmation email
      if (order.user.email) {
        await sendOrderConfirmationEmail({
          to: order.user.email,
          name: order.user.name || 'Customer',
          orderId: ORDER_ID,
          amount: TXNAMOUNT,
        }).catch(console.error)
      }
    } else if (STATUS === 'TXN_FAILURE') {
      await prisma.$transaction([
        prisma.order.update({
          where: { orderId: ORDER_ID },
          data: { paymentStatus: 'FAILED' },
        }),
        prisma.payment.update({
          where: { orderId: order.id },
          data: { status: 'FAILED', gatewayResponse: paytmResponse },
        }),
      ])
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 })
  }
}
