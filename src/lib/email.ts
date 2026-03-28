// src/lib/email.ts
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)
const FROM = process.env.RESEND_FROM_EMAIL || 'noreply@fastkaam.in'
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://fastkaam.in'

export async function sendOrderConfirmationEmail({
  to,
  name,
  orderId,
  amount,
}: {
  to: string
  name: string
  orderId: string
  amount: string | number
}) {
  return resend.emails.send({
    from: FROM,
    to,
    subject: `Order Confirmed — ${orderId} | Fastkaam`,
    html: `
    <div style="font-family: 'Segoe UI', sans-serif; max-width: 560px; margin: 0 auto; color: #1a1a1a;">
      <div style="background: linear-gradient(135deg, #6c3fe6 0%, #f4611a 100%); padding: 32px; border-radius: 16px 16px 0 0; text-align: center;">
        <div style="font-size: 28px; font-weight: 800; color: #fff; letter-spacing: -0.5px;">Fastkaam</div>
        <div style="font-size: 13px; color: rgba(255,255,255,0.7); margin-top: 4px;">Computer & Printing Press</div>
      </div>
      <div style="background: #fff; padding: 32px; border: 1px solid #f0f0f0; border-top: none;">
        <h1 style="font-size: 22px; font-weight: 700; margin: 0 0 8px;">Order Confirmed! 🎉</h1>
        <p style="color: #666; margin: 0 0 24px;">Hi ${name}, your order has been confirmed and is being processed.</p>

        <div style="background: #f8f4ff; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
          <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
            <span style="color: #888; font-size: 13px;">Order ID</span>
            <span style="font-weight: 600; font-family: monospace; font-size: 13px;">${orderId}</span>
          </div>
          <div style="display: flex; justify-content: space-between;">
            <span style="color: #888; font-size: 13px;">Amount Paid</span>
            <span style="font-weight: 700; color: #f4611a; font-size: 16px;">₹${amount}</span>
          </div>
        </div>

        <div style="background: #f0fdf4; border-radius: 12px; padding: 16px; margin-bottom: 24px; border-left: 4px solid #22c55e;">
          <div style="font-weight: 600; font-size: 14px; color: #15803d; margin-bottom: 4px;">Estimated Delivery</div>
          <div style="font-size: 13px; color: #166534;">Local: 1–2 days · Pan-India: 3–5 business days</div>
        </div>

        <a href="${APP_URL}/dashboard" style="display: block; text-align: center; background: linear-gradient(135deg, #f4611a, #6c3fe6); color: #fff; text-decoration: none; padding: 14px 24px; border-radius: 12px; font-weight: 600; font-size: 15px;">
          Track Your Order →
        </a>
      </div>
      <div style="background: #f9f9f9; padding: 20px; border-radius: 0 0 16px 16px; text-align: center; font-size: 12px; color: #999; border: 1px solid #f0f0f0; border-top: none;">
        <p style="margin: 0 0 8px;">Questions? WhatsApp us at ${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER}</p>
        <p style="margin: 0;">📍 Fastkaam Computer & Printing Press</p>
      </div>
    </div>
    `,
  })
}

export async function sendOrderStatusUpdateEmail({
  to,
  name,
  orderId,
  status,
}: {
  to: string
  name: string
  orderId: string
  status: string
}) {
  const STATUS_MESSAGES: Record<string, { emoji: string; msg: string }> = {
    PRINTING:  { emoji: '🖨️', msg: 'Your cards are now being printed!' },
    SHIPPED:   { emoji: '📦', msg: 'Your order has been shipped and is on its way!' },
    DELIVERED: { emoji: '✅', msg: 'Your order has been delivered. Enjoy your cards!' },
    CANCELLED: { emoji: '❌', msg: 'Your order has been cancelled. Refund will be processed in 3–5 days.' },
  }

  const info = STATUS_MESSAGES[status] || { emoji: '📋', msg: `Order status updated to ${status}` }

  return resend.emails.send({
    from: FROM,
    to,
    subject: `${info.emoji} Order ${status} — ${orderId} | Fastkaam`,
    html: `
    <div style="font-family: 'Segoe UI', sans-serif; max-width: 500px; margin: 0 auto; padding: 32px; background: #fff;">
      <div style="text-align: center; margin-bottom: 24px;">
        <div style="font-size: 40px; margin-bottom: 8px;">${info.emoji}</div>
        <h1 style="font-size: 22px; font-weight: 700; margin: 0;">Order Update</h1>
      </div>
      <p>Hi ${name},</p>
      <p>${info.msg}</p>
      <p style="color: #888; font-size: 13px;">Order ID: <strong style="font-family: monospace;">${orderId}</strong></p>
      <a href="${APP_URL}/dashboard" style="display: inline-block; background: linear-gradient(135deg, #f4611a, #6c3fe6); color: #fff; text-decoration: none; padding: 12px 24px; border-radius: 10px; font-weight: 600; margin-top: 16px;">
        View Order
      </a>
    </div>
    `,
  })
}
