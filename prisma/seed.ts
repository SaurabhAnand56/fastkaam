// prisma/seed.ts
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Seed card products
  const cards = [
    {
      name: 'Aadhaar Card',
      nameHindi: 'आधार कार्ड',
      type: 'AADHAAR' as const,
      price: 30,
      description: 'Premium PVC Aadhaar card replica for wallet use. 760 micron thick, waterproof.',
      isActive: true,
      sortOrder: 1,
    },
    {
      name: 'PAN Card',
      nameHindi: 'पैन कार्ड',
      type: 'PAN' as const,
      price: 30,
      description: 'Durable PVC PAN card for everyday use. High-quality glossy finish.',
      isActive: true,
      sortOrder: 2,
    },
    {
      name: 'ABHA Card',
      nameHindi: 'ABHA कार्ड',
      type: 'ABHA' as const,
      price: 35,
      description: 'Ayushman Bharat Health Account card. Premium quality PVC.',
      isActive: true,
      sortOrder: 3,
    },
    {
      name: 'Ayushman Bharat Card',
      nameHindi: 'आयुष्मान भारत कार्ड',
      type: 'AYUSHMAN' as const,
      price: 35,
      description: 'Pradhan Mantri Jan Arogya Yojana (PM-JAY) health card in PVC.',
      isActive: true,
      sortOrder: 4,
    },
    {
      name: 'Kisan Card',
      nameHindi: 'किसान कार्ड',
      type: 'KISAN' as const,
      price: 30,
      description: 'PM Kisan scheme identity card. Durable PVC format.',
      isActive: true,
      sortOrder: 5,
    },
    {
      name: 'Custom Card',
      nameHindi: 'कस्टम कार्ड',
      type: 'CUSTOM' as const,
      price: 50,
      description: 'Upload any custom design for PVC printing. Any card, any design.',
      isActive: true,
      sortOrder: 6,
    },
  ]

  for (const card of cards) {
    await prisma.cardProduct.upsert({
      where: { type: card.type },
      update: card,
      create: card,
    })
    console.log(`  ✓ ${card.name} — ₹${card.price}`)
  }

  // Seed admin user
  const adminEmail = 'admin@fastkaam.in'
  const existingAdmin = await prisma.user.findUnique({ where: { email: adminEmail } })

  if (!existingAdmin) {
    const passwordHash = await bcrypt.hash('Admin@123!', 12)
    await prisma.user.create({
      data: {
        name: 'Fastkaam Admin',
        email: adminEmail,
        passwordHash,
        role: 'ADMIN',
      },
    })
    console.log('  ✓ Admin user created: admin@fastkaam.in / Admin@123!')
    console.log('  ⚠️  Change admin password after first login!')
  } else {
    console.log('  ✓ Admin user already exists')
  }

  // Seed sample blog post
  const blogSlug = 'how-to-get-pvc-aadhaar-card-printed'
  const existingPost = await prisma.blogPost.findUnique({ where: { slug: blogSlug } })

  if (!existingPost) {
    await prisma.blogPost.create({
      data: {
        title: 'How to Get Your Aadhaar Card Printed in PVC Format',
        titleHindi: 'PVC फॉर्मेट में आधार कार्ड कैसे प्रिंट करवाएं',
        slug: blogSlug,
        content: `<h2>Why Get a PVC Aadhaar Card?</h2>
<p>The standard paper Aadhaar card tears easily and becomes unreadable over time. A PVC (Plastic) Aadhaar card is durable, waterproof, and fits perfectly in your wallet — just like a credit card.</p>

<h2>What You Need</h2>
<ul>
  <li>A clear photo of your Aadhaar card (front and back)</li>
  <li>Your mobile number for order tracking</li>
</ul>

<h2>Simple 3-Step Process at Fastkaam</h2>
<ol>
  <li><strong>Upload</strong> — Take a clear photo of both sides of your Aadhaar card</li>
  <li><strong>Checkout</strong> — Select quantity and make secure payment</li>
  <li><strong>Receive</strong> — Get your PVC card delivered in 1-3 days</li>
</ol>

<p>Order yours today at just ₹30 per card!</p>`,
        excerpt: 'Learn how to get your Aadhaar card printed in durable PVC format. Easy 3-step process, fast delivery, just ₹30.',
        featuredImage: 'https://res.cloudinary.com/demo/image/upload/sample.jpg',
        metaTitle: 'PVC Aadhaar Card Printing — How to Get It Done | Fastkaam',
        metaDesc: 'Get your Aadhaar card printed in premium PVC format for just ₹30. Waterproof, wallet-size, fast delivery.',
        metaKeywords: 'PVC Aadhaar card, Aadhaar card printing, plastic Aadhaar card',
        published: true,
        publishedAt: new Date(),
      },
    })
    console.log('  ✓ Sample blog post created')
  }

  console.log('\n✅ Seeding complete!')
}

main()
  .catch((e) => {
    console.error('Seed error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
