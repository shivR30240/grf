'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Send, MessageCircle, Sparkles, RotateCcw } from 'lucide-react'
import { cn } from '@/lib/utils'

// API key is kept server-side in .env.local — never exposed to the browser.
// All Gemini calls go through /api/chat (see app/api/chat/route.ts).
const CHAT_API_URL = '/api/chat'

interface Message {
  role: 'user' | 'bot'
  text: string
}

interface GeminiPart {
  text: string
}

interface GeminiContent {
  role: 'user' | 'model'
  parts: GeminiPart[]
}

const QUICK_CHIPS = [
  'How do I improve my ROAS?',
  'Explain CPA vs CPM',
  'Google vs Meta Ads — which is better?',
  'What is attribution modeling?',
  'Tips for retargeting campaigns',
]

const WELCOME_MESSAGE =
  "Hi! I'm your GrowIQ marketing assistant, powered by Gemini. Ask me anything about campaigns, metrics, budget strategy, attribution, or digital advertising. How can I help you grow today?"

export function GeminiChatbot() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [history, setHistory] = useState<GeminiContent[]>([])
  const [chipsVisible, setChipsVisible] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  useEffect(() => {
    if (open && messages.length === 0) {
      setMessages([{ role: 'bot', text: WELCOME_MESSAGE }])
    }
  }, [open, messages.length])

  useEffect(() => {
    scrollToBottom()
  }, [messages, loading, scrollToBottom])

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 96)}px`
    }
  }, [input])

  const sendMessage = useCallback(
    async (text: string) => {
      const trimmed = text.trim()
      if (!trimmed || loading) return

      setInput('')
      setChipsVisible(false)
      setMessages((prev) => [...prev, { role: 'user', text: trimmed }])
      setLoading(true)

      const newHistory: GeminiContent[] = [
        ...history,
        { role: 'user', parts: [{ text: trimmed }] },
      ]

      try {
        const res = await fetch(CHAT_API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ contents: newHistory }),
        })

        const data = await res.json()

        if (data.candidates?.[0]?.content?.parts?.[0]?.text) {
          const reply: string = data.candidates[0].content.parts[0].text
          setMessages((prev) => [...prev, { role: 'bot', text: reply }])
          setHistory([
            ...newHistory,
            { role: 'model', parts: [{ text: reply }] },
          ])
        } else if (data.error) {
          setMessages((prev) => [
            ...prev,
            { role: 'bot', text: `Error: ${data.error.message ?? data.error}` },
          ])
        } else {
          setMessages((prev) => [
            ...prev,
            { role: 'bot', text: 'Sorry, I could not get a response. Please try again.' },
          ])
        }
      } catch {
        setMessages((prev) => [
          ...prev,
          {
            role: 'bot',
            text: 'Connection error. Please check your internet connection and try again.',
          },
        ])
      } finally {
        setLoading(false)
      }
    },
    [history, loading]
  )

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage(input)
    }
  }

  const handleReset = () => {
    setMessages([{ role: 'bot', text: WELCOME_MESSAGE }])
    setHistory([])
    setChipsVisible(true)
  }

  return (
    <>
      {/* Floating bubble */}
      <AnimatePresence>
        {!open && (
          <motion.button
            key="bubble"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.94 }}
            onClick={() => setOpen(true)}
            className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full bg-primary shadow-lg shadow-primary/30 flex items-center justify-center text-primary-foreground hover:shadow-xl hover:shadow-primary/40 transition-shadow"
            aria-label="Open marketing assistant"
          >
            <MessageCircle className="h-6 w-6" strokeWidth={2} />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="panel"
            initial={{ opacity: 0, scale: 0.92, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 16 }}
            transition={{ type: 'spring', stiffness: 350, damping: 28 }}
            style={{ transformOrigin: 'bottom right' }}
            className="fixed bottom-6 right-6 z-50 w-[380px] max-w-[calc(100vw-2rem)] h-[560px] max-h-[calc(100vh-4rem)] flex flex-col rounded-2xl border border-border bg-card shadow-2xl shadow-black/15 overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center gap-3 px-4 py-3 bg-primary shrink-0">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/15 shrink-0">
                <Sparkles className="h-4 w-4 text-white" strokeWidth={2} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white leading-tight">GrowIQ Assistant</p>
                <p className="text-[11px] text-white/70 leading-tight">Powered by Gemini</p>
              </div>
              <button
                onClick={handleReset}
                className="h-7 w-7 flex items-center justify-center rounded-lg text-white/70 hover:text-white hover:bg-white/15 transition-colors"
                aria-label="Reset conversation"
                title="Reset conversation"
              >
                <RotateCcw className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={() => setOpen(false)}
                className="h-7 w-7 flex items-center justify-center rounded-lg text-white/70 hover:text-white hover:bg-white/15 transition-colors"
                aria-label="Close assistant"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 scroll-smooth">
              <AnimatePresence initial={false}>
                {messages.map((msg, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                    className={cn('flex gap-2 items-end', msg.role === 'user' && 'flex-row-reverse')}
                  >
                    <div
                      className={cn(
                        'h-6 w-6 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0',
                        msg.role === 'bot'
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted text-muted-foreground'
                      )}
                    >
                      {msg.role === 'bot' ? 'G' : 'U'}
                    </div>
                    <div
                      className={cn(
                        'max-w-[268px] rounded-2xl px-3 py-2 text-[13px] leading-relaxed whitespace-pre-wrap',
                        msg.role === 'bot'
                          ? 'bg-muted text-foreground rounded-bl-sm border border-border/60'
                          : 'bg-primary text-primary-foreground rounded-br-sm'
                      )}
                    >
                      {msg.text}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* Typing indicator */}
              <AnimatePresence>
                {loading && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="flex gap-2 items-end"
                  >
                    <div className="h-6 w-6 rounded-full bg-primary flex items-center justify-center text-[10px] font-bold text-primary-foreground shrink-0">
                      G
                    </div>
                    <div className="bg-muted border border-border/60 rounded-2xl rounded-bl-sm px-3 py-3 flex gap-1 items-center">
                      {[0, 0.15, 0.3].map((delay, j) => (
                        <motion.span
                          key={j}
                          className="h-1.5 w-1.5 rounded-full bg-primary/60"
                          animate={{ scale: [0.7, 1, 0.7], opacity: [0.5, 1, 0.5] }}
                          transition={{ duration: 1.1, repeat: Infinity, delay }}
                        />
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div ref={messagesEndRef} />
            </div>

            {/* Quick chips */}
            <AnimatePresence>
              {chipsVisible && (
                <motion.div
                  initial={{ opacity: 1 }}
                  exit={{ opacity: 0, height: 0 }}
                  className="px-4 pb-2 flex flex-wrap gap-1.5 shrink-0"
                >
                  {QUICK_CHIPS.map((chip) => (
                    <button
                      key={chip}
                      onClick={() => sendMessage(chip)}
                      className="text-[11px] px-2.5 py-1 rounded-full border border-border bg-muted hover:bg-accent hover:text-accent-foreground hover:border-primary/40 text-muted-foreground transition-colors"
                    >
                      {chip}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Input row */}
            <div className="px-3 pb-3 pt-1 border-t border-border shrink-0">
              <div className="flex gap-2 items-end bg-muted rounded-xl border border-border px-3 py-2 focus-within:border-primary/60 transition-colors">
                <textarea
                  ref={textareaRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask about marketing…"
                  rows={1}
                  disabled={loading}
                  className="flex-1 bg-transparent text-[13px] text-foreground placeholder:text-muted-foreground resize-none outline-none leading-relaxed min-h-[20px] max-h-24 disabled:opacity-50"
                  aria-label="Message input"
                />
                <button
                  onClick={() => sendMessage(input)}
                  disabled={!input.trim() || loading}
                  className="h-7 w-7 rounded-lg bg-primary flex items-center justify-center text-primary-foreground disabled:opacity-40 disabled:cursor-not-allowed hover:bg-primary/90 transition-colors shrink-0"
                  aria-label="Send message"
                >
                  <Send className="h-3.5 w-3.5" />
                </button>
              </div>
              <p className="text-center text-[10px] text-muted-foreground mt-1.5">
                No chat history saved · GrowIQ × Gemini
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
