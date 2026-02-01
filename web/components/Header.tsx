import { useState } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { 
  SunIcon, 
  MoonIcon, 
  ShareIcon,
  PlayIcon,
  DocumentArrowDownIcon,
  Cog6ToothIcon,
  UserIcon,
  CreditCardIcon
} from '@heroicons/react/24/outline'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import { useTheme } from 'next-themes'
import { Button } from './ui/Button'
import { Badge } from './ui/Badge'

interface HeaderProps {
  onShare?: () => void
  onDownload?: () => void
  onRun?: () => void
  isRunning?: boolean
  hasProSubscription?: boolean
}

export default function Header({ 
  onShare, 
  onDownload, 
  onRun, 
  isRunning = false,
  hasProSubscription = false 
}: HeaderProps) {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // useEffect(() => setMounted(true), [])

  return (
    <motion.header 
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
    >
      <div className="container flex h-16 items-center justify-between">
        {/* Logo and Branding */}
        <div className="flex items-center gap-3">
          <motion.div 
            className="relative"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="w-10 h-10 rounded-xl flex items-center justify-center overflow-hidden shadow-lg">
              <Image 
                src="/logo.png" 
                alt="CodeRipper Logo" 
                width={40} 
                height={40}
                className="object-contain"
                priority
              />
            </div>
            {hasProSubscription && (
              <Badge 
                variant="default" 
                className="absolute -top-1 -right-1 px-1 py-0 text-xs premium-glow"
              >
                PRO
              </Badge>
            )}
          </motion.div>
          
          <div className="flex flex-col">
            <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              CodeRipper
            </h1>
            <p className="text-xs text-muted-foreground">
              Enterprise Code Compiler
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          {/* Run Button */}
          {onRun && (
            <Button
              onClick={onRun}
              disabled={isRunning}
              size="sm"
              className="shine"
            >
              <PlayIcon className="w-4 h-4 mr-2" />
              {isRunning ? (
                <span className="loading-dots">Running</span>
              ) : (
                'Run Code'
              )}
            </Button>
          )}

          {/* Share Button */}
          {onShare && (
            <Button variant="outline" size="sm" onClick={onShare}>
              <ShareIcon className="w-4 h-4 mr-2" />
              Share
            </Button>
          )}

          {/* Download Button */}
          {onDownload && (
            <Button variant="outline" size="sm" onClick={onDownload}>
              <DocumentArrowDownIcon className="w-4 h-4" />
            </Button>
          )}

          {/* Settings Dropdown */}
          <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
              <Button variant="ghost" size="icon">
                <Cog6ToothIcon className="w-5 h-5" />
              </Button>
            </DropdownMenu.Trigger>
            <DropdownMenu.Portal>
              <DropdownMenu.Content 
                className="glass rounded-lg p-2 shadow-lg border min-w-[200px]"
                sideOffset={5}
              >
                <DropdownMenu.Item className="flex items-center gap-2 p-2 rounded hover:bg-accent cursor-pointer">
                  <UserIcon className="w-4 h-4" />
                  Profile
                </DropdownMenu.Item>
                <DropdownMenu.Item className="flex items-center gap-2 p-2 rounded hover:bg-accent cursor-pointer">
                  <CreditCardIcon className="w-4 h-4" />
                  Upgrade to Pro
                  {!hasProSubscription && (
                    <Badge variant="secondary" className="ml-auto">
                      New
                    </Badge>
                  )}
                </DropdownMenu.Item>
                <DropdownMenu.Separator className="my-1 h-px bg-border" />
                <DropdownMenu.Item 
                  className="flex items-center gap-2 p-2 rounded hover:bg-accent cursor-pointer"
                  onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                >
                  {theme === 'dark' ? (
                    <>
                      <SunIcon className="w-4 h-4" />
                      Light Mode
                    </>
                  ) : (
                    <>
                      <MoonIcon className="w-4 h-4" />
                      Dark Mode
                    </>
                  )}
                </DropdownMenu.Item>
              </DropdownMenu.Content>
            </DropdownMenu.Portal>
          </DropdownMenu.Root>
        </div>
      </div>
    </motion.header>
  )
}