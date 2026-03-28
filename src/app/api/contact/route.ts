// src/app/api/contact/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const resend = new Resend(process.env.RESEND_API_KEY)

const ContactSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  phone: z.string().optional(),
  subject: z.string().min(3).max(200),
  message: z.string().min(10).max(2000),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const parsed = ContactSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
    }

    const { name, email, phone, subject, message } = parsed.data

    // Save to DB
    await prisma.contactMessage.create({
      data: { name, email, phone, subject, message },
    })

    // Send admin notification email
    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL!,
      to: process.env.RESEND_ADMIN_EMAIL!,
      subject: `New Contact: ${subject}`,
      html: `
        <div style="font-family: sans-serif; max-width: 500px;">
          <h2 style="color: #f4611a;">New Contact Message — Fastkaam</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr><td style="padding: 8px 0; color: #666; width: 80px;">Name</td><td style="padding: 8px 0; font-weight: 600;">${name}</td></tr>
            <tr><td style="padding: 8px 0; color: #666;">Email</td><td style="padding: 8px 0;">${email}</td></tr>
            ${phone ? `<tr><td style="padding: 8px 0; color: #666;">Phone</td><td style="padding: 8px 0;">${phone}</td></tr>` : ''}
            <tr><td style="padding: 8px 0; color: #666;">Subject</td><td style="padding: 8px 0;">${subject}</td></tr>
          </table>
          <div style="background: #f5f5f5; border-radius: 8px; padding: 16px; margin-top: 12px;">
            <p style="margin: 0; white-space: pre-wrap;">${message}</p>
          </div>
          <p style="color: #999; font-size: 12px; margin-top: 16px;">Reply directly to this email to respond.</p>
        </div>
      `,
      replyTo: email,
    })

    // Send auto-reply to user
    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL!,
      to: email,
      subject: 'We received your message — Fastkaam',
      html: `
        <div style="font-family: sans-serif; max-width: 500px;">
          <h2 style="color: #f4611a;">Thank you, ${name}!</h2>
          <p>We've received your message and will get back to you within 24 hours.</p>
          <p style="color: #666;">Your message: <em>${subject}</em></p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
          <p style="font-size: 12px; color: #999;">
            📍 Fastkaam Computer & Printing Press<br/>
            📞 ${process.env.NEXT_PUBLIC_PHONE_NUMBER}<br/>
            💬 WhatsApp: ${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER}
          </p>
        </div>
      `,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Contact form error:', error)
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 })
  }
}
