// src/app/api/ai/generate/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { z } from 'zod'

const Schema = z.object({
  prompt: z.string().min(5).max(500),
  style: z.string().default('vibrant'),
})

const STYLE_PROMPTS: Record<string, string> = {
  vibrant:      'vibrant, colorful, high contrast, eye-catching, bold colors',
  minimal:      'minimal, clean, white space, simple, professional, subtle colors',
  traditional:  'Indian traditional art, intricate patterns, warm colors, cultural motifs',
  professional: 'corporate, professional, business, clean, blue and white palette',
  festive:      'festive, celebratory, bright, joyful, decorative elements',
}

export async function POST(req: NextRequest) {
  try {
    // Optional: require auth for AI features
    // const session = await getServerSession(authOptions)
    // if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await req.json()
    const parsed = Schema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
    }

    const { prompt, style } = parsed.data
    const styleDesc = STYLE_PROMPTS[style] || STYLE_PROMPTS.vibrant

    const fullPrompt = `Create a print design: ${prompt}. Style: ${styleDesc}. 
    High resolution, suitable for printing, professional quality, 
    suitable for Indian market. No text unless specifically requested.`

    // Gemini image generation
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY
    if (!GEMINI_API_KEY) {
      return NextResponse.json({ error: 'AI service not configured' }, { status: 503 })
    }

    // Using Gemini Imagen 3 via REST API
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-001:predict?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          instances: [{ prompt: fullPrompt }],
          parameters: {
            sampleCount: 2,
            aspectRatio: '1:1',
            safetyFilterLevel: 'block_some',
            personGeneration: 'dont_allow',
          },
        }),
      }
    )

    if (!response.ok) {
      const err = await response.json()
      console.error('Gemini API error:', err)
      return NextResponse.json({ error: 'AI generation failed' }, { status: 502 })
    }

    const data = await response.json()

    // Convert base64 images to data URLs
    const images = (data.predictions || []).map(
      (pred: any) => `data:image/png;base64,${pred.bytesBase64Encoded}`
    )

    if (!images.length) {
      return NextResponse.json({ error: 'No images generated' }, { status: 500 })
    }

    return NextResponse.json({ images, prompt: fullPrompt })
  } catch (error) {
    console.error('AI generate error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
