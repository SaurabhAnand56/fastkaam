// src/app/page.tsx — Fastkaam Homepage
import { Suspense } from 'react'
import HeroSection from '@/components/home/HeroSection'
import ServicesSection from '@/components/home/ServicesSection'
import PVCCardSection from '@/components/home/PVCCardSection'
import StatsSection from '@/components/home/StatsSection'
import TestimonialsSection from '@/components/home/TestimonialsSection'
import YouTubeShortsSection from '@/components/home/YouTubeShortsSection'
import BlogPreviewSection from '@/components/home/BlogPreviewSection'
import FAQSection from '@/components/home/FAQSection'
import CTASection from '@/components/home/CTASection'
import WhatsAppFloat from '@/components/ui/WhatsAppFloat'

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <StatsSection />
      <ServicesSection />
      <PVCCardSection />
      <TestimonialsSection />
      <YouTubeShortsSection />
      <Suspense fallback={null}>
        <BlogPreviewSection />
      </Suspense>
      <FAQSection />
      <CTASection />
      <WhatsAppFloat />
    </>
  )
}
