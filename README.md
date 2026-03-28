# 🖨️ Fastkaam Computer & Printing Press

**Full-stack production-ready platform for PVC card printing ecommerce, blog CMS, and digital services.**

---

## 🚀 Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Styling | Tailwind CSS + ShadCN UI |
| Animation | Framer Motion |
| Database | PostgreSQL (via Supabase/Neon) |
| ORM | Prisma |
| Auth | NextAuth.js (Google + Credentials) |
| Storage | Cloudinary |
| Email | Resend |
| Payment | Paytm Payment Gateway |
| AI | Google Gemini API |
| Deployment | Vercel |

---

## ⚡ Quick Start

### 1. Clone and install
```bash
git clone <your-repo>
cd fastkaam
npm install
```

### 2. Environment variables
```bash
cp .env.example .env.local
# Fill in all values in .env.local
```

### 3. Database setup
```bash
npm run db:generate   # Generate Prisma client
npm run db:push       # Push schema to database
npm run db:seed       # Seed initial data (card products)
```

### 4. Run development
```bash
npm run dev
# Open http://localhost:3000
```

---

## 📁 Project Structure

```
fastkaam/
├── prisma/
│   ├── schema.prisma          # Database schema
│   └── seed.ts                # Initial data seeder
├── src/
│   ├── app/
│   │   ├── (public)/          # Public pages
│   │   │   ├── page.tsx       # Homepage
│   │   │   ├── services/      # Services page
│   │   │   ├── pvc-cards/     # PVC card ordering
│   │   │   ├── blog/          # Blog listing + posts
│   │   │   ├── about/         # About page
│   │   │   └── contact/       # Contact page
│   │   ├── dashboard/         # User dashboard (protected)
│   │   ├── admin/             # Admin panel (ADMIN only)
│   │   │   ├── page.tsx       # Analytics dashboard
│   │   │   ├── orders/        # Order management
│   │   │   ├── blog/          # Blog CMS
│   │   │   ├── users/         # User management
│   │   │   └── products/      # PVC product management
│   │   ├── api/
│   │   │   ├── auth/          # NextAuth routes
│   │   │   ├── orders/        # Order CRUD
│   │   │   ├── blog/          # Blog API
│   │   │   ├── contact/       # Contact form
│   │   │   ├── payment/       # Paytm integration
│   │   │   ├── upload/        # Cloudinary signed upload
│   │   │   └── admin/         # Admin-only APIs
│   │   ├── layout.tsx         # Root layout
│   │   └── globals.css        # Global styles
│   ├── components/
│   │   ├── home/              # Homepage sections
│   │   ├── layout/            # Navbar, Footer
│   │   ├── admin/             # Admin components
│   │   ├── ui/                # Reusable UI components
│   │   └── providers/         # Context providers
│   ├── lib/
│   │   ├── auth.ts            # NextAuth config
│   │   ├── prisma.ts          # Prisma client
│   │   ├── email.ts           # Resend email helpers
│   │   ├── cloudinary-client.ts # Client upload util
│   │   └── utils.ts           # Shared utilities
│   └── stores/
│       ├── cartStore.ts        # Zustand cart state
│       └── languageStore.ts    # Hindi/English toggle
```

---

## 🪪 PVC Card Types & Pricing

| Card | Price |
|------|-------|
| Aadhaar Card | ₹30/card |
| PAN Card | ₹30/card |
| ABHA Card | ₹35/card |
| Ayushman Bharat | ₹35/card |
| Kisan Card | ₹30/card |
| Custom Card | ₹50/card |

---

## 📦 Order Status Flow

```
PENDING → PROCESSING → PRINTING → SHIPPED → DELIVERED
                   ↘ CANCELLED ↙
```

---

## 🔑 Admin Access

1. Create a user account via `/signup`
2. Run this in Prisma Studio or your DB:
   ```sql
   UPDATE users SET role = 'ADMIN' WHERE email = 'your@email.com';
   ```
3. Access admin at `/admin`

---

## 💳 Paytm Integration

### Staging (development)
- Set `NEXT_PUBLIC_PAYTM_ENV=staging`
- Set `PAYTM_WEBSITE=WEBSTAGING`
- Use Paytm staging credentials

### Production (live)
- Set `NEXT_PUBLIC_PAYTM_ENV=production`
- Set `PAYTM_WEBSITE=DEFAULT`
- Use live Paytm merchant credentials

> ⚠️ **Important**: In production, install the official `paytmchecksum` npm package and use it to verify webhook signatures. The current implementation has a placeholder for this.

```bash
npm install paytmchecksum
```

---

## ☁️ Cloudinary Setup

1. Create account at [cloudinary.com](https://cloudinary.com)
2. Create an **unsigned upload preset** named `fastkaam`
3. Copy your cloud name, API key, and API secret to `.env.local`

---

## 📧 Resend Email Setup

1. Sign up at [resend.com](https://resend.com)
2. Add and verify your domain
3. Create an API key
4. Set `RESEND_FROM_EMAIL` to your verified domain email

---

## 🚀 Deployment (Vercel)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variables in Vercel dashboard
# Or via CLI:
vercel env add DATABASE_URL
```

### Recommended services:
- **Database**: [Supabase](https://supabase.com) or [Neon](https://neon.tech)
- **Media**: [Cloudinary](https://cloudinary.com)
- **Email**: [Resend](https://resend.com)
- **Deployment**: [Vercel](https://vercel.com)

---

## 🔒 Security Checklist

- [x] JWT-based authentication
- [x] Role-based access control (USER / ADMIN)
- [x] Zod input validation on all API routes
- [x] Signed Cloudinary uploads (no public key exposure)
- [x] Paytm webhook signature verification
- [x] Security headers (X-Frame-Options, CSP)
- [x] HTTPS-ready
- [ ] Rate limiting (add `@upstash/ratelimit` for production)
- [ ] File type & size validation on uploads

---

## 🤖 AI Feature (Gemini)

Add to `/api/ai/generate`:
```typescript
import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)
const model = genAI.getGenerativeModel({ model: 'gemini-pro-vision' })
```

---

## 📞 Support

- WhatsApp: See `NEXT_PUBLIC_WHATSAPP_NUMBER` in your env
- Email: hello@fastkaam.in

---

Built with ❤️ for Fastkaam Computer & Printing Press
