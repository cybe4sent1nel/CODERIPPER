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
        // Fallback: Create rapid emerge/converge animation with rays
        const container = document.createElement('div')
        container.style.cssText = `
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          pointer-events: none;
          z-index: 99999;
          overflow: hidden;
        `
        
        // Create radiating rays effect
        const rayCount = 12
        const rayColor = newTheme === 'dark' ? '#6366f1' : '#fbbf24'
        
        for (let i = 0; i < rayCount; i++) {
          const ray = document.createElement('div')
          const angle = (i / rayCount) * 360
          ray.style.cssText = `
            position: absolute;
            left: ${x}px;
            top: ${y}px;
            width: 4px;
            height: 0;
            background: linear-gradient(to bottom, ${rayColor}, transparent);
            transform-origin: top center;
            transform: rotate(${angle}deg);
            opacity: 1;
            transition: height 0.2s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.15s ease;
          `
          container.appendChild(ray)
        }
        
        // Flash overlay
        const flash = document.createElement('div')
        flash.style.cssText = `
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: ${newTheme === 'dark' ? 'rgba(99, 102, 241, 0.3)' : 'rgba(251, 191, 36, 0.3)'};
          opacity: 0;
          transition: opacity 0.15s ease-out;
        `
        container.appendChild(flash)
        
        document.body.appendChild(container)
        
        // Animate rays shooting out
        requestAnimationFrame(() => {
          const rays = container.querySelectorAll('div:not(:last-child)')
          rays.forEach((ray: Element) => {
            ;(ray as HTMLElement).style.height = `${maxRadius}px`
          })
          flash.style.opacity = '1'
        })
        
        // Flash and change theme
        setTimeout(() => {
          flash.style.opacity = '0'
          setTheme(newTheme)
          
          // Converge rays back
          const rays = container.querySelectorAll('div:not(:last-child)')
          rays.forEach((ray: Element) => {
            ;(ray as HTMLElement).style.height = '0'
            ;(ray as HTMLElement).style.opacity = '0'
          })
        }, 150)
        
        // Remove container
        setTimeout(() => {
          container.remove()
        }, 350)
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
