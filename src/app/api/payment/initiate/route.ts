// src/app/api/payment/initiate/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { generateOrderId } from '@/lib/utils'
import crypto from 'crypto'

// Generate Paytm checksum (using their algorithm)
function generateChecksum(params: Record<string, string>, merchantKey: string): string {
  const str = Object.keys(params)
    .sort()
    .filter((k) => k !== 'CHECKSUMHASH')
    .map((k) => params[k])
    .join('|')
  const salt = crypto.randomBytes(4).toString('hex')
  const hash = crypto
    .createHash('sha256')
    .update(str + '|' + salt)
    .digest('hex')
  return hash + salt
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { cartId, shippingAddress } = await req.json()

    // Get cart with items
    const cart = await prisma.cart.findUnique({
      where: { userId: session.user.id },
      include: { items: true },
    })

    if (!cart || cart.items.length === 0) {
      return NextResponse.json({ error: 'Cart is empty' }, { status: 400 })
    }

    // Calculate total
    const totalAmount = cart.items.reduce(
      (sum, item) => sum + Number(item.unitPrice) * item.quantity,
      0
    )

    // Create order
    const orderId = generateOrderId() // e.g. FK-20240115-001234
    const order = await prisma.order.create({
      data: {
        orderId,
        userId: session.user.id,
        totalAmount,
        shippingAddress,
        items: {
          create: cart.items.map((item) => ({
            cardType: item.cardType,
            frontImageUrl: item.frontImageUrl,
            backImageUrl: item.backImageUrl,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            subtotal: Number(item.unitPrice) * item.quantity,
          })),
        },
        payment: {
          create: {
            amount: totalAmount,
            status: 'PENDING',
          },
        },
      },
    })

    // Build Paytm params
    const MERCHANT_ID = process.env.PAYTM_MERCHANT_ID!
    const MERCHANT_KEY = process.env.PAYTM_MERCHANT_KEY!
    const WEBSITE = process.env.PAYTM_WEBSITE!
    const CHANNEL_ID = process.env.PAYTM_CHANNEL_ID!
    const INDUSTRY_TYPE = process.env.PAYTM_INDUSTRY_TYPE!
    const callbackUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/payment/callback`

    const paytmParams: Record<string, string> = {
      MID: MERCHANT_ID,
      WEBSITE: WEBSITE,
      CHANNEL_ID: CHANNEL_ID,
      INDUSTRY_TYPE_ID: INDUSTRY_TYPE,
      ORDER_ID: orderId,
      CUST_ID: session.user.id,
      MOBILE_NO: '',
      EMAIL: session.user.email!,
      TXN_AMOUNT: totalAmount.toFixed(2),
      CALLBACK_URL: callbackUrl,
    }

    // In production, use Paytm's official checksum library
    // import { PaytmChecksum } from 'paytmchecksum'
    // paytmParams.CHECKSUMHASH = await PaytmChecksum.generateSignature(paytmParams, MERCHANT_KEY)

    // For now, returning params for client-side form submission
    return NextResponse.json({
      success: true,
      orderId: order.id,
      paytmOrderId: orderId,
      amount: totalAmount,
      paytmParams,
      paytmUrl:
        process.env.NEXT_PUBLIC_PAYTM_ENV === 'production'
          ? 'https://securegw.paytm.in/order/process'
          : 'https://securegw-stage.paytm.in/order/process',
    })
  } catch (error) {
    console.error('Payment initiation error:', error)
    return NextResponse.json({ error: 'Payment initiation failed' }, { status: 500 })
  }
}
