import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { ThemeProvider, useTheme } from 'next-themes'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from '@/contexts/AuthContext'
import { SnippetProvider } from '@/contexts/SnippetContext'
import { useEffect, useState, useCallback } from 'react'

// Theme transition animation component
function ThemeTransition() {
  const { theme, setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Expose the animated theme toggle function globally
  useEffect(() => {
    if (!mounted) return

    const animatedToggle = (event?: MouseEvent) => {
      const isDark = resolvedTheme === 'dark'
      const newTheme = isDark ? 'light' : 'dark'
      
      // Get click position or use center of screen
      const x = event?.clientX ?? window.innerWidth / 2
      const y = event?.clientY ?? window.innerHeight / 2
      
      // Calculate the maximum radius needed to cover the entire screen
      const maxRadius = Math.hypot(
        Math.max(x, window.innerWidth - x),
        Math.max(y, window.innerHeight - y)
      )

      // Check if View Transitions API is supported
      if ((document as any).startViewTransition) {
        (document as any).startViewTransition(() => {
          setTheme(newTheme)
        })
      } else {
        // Fallback: Create a spreading circle animation
        const overlay = document.createElement('div')
        overlay.style.cssText = `
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          pointer-events: none;
          z-index: 99999;
          background: ${newTheme === 'dark' ? '#0a0a1a' : '#ffffff'};
          clip-path: circle(0px at ${x}px ${y}px);
          transition: clip-path 0.5s ease-out;
        `
        document.body.appendChild(overlay)

        // Trigger the animation
        requestAnimationFrame(() => {
          overlay.style.clipPath = `circle(${maxRadius}px at ${x}px ${y}px)`
        })

        // Change theme midway through animation
        setTimeout(() => {
          setTheme(newTheme)
        }, 250)

        // Remove overlay after animation
        setTimeout(() => {
          overlay.remove()
        }, 500)
      }
    }

    // Make it available globally for the theme toggle button
    ;(window as any).__animatedThemeToggle = animatedToggle
  }, [mounted, resolvedTheme, setTheme])

  return null
}

function ThemedToaster() {
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const isDark = resolvedTheme === 'dark'

  return (
    <Toaster
      position="bottom-right"
      toastOptions={{
        duration: 4000,
        className: '',
        style: {
          background: isDark ? 'hsl(222.2 84% 4.9%)' : 'hsl(0 0% 100%)',
          color: isDark ? 'hsl(210 40% 98%)' : 'hsl(222.2 84% 4.9%)',
          border: `1px solid ${isDark ? 'hsl(217.2 32.6% 17.5%)' : 'hsl(214.3 31.8% 91.4%)'}`,
          borderRadius: '12px',
        },
        success: {
          iconTheme: {
            primary: '#10b981',
            secondary: isDark ? 'hsl(210 40% 98%)' : 'hsl(0 0% 100%)',
          },
        },
        error: {
          iconTheme: {
            primary: '#ef4444',
            secondary: isDark ? 'hsl(210 40% 98%)' : 'hsl(0 0% 100%)',
          },
        },
      }}
    />
  )
}

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem={false}
    >
      <AuthProvider>
        <SnippetProvider>
          <ThemeTransition />
          <Component {...pageProps} />
          <ThemedToaster />
        </SnippetProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default MyApp
