import dynamic from 'next/dynamic'
import { useState, useRef, useCallback } from 'react'
import { NextSeo } from 'next-seo'
import { motion } from 'framer-motion'
import { Flame, Zap, Heart, Sparkles, Github, Linkedin } from 'lucide-react'
import Image from 'next/image'

import EnterpriseHeader from '../components/EnterpriseHeader'
import { type LanguageKey } from '@/lib/constants'
import { useAuth } from '@/contexts/AuthContext'
import { useSnippets } from '@/contexts/SnippetContext'
import SaveSnippetModal from '@/components/SaveSnippetModal'
import ShareSnippetModal from '@/components/ShareSnippetModal'
import AdBanner, { InterstitialAd } from '@/components/AdBanner'
import toast from 'react-hot-toast'

const Editor = dynamic(() => import('../components/Editor'), { ssr: false })

export default function EditorPage() {
  const [language, setLanguage] = useState<LanguageKey>('python')
  const [code, setCode] = useState('')
  const [showSaveModal, setShowSaveModal] = useState(false)
  const [showShareModal, setShowShareModal] = useState(false)
  const [showInterstitial, setShowInterstitial] = useState(false)
  const editorRef = useRef<any>(null)
  
  const { user, isAuthenticated, incrementUsage, checkUsageLimit } = useAuth()
  const { setCurrentSnippet, currentSnippet } = useSnippets()
  
  const handleSave = () => {
    if (!isAuthenticated) {
      toast.error('Please sign in to save snippets')
      return
    }
    // Get current code from editor if available
    const currentCode = editorRef.current?.getValue?.() || code
    setCode(currentCode)
    setShowSaveModal(true)
  }
  
  const handleShare = () => {
    const currentCode = editorRef.current?.getValue?.() || code
    setCode(currentCode)
    setShowShareModal(true)
  }
  
  const handleRun = useCallback(() => {
    if (user && !user.isPremium) {
      if (!checkUsageLimit('execution')) {
        toast.error('Daily limit reached! Upgrade to Pro for unlimited runs.')
        return
      }
      incrementUsage('execution')
      
      // Show interstitial ad every 5 runs for free users
      if (user.executionsToday > 0 && user.executionsToday % 5 === 0) {
        setShowInterstitial(true)
      }
    }
    // The actual run is handled by the Editor component
  }, [user, checkUsageLimit, incrementUsage])
  
  const handleLoadSnippet = (snippet: any) => {
    setCode(snippet.code)
    setLanguage(snippet.language)
    setCurrentSnippet(snippet)
    toast.success(`Loaded "${snippet.title}"`)
  }
  
  return (
    <>
      <NextSeo
        title="CodeRipper - Enterprise Online Code Compiler & AI Editor"
        description="Professional online code editor with AI assistance, 15+ programming languages, real-time collaboration, and cloud compilation. Perfect for developers, students, and teams."
        openGraph={{
          url: 'https://coderipper.dev',
          title: 'CodeRipper - Enterprise Online Code Compiler & AI Editor',
          description: 'Professional online code editor with AI assistance, 15+ programming languages including Solidity, Move, and Cairo for blockchain development.',
          images: [
            {
              url: 'https://coderipper.dev/og-image.jpg',
              width: 1200,
              height: 630,
              alt: 'CodeRipper - AI-Powered Code Editor',
            },
          ],
          siteName: 'CodeRipper',
        }}
        twitter={{
          handle: '@coderipper',
          site: '@coderipper',
          cardType: 'summary_large_image',
        }}
        additionalLinkTags={[
          {
            rel: 'icon',
            href: '/favicon.ico',
          },
          {
            rel: 'apple-touch-icon',
            href: '/apple-touch-icon.png',
            sizes: '180x180'
          },
          {
            rel: 'manifest',
            href: '/site.webmanifest'
          }
        ]}
        additionalMetaTags={[
          {
            name: 'viewport',
            content: 'width=device-width, initial-scale=1'
          },
          {
            name: 'keywords',
            content: 'online code editor, code compiler, AI coding assistant, programming, javascript, python, java, c++, go, rust, solidity, blockchain, collaborative coding, web3'
          },
          {
            name: 'author',
            content: 'CodeRipper Team'
          }
        ]}
      />
      
      <div className="min-h-screen bg-background">
        <EnterpriseHeader
          onSave={handleSave}
          onShare={handleShare}
          onRun={handleRun}
          onLoadSnippet={handleLoadSnippet}
        />
        
        {/* Top Ad Banner for free users */}
        {user && !user.isPremium && (
          <div className="container mx-auto px-4 py-2">
            <AdBanner placement="top" isPremium={user?.isPremium} />
          </div>
        )}
        
        <main className="container mx-auto px-4 py-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-violet-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent mb-2">
                  {currentSnippet ? currentSnippet.title : 'AI-Powered Code Editor'}
                </h1>
                <p className="text-muted-foreground text-sm md:text-base">
                  {currentSnippet 
                    ? currentSnippet.description || 'Edit your snippet'
                    : 'Write, compile, and optimize your code with intelligent AI assistance across 15+ programming languages.'}
                </p>
              </div>
              
              {/* Quick Stats */}
              {user && (
                <div className="hidden md:flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-muted border border-border">
                    <Zap className="w-4 h-4 text-violet-500 dark:text-violet-400" />
                    <span className="text-muted-foreground">
                      {user.isPremium ? '∞' : `${10 - user.executionsToday}`} runs left
                    </span>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-muted border border-border">
                    <Flame className="w-4 h-4 text-amber-500 dark:text-amber-400" />
                    <span className="text-muted-foreground">{user.streakDays} day streak</span>
                  </div>
                </div>
              )}
            </div>
          </motion.div>

          <Editor 
            language={language}
            onLanguageChange={setLanguage}
          />
          
          {/* Keyboard shortcuts hint */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-6 flex flex-wrap items-center justify-center gap-4 text-xs text-muted-foreground"
          >
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded bg-muted text-muted-foreground">Ctrl</kbd>
              <span>+</span>
              <kbd className="px-1.5 py-0.5 rounded bg-muted text-muted-foreground">Enter</kbd>
              <span className="ml-1">Run</span>
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded bg-muted text-muted-foreground">Ctrl</kbd>
              <span>+</span>
              <kbd className="px-1.5 py-0.5 rounded bg-muted text-muted-foreground">S</kbd>
              <span className="ml-1">Save</span>
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded bg-muted text-muted-foreground">Ctrl</kbd>
              <span>+</span>
              <kbd className="px-1.5 py-0.5 rounded bg-muted text-muted-foreground">Shift</kbd>
              <span>+</span>
              <kbd className="px-1.5 py-0.5 rounded bg-muted text-muted-foreground">S</kbd>
              <span className="ml-1">Share</span>
            </span>
          </motion.div>
        </main>
        
        {/* Footer with Developer Attribution */}
        <footer className="border-t border-border mt-12 bg-background/50 backdrop-blur-sm">
          <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              {/* Logo & Brand */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl overflow-hidden shadow-lg shadow-violet-500/20">
                  <Image src="/logo.png" alt="CodeRipper" width={40} height={40} className="object-cover" />
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-lg bg-gradient-to-r from-violet-500 to-purple-500 bg-clip-text text-transparent">
                    CodeRipper
                  </span>
                  <span className="text-xs text-muted-foreground">Next-Gen Code Compiler</span>
                </div>
              </div>

              {/* Developer Attribution */}
              <motion.a
                href="https://github.com/cybe4sent1nel"
                target="_blank"
                rel="noopener noreferrer" 
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-violet-500/10 to-purple-500/10 border border-violet-500/20 cursor-pointer"
                whileHover={{ scale: 1.02 }}
              >
                <span className="text-sm text-muted-foreground">Crafted with</span>
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1, repeat: Infinity, repeatDelay: 2 }}
                >
                  <Heart className="w-4 h-4 text-red-500 fill-red-500" />
                </motion.div>
                <span className="text-sm text-muted-foreground">by</span>
                <span className="font-bold text-foreground hover:text-violet-500 transition-colors flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  Fahad Khan
                </span>
              </motion.a>

              {/* Links & Social */}
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <motion.a
                    href="https://github.com/cybe4sent1nel"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg hover:bg-accent transition-colors"
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    title="GitHub"
                  >
                    <Github className="w-5 h-5" />
                  </motion.a>
                  <motion.a
                    href="https://www.linkedin.com/in/fahad-cybersecurity-ai/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg hover:bg-accent transition-colors"
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    title="LinkedIn"
                  >
                    <Linkedin className="w-5 h-5" />
                  </motion.a>
                </div>
                <div className="h-6 w-px bg-border hidden md:block" />
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <a href="#" className="hover:text-violet-500 transition-colors">Privacy</a>
                  <a href="#" className="hover:text-violet-500 transition-colors">Terms</a>
                  <a href="#" className="hover:text-violet-500 transition-colors">API</a>
                </div>
              </div>
            </div>
            
            {/* Copyright */}
            <div className="mt-6 pt-6 border-t border-border/50 text-center">
              <p className="text-xs text-muted-foreground">
                © {new Date().getFullYear()} CodeRipper. Built with Next.js, Monaco Editor & AI. All rights reserved.
              </p>
            </div>
          </div>
        </footer>
      </div>
      
      {/* Modals */}
      <SaveSnippetModal
        isOpen={showSaveModal}
        onClose={() => setShowSaveModal(false)}
        code={code}
        language={language}
      />
      
      <ShareSnippetModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        snippet={{
          id: currentSnippet?.id || 'temp-' + Date.now(),
          title: currentSnippet?.title || 'My Code',
          code: code,
          language: language,
        }}
      />
      
      <InterstitialAd
        isOpen={showInterstitial}
        onClose={() => setShowInterstitial(false)}
        isPremium={user?.isPremium}
      />
    </>
  )
}
