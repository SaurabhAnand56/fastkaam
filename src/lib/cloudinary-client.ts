// src/lib/cloudinary-client.ts

export async function uploadToCloudinary(file: File, folder: string = 'uploads'): Promise<string> {
  // Get signed upload params from our API
  const { data: signData } = await fetch('/api/upload/sign', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ folder }),
  }).then((r) => r.json())

  const formData = new FormData()
  formData.append('file', file)
  formData.append('api_key', process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY || signData.apiKey)
  formData.append('timestamp', signData.timestamp)
  formData.append('signature', signData.signature)
  formData.append('folder', signData.folder)

  const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
  const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
    method: 'POST',
    body: formData,
  })

  if (!res.ok) throw new Error('Upload failed')
  const data = await res.json()
  return data.secure_url
}
