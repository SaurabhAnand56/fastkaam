'use client'
// src/app/pvc-cards/page.tsx — PVC Card Printing Ecommerce

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Upload, Eye, ShoppingCart, CheckCircle, CreditCard, Leaf, Heart, Wheat, ImagePlus } from 'lucide-react'
import Image from 'next/image'
import { useCartStore } from '@/stores/cartStore'
import { uploadToCloudinary } from '@/lib/cloudinary-client'
import toast from 'react-hot-toast'

const CARD_TYPES = [
  {
    id: 'AADHAAR',
    name: 'Aadhaar Card',
    nameHi: 'आधार कार्ड',
    price: 30,
    icon: CreditCard,
    color: 'from-blue-500 to-blue-700',
    bg: 'bg-blue-50 dark:bg-blue-950/20',
    border: 'border-blue-200 dark:border-blue-800',
    description: 'Premium PVC Aadhaar card replica for wallet use',
  },
  {
    id: 'PAN',
    name: 'PAN Card',
    nameHi: 'पैन कार्ड',
    price: 30,
    icon: CreditCard,
    color: 'from-amber-500 to-orange-600',
    bg: 'bg-amber-50 dark:bg-amber-950/20',
    border: 'border-amber-200 dark:border-amber-800',
    description: 'Durable PVC PAN card for everyday use',
  },
  {
    id: 'ABHA',
    name: 'ABHA Card',
    nameHi: 'ABHA कार्ड',
    price: 35,
    icon: Heart,
    color: 'from-green-500 to-emerald-700',
    bg: 'bg-green-50 dark:bg-green-950/20',
    border: 'border-green-200 dark:border-green-800',
    description: 'Ayushman Bharat Health Account card',
  },
  {
    id: 'AYUSHMAN',
    name: 'Ayushman Bharat',
    nameHi: 'आयुष्मान भारत',
    price: 35,
    icon: Heart,
    color: 'from-rose-500 to-pink-700',
    bg: 'bg-rose-50 dark:bg-rose-950/20',
    border: 'border-rose-200 dark:border-rose-800',
    description: 'Ayushman Bharat health scheme card',
  },
  {
    id: 'KISAN',
    name: 'Kisan Card',
    nameHi: 'किसान कार्ड',
    price: 30,
    icon: Wheat,
    color: 'from-yellow-500 to-lime-600',
    bg: 'bg-yellow-50 dark:bg-yellow-950/20',
    border: 'border-yellow-200 dark:border-yellow-800',
    description: 'PM Kisan scheme identity card',
  },
  {
    id: 'CUSTOM',
    name: 'Custom Card',
    nameHi: 'कस्टम कार्ड',
    price: 50,
    icon: ImagePlus,
    color: 'from-violet-500 to-purple-700',
    bg: 'bg-violet-50 dark:bg-violet-950/20',
    border: 'border-violet-200 dark:border-violet-800',
    description: 'Upload any custom design PVC card',
  },
]

type Step = 'select' | 'upload' | 'preview'

