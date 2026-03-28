'use client'
// src/app/ai-design/page.tsx — AI Print Design Generator

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, Download, RefreshCw, Loader2, ImageIcon } from 'lucide-react'
import toast from 'react-hot-toast'
import axios from 'axios'

const STYLE_OPTIONS = [
  { id: 'vibrant', label: 'Vibrant & Colorful', emoji: '🌈' },
  { id: 'minimal', label: 'Minimal & Clean', emoji: '⚪' },
  { id: 'traditional', label: 'Indian Traditional', emoji: '🪔' },
  { id: 'professional', label: 'Corporate / Professional', emoji: '💼' },
  { id: 'festive', label: 'Festival Special', emoji: '🎉' },
]

const PROMPT_SUGGESTIONS = [
  'Diwali festival greeting card design with diyas and fireworks',
  'Professional visiting card for a doctor with blue and white theme',
  'Colorful banner for a new shop opening with balloons',
  'Minimal certificate border design in gold',
  'Wedding invitation card background with floral patterns',
]

export default function AIDesignPage() {
  const [prompt, setPrompt] = useState('')
  const [style, setStyle] = useState('vibrant')
  const [generating, setGenerating] = useState(false)
  const [generatedImages, setGeneratedImages] = useState<string[]>([])
  const [selectedIdx, setSelectedIdx] = useState(0)

  const generate = async () => {
    if (!prompt.trim()) { toast.error('Please describe your design'); return }
    setGenerating(true)
    try {
      const { data } = await axios.post('/api/ai/generate', { prompt, style })
      setGeneratedImages(data.images)
      setSelectedIdx(0)
      toast.success('Design generated!')
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Generation failed. Try again.')
    } finally {
      setGenerating(false)
    }
  }

  const downloadImage = async (url: string, idx: number) => {
    const a = document.createElement('a')
    a.href = url
    a.download = `fastkaam-design-${idx + 1}.png`
    a.click()
  }

  return (
    <div className="min-h-screen pt-20 pb-16 bg-gray-50 dark:bg-gray-900">
      {/* Hero */}
      <div className="bg-gradient-to-br from-violet-600 via-purple-600 to-pink-600 py-14 px-4 text-white text-center mb-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full px-4 py-1.5 text-sm font-medium mb-4">
            <Sparkles className="w-4 h-4" />
            Powered by Google Gemini AI
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-3">AI Print Design Generator</h1>
          <p className="text-white/70 max-w-lg mx-auto text-sm">
            Describe your design and AI will create marketing creatives, card backgrounds, banners, and more.
          </p>
        </motion.div>
      </div>

      <div className="max-w-4xl mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Input panel */}
          <div>
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6">
              <h2 className="font-bold text-gray-800 dark:text-gray-100 mb-4">Describe Your Design</h2>

              {/* Style selector */}
              <div className="mb-4">
                <label className="text-sm font-medium text-gray-600 dark:text-gray-400 block mb-2">Style</label>
                <div className="flex flex-wrap gap-2">
                  {STYLE_OPTIONS.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => setStyle(s.id)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${
                        style === s.id
                          ? 'bg-violet-600 text-white border-violet-600'
                          : 'border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:border-violet-300'
                      }`}
                    >
                      <span>{s.emoji}</span>
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Prompt textarea */}
              <div className="mb-3">
                <label className="text-sm font-medium text-gray-600 dark:text-gray-400 block mb-2">
                  Design Description
                </label>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  rows={4}
                  placeholder="E.g. A vibrant Diwali greeting card with diyas, rangoli patterns, and fireworks in warm colors..."
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-sm text-gray-800 dark:text-gray-100 placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-violet-500/30"
                />
                <div className="text-right text-xs text-gray-400 mt-1">{prompt.length}/500</div>
              </div>

              {/* Suggestions */}
              <div className="mb-5">
                <div className="text-xs text-gray-400 mb-2">Try these:</div>
                <div className="flex flex-wrap gap-2">
                  {PROMPT_SUGGESTIONS.map((s) => (
                    <button
                      key={s}
                      onClick={() => setPrompt(s)}
                      className="text-xs text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-950/30 border border-violet-100 dark:border-violet-800 rounded-lg px-2 py-1 hover:bg-violet-100 dark:hover:bg-violet-950/50 transition-colors text-left"
                    >
                      {s.slice(0, 40)}...
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={generate}
                disabled={generating || !prompt.trim()}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-violet-600 to-pink-500 text-white font-bold text-sm hover:opacity-90 transition-all shadow-lg shadow-violet-500/30 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {generating ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Generating...</>
                ) : (
                  <><Sparkles className="w-4 h-4" /> Generate Design</>
                )}
              </button>
            </div>
          </div>

          {/* Output panel */}
          <div>
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6 min-h-[400px] flex flex-col">
              <h2 className="font-bold text-gray-800 dark:text-gray-100 mb-4">Generated Designs</h2>

              {generating ? (
                <div className="flex-1 flex flex-col items-center justify-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center animate-pulse">
                    <Sparkles className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">AI is creating your design...</div>
                  <div className="flex gap-1.5">
                    {[0, 1, 2].map((i) => (
                      <div key={i} className="w-2 h-2 rounded-full bg-violet-400 animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
                    ))}
                  </div>
                </div>
              ) : generatedImages.length > 0 ? (
                <div className="flex-1">
                  {/* Main image */}
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={selectedIdx}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="relative rounded-xl overflow-hidden border border-gray-100 dark:border-gray-700 mb-3"
                    >
                      <img
                        src={generatedImages[selectedIdx]}
                        alt="AI generated design"
                        className="w-full object-cover"
                      />
                    </motion.div>
                  </AnimatePresence>

                  {/* Thumbnails */}
                  {generatedImages.length > 1 && (
                    <div className="flex gap-2 mb-4">
                      {generatedImages.map((img, i) => (
                        <button
                          key={i}
                          onClick={() => setSelectedIdx(i)}
                          className={`w-14 h-14 rounded-lg overflow-hidden border-2 transition-all ${
                            selectedIdx === i ? 'border-violet-500' : 'border-transparent'
                          }`}
                        >
                          <img src={img} alt={`variant ${i + 1}`} className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => downloadImage(generatedImages[selectedIdx], selectedIdx)}
                      className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-pink-500 text-white text-sm font-semibold hover:opacity-90 transition-opacity"
                    >
                      <Download className="w-4 h-4" /> Download
                    </button>
                    <button
                      onClick={generate}
                      className="px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400 text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center gap-1.5"
                    >
                      <RefreshCw className="w-3.5 h-3.5" /> Regenerate
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center gap-3 text-gray-400">
                  <div className="w-16 h-16 rounded-2xl bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                    <ImageIcon className="w-8 h-8 text-gray-300 dark:text-gray-600" />
                  </div>
                  <div className="text-sm text-center">
                    Your AI-generated designs will appear here
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
