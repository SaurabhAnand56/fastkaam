// src/app/api/upload/sign/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import crypto from 'crypto'

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { folder } = await req.json()
  const timestamp = Math.round(Date.now() / 1000)
  const uploadFolder = `fastkaam/${folder || 'uploads'}/${session.user.id}`

  const params: Record<string, string | number> = {
    folder: uploadFolder,
    timestamp,
  }

  // Generate signature
  const paramStr = Object.keys(params)
    .sort()
    .map((key) => `${key}=${params[key]}`)
    .join('&')

  const signature = crypto
    .createHash('sha256')
    .update(paramStr + process.env.CLOUDINARY_API_SECRET)
    .digest('hex')

  return NextResponse.json({
    timestamp,
    signature,
    folder: uploadFolder,
    apiKey: process.env.CLOUDINARY_API_KEY,
  })
}
