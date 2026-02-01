import { twMerge } from "tailwind-merge"
import { type ClassValue, clsx } from "clsx"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Production URL for CodeRipper
export const PRODUCTION_URL = 'https://coderipper.vercel.app';

/**
 * Get the app URL based on environment
 * Returns localhost in development, production URL otherwise
 */
export function getAppUrl(): string {
  // Check for explicit environment variable first
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL;
  }
  
  // In browser, check if we're on localhost
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      return `${window.location.protocol}//${window.location.host}`;
    }
    // Return current origin if not localhost (handles Vercel preview deployments too)
    return window.location.origin;
  }
  
  // Server-side: use production URL as default
  return PRODUCTION_URL;
}

export function generateShareableUrl(code: string, language: string): string {
  const encoded = btoa(JSON.stringify({ code, language, timestamp: Date.now() }))
  return `${window.location.origin}/share/${encoded}`
}

export function downloadCode(code: string, language: string, filename?: string) {
  const extension = getFileExtension(language)
  const name = filename || `code-${Date.now()}`
  const blob = new Blob([code], { type: 'text/plain' })
  const url = URL.createObjectURL(blob)
  
  const a = document.createElement('a')
  a.href = url
  a.download = `${name}.${extension}`
  a.click()
  
  URL.revokeObjectURL(url)
}

export function getFileExtension(language: string): string {
  const extensions: Record<string, string> = {
    javascript: 'js',
    typescript: 'ts',
    python: 'py',
    java: 'java',
    cpp: 'cpp',
    go: 'go',
    rust: 'rs',
    html: 'html',
    css: 'css'
  }
  return extensions[language] || 'txt'
}

export function formatFileSize(bytes: number): string {
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  if (bytes === 0) return '0 Byte'
  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i]
}

export function copyToClipboard(text: string): Promise<void> {
  return navigator.clipboard.writeText(text)
}

export function generateCodeId(): string {
  return Math.random().toString(36).substr(2, 9)
}