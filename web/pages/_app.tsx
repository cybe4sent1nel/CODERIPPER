import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { ThemeProvider, useTheme } from 'next-themes'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from '@/contexts/AuthContext'
import { SnippetProvider } from '@/contexts/SnippetContext'
import { useEffect, useState } from 'react'

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
      defaultTheme="dark"
      enableSystem
      disableTransitionOnChange
    >
      <AuthProvider>
        <SnippetProvider>
          <Component {...pageProps} />
          <ThemedToaster />
        </SnippetProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default MyApp