export default function PVCCardsPage() {
  const [step, setStep] = useState<Step>('select')
  const [selectedCard, setSelectedCard] = useState<(typeof CARD_TYPES)[0] | null>(null)
  const [frontImage, setFrontImage] = useState<{ file: File; preview: string; url?: string } | null>(null)
  const [backImage, setBackImage] = useState<{ file: File; preview: string; url?: string } | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [uploading, setUploading] = useState(false)
  const { addItem } = useCartStore()

  const handleFileSelect = (side: 'front' | 'back', file: File) => {
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file')
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be under 5MB')
      return
    }
    const preview = URL.createObjectURL(file)
    if (side === 'front') setFrontImage({ file, preview })
    else setBackImage({ file, preview })
  }

  const handleAddToCart = async () => {
    if (!selectedCard || !frontImage || !backImage) return
    setUploading(true)
    try {
      const [frontUrl, backUrl] = await Promise.all([
        uploadToCloudinary(frontImage.file, 'pvc-cards'),
        uploadToCloudinary(backImage.file, 'pvc-cards'),
      ])
      addItem({
        cardType: selectedCard.id,
        cardName: selectedCard.name,
        frontImageUrl: frontUrl,
        backImageUrl: backUrl,
        frontPreview: frontImage.preview,
        backPreview: backImage.preview,
        quantity,
        unitPrice: selectedCard.price,
      })
      toast.success('Added to cart!')
      // Reset
      setStep('select')
      setSelectedCard(null)
      setFrontImage(null)
      setBackImage(null)
      setQuantity(1)
    } catch {
      toast.error('Upload failed. Try again.')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="min-h-screen pt-20 pb-16">
      {/* Header */}
      <div className="bg-gradient-to-br from-violet-600 via-purple-600 to-orange-500 py-16 px-4 text-white text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full px-4 py-1.5 text-sm font-medium mb-4">
            🖨️ Premium PVC Card Printing
          </div>
          <h1 className="text-3xl md:text-5xl font-bold mb-3">PVC Card Printing</h1>
          <p className="text-white/80 max-w-xl mx-auto text-sm md:text-base">
            Upload your card image and get premium quality PVC cards delivered to your doorstep.
            Fast printing, durable quality.
          </p>
        </motion.div>

        {/* Step indicator */}
        <div className="flex items-center justify-center gap-3 mt-8">
          {['select', 'upload', 'preview'].map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                  step === s
                    ? 'bg-white text-violet-600'
                    : ['select', 'upload', 'preview'].indexOf(step) > i
                    ? 'bg-green-400 text-white'
                    : 'bg-white/20 text-white/60'
                }`}
              >
                {['select', 'upload', 'preview'].indexOf(step) > i ? '✓' : i + 1}
              </div>
              <span className="text-sm text-white/70 hidden sm:inline capitalize">{s}</span>
              {i < 2 && <div className="w-8 h-0.5 bg-white/30" />}
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 mt-10">
        {/* STEP 1: Select Card */}
        <AnimatePresence mode="wait">
          {step === 'select' && (
            <motion.div
              key="select"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              <h2 className="text-xl font-bold text-center mb-6 text-gray-800 dark:text-gray-100">
                Choose Card Type
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {CARD_TYPES.map((card) => {
                  const Icon = card.icon
                  return (
                    <motion.button
                      key={card.id}
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => { setSelectedCard(card); setStep('upload') }}
                      className={`${card.bg} ${card.border} border-2 rounded-2xl p-5 text-left hover:shadow-lg transition-all group`}
                    >
                      <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center mb-3 shadow-md group-hover:scale-110 transition-transform`}>
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <div className="font-semibold text-gray-800 dark:text-gray-100 text-sm mb-0.5">
                        {card.name}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mb-3 line-clamp-2">
                        {card.description}
                      </div>
                      <div className={`inline-flex items-center gap-1 bg-gradient-to-r ${card.color} text-white text-xs font-bold px-3 py-1 rounded-full`}>
                        ₹{card.price}/card
                      </div>
                    </motion.button>
                  )
                })}
              </div>
            </motion.div>
          )}

          {/* STEP 2: Upload */}
          {step === 'upload' && selectedCard && (
            <motion.div
              key="upload"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <div className="flex items-center gap-3 mb-6">
                <button onClick={() => setStep('select')} className="text-gray-400 hover:text-gray-600 transition-colors">← Back</button>
                <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">
                  Upload {selectedCard.name} Images
                </h2>
              </div>

              <div className="grid md:grid-cols-2 gap-6 mb-8">
                {(['front', 'back'] as const).map((side) => {
                  const image = side === 'front' ? frontImage : backImage
                  return (
                    <div key={side}>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 capitalize">
                        {side} Side *
                      </label>
                      <label
                        className={`block border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all hover:border-violet-400 hover:bg-violet-50 dark:hover:bg-violet-950/20 ${
                          image ? 'border-green-400 bg-green-50 dark:bg-green-950/20' : 'border-gray-200 dark:border-gray-700'
                        }`}
                      >
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => e.target.files?.[0] && handleFileSelect(side, e.target.files[0])}
                        />
                        {image ? (
                          <div>
                            <img src={image.preview} alt={side} className="w-full h-32 object-contain rounded-xl mb-2" />
                            <span className="text-xs text-green-600 font-medium">✓ Uploaded — click to change</span>
                          </div>
                        ) : (
                          <div>
                            <Upload className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                            <div className="text-sm font-medium text-gray-600 dark:text-gray-400">Upload {side} image</div>
                            <div className="text-xs text-gray-400 mt-1">JPG, PNG — max 5MB</div>
                          </div>
                        )}
                      </label>
                    </div>
                  )
                })}
              </div>

              <div className="flex items-center gap-4 mb-6">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Quantity:</label>
                <div className="flex items-center gap-2 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">−</button>
                  <span className="px-4 py-2 font-medium text-sm">{quantity}</span>
                  <button onClick={() => setQuantity(Math.min(100, quantity + 1))} className="px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">+</button>
                </div>
                <div className="text-sm text-gray-500">
                  Total: <span className="font-bold text-gray-800 dark:text-gray-100">₹{selectedCard.price * quantity}</span>
                </div>
              </div>

              <button
                onClick={() => setStep('preview')}
                disabled={!frontImage || !backImage}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-violet-600 to-orange-500 text-white font-semibold text-sm hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-violet-500/30"
              >
                Preview Card →
              </button>
            </motion.div>
          )}

          {/* STEP 3: Preview */}
          {step === 'preview' && selectedCard && frontImage && backImage && (
            <motion.div
              key="preview"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <div className="flex items-center gap-3 mb-6">
                <button onClick={() => setStep('upload')} className="text-gray-400 hover:text-gray-600 transition-colors">← Back</button>
                <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">Preview & Confirm</h2>
              </div>

              <div className="grid md:grid-cols-2 gap-8 mb-8">
                {/* Preview */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-4">Card Preview</h3>
                  <div className="space-y-4">
                    {[{ label: 'Front', img: frontImage.preview }, { label: 'Back', img: backImage.preview }].map((side) => (
                      <div key={side.label}>
                        <div className="text-xs text-gray-400 mb-1">{side.label} side</div>
                        <div className="rounded-2xl overflow-hidden border-2 border-gray-100 dark:border-gray-800 shadow-xl">
                          <img src={side.img} alt={side.label} className="w-full h-44 object-cover" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Order summary */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-4">Order Summary</h3>
                  <div className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-5 space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Card Type</span>
                      <span className="font-medium">{selectedCard.name}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Price per card</span>
                      <span className="font-medium">₹{selectedCard.price}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Quantity</span>
                      <span className="font-medium">{quantity}</span>
                    </div>
                    <div className="border-t border-gray-200 dark:border-gray-700 pt-3 flex justify-between">
                      <span className="font-semibold">Total</span>
                      <span className="font-bold text-lg text-orange-500">₹{selectedCard.price * quantity}</span>
                    </div>
                  </div>

                  <div className="mt-4 p-4 bg-green-50 dark:bg-green-950/20 rounded-xl border border-green-100 dark:border-green-800">
                    <div className="flex items-start gap-2 text-xs text-green-700 dark:text-green-400">
                      <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                      <div>
                        <div className="font-semibold mb-1">Premium Quality Guaranteed</div>
                        <div>High-quality 760 micron PVC material. Waterproof and durable.</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={uploading}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-orange-500 to-violet-600 text-white font-bold hover:opacity-90 transition-all shadow-lg shadow-orange-500/30 flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {uploading ? (
                  <>⟳ Uploading images...</>
                ) : (
                  <><ShoppingCart className="w-5 h-5" /> Add to Cart — ₹{selectedCard.price * quantity}</>
                )}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
