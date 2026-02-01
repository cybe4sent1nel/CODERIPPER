'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from 'next-themes';
import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import {
  Search,
  Gem,
  Save,
  Link2,
  Play,
  Loader2,
  Sun,
  Moon,
  ChevronDown,
  LayoutDashboard,
  FileCode,
  Star,
  Settings,
  LogOut,
  AlertTriangle,
  Crown,
  X,
  Code2,
  Trophy,
  User,
} from 'lucide-react';

import AuthModal from '@/components/AuthModal';
import UserDashboard from '@/components/UserDashboard';
import PricingModal from '@/components/PricingModal';
import SnippetExplorer from '@/components/SnippetExplorer';

interface EnterpriseHeaderProps {
  onShare?: () => void;
  onSave?: () => void;
  onRun?: () => void;
  onExplore?: () => void;
  isRunning?: boolean;
  onLoadSnippet?: (snippet: any) => void;
}

export default function EnterpriseHeader({
  onShare,
  onSave,
  onRun,
  onExplore,
  isRunning = false,
  onLoadSnippet,
}: EnterpriseHeaderProps) {
  const { theme, setTheme } = useTheme();
  const { user, isAuthenticated, logout } = useAuth();
  const [mounted, setMounted] = useState(false);
  
  // Modal states
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);
  const [showPricing, setShowPricing] = useState(false);
  const [showExplorer, setShowExplorer] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  useEffect(() => setMounted(true), []);

  const navLinks = [
    { label: 'Editor', href: '/', Icon: Code2 },
    { label: 'Arena', href: '/leaderboard', Icon: Trophy },
    { label: 'Explore', onClick: () => setShowExplorer(true), Icon: Search },
    { label: 'Pricing', onClick: () => setShowPricing(true), Icon: Gem },
  ];

  return (
    <>
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-xl"
      >
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-8">
              <motion.a
                href="/"
                className="flex items-center gap-3"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="relative">
                  <div className="w-10 h-10 rounded-xl overflow-hidden shadow-lg shadow-violet-500/25">
                    <Image 
                      src="/logo.png" 
                      alt="CodeRipper Logo" 
                      width={40} 
                      height={40}
                      className="object-cover w-full h-full"
                      priority
                    />
                  </div>
                  {user?.isPremium && (
                    <span className="absolute -top-1 -right-1 px-1.5 py-0.5 text-[10px] font-bold bg-gradient-to-r from-amber-400 to-orange-400 text-black rounded-full flex items-center gap-0.5">
                      <Crown className="w-2.5 h-2.5" />
                      PRO
                    </span>
                  )}
                </div>
                <div className="hidden sm:block">
                  <h1 className="text-xl font-bold bg-gradient-to-r from-violet-600 to-blue-600 dark:from-violet-400 dark:to-blue-400 bg-clip-text text-transparent">
                    CodeRipper
                  </h1>
                  <p className="text-[10px] text-muted-foreground -mt-0.5">Enterprise Code Compiler</p>
                </div>
              </motion.a>

              {/* Navigation */}
              <nav className="hidden md:flex items-center gap-1">
                {navLinks.map((link) => 
                  link.href ? (
                    <a
                      key={link.label}
                      href={link.href}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                    >
                      <link.Icon className="w-4 h-4" />
                      <span>{link.label}</span>
                    </a>
                  ) : (
                    <button
                      key={link.label}
                      onClick={link.onClick}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                    >
                      <link.Icon className="w-4 h-4" />
                      <span>{link.label}</span>
                    </button>
                  )
                )}
              </nav>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              {/* Quick Actions */}
              <div className="hidden sm:flex items-center gap-1 mr-2">
                {onSave && (
                  <button
                    onClick={onSave}
                    className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                    title="Save Snippet"
                  >
                    <Save className="w-4 h-4" />
                  </button>
                )}
                {onShare && (
                  <button
                    onClick={onShare}
                    className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                    title="Share"
                  >
                    <Link2 className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Theme Toggle */}
              {mounted && (
                <button
                  onClick={(e) => {
                    // Use the animated theme toggle if available
                    if (typeof window !== 'undefined' && (window as any).__animatedThemeToggle) {
                      (window as any).__animatedThemeToggle(e.nativeEvent)
                    } else {
                      setTheme(theme === 'dark' ? 'light' : 'dark')
                    }
                  }}
                  className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                  title="Toggle theme"
                >
                  {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                </button>
              )}

              {/* User Area */}
              {isAuthenticated && user ? (
                <div className="relative flex items-center gap-3">
                  {/* Glowing Profile Avatar - Links to Profile Page */}
                  <Link href="/profile" className="relative group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-violet-500 via-purple-500 to-blue-500 rounded-full blur opacity-60 group-hover:opacity-100 transition-all duration-300 animate-pulse" />
                    <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-white/20 shadow-lg">
                      {user.avatar ? (
                        <img 
                          src={user.avatar} 
                          alt={user.name} 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center text-white font-bold">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>
                    {user.isPremium && (
                      <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-gradient-to-r from-yellow-400 to-amber-500 flex items-center justify-center shadow-lg">
                        <Crown className="w-2.5 h-2.5 text-white" />
                      </div>
                    )}
                  </Link>
                  
                  {/* Menu Button */}
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-accent transition-colors"
                  >
                    <div className="hidden sm:block text-left">
                      <p className="text-sm font-medium text-foreground">{user.name}</p>
                      <p className="text-[10px] text-muted-foreground flex items-center gap-1">
                        @{user.username || user.name.toLowerCase().replace(/\s+/g, '')}
                        {user.isPremium && <Star className="w-2.5 h-2.5 text-amber-500" />}
                      </p>
                    </div>
                    <ChevronDown className="w-4 h-4 text-muted-foreground" />
                  </button>

                  {/* User Dropdown */}
                  <AnimatePresence>
                    {showUserMenu && (
                      <>
                        <div 
                          className="fixed inset-0 z-40" 
                          onClick={() => setShowUserMenu(false)}
                        />
                        <motion.div
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.95 }}
                          className="absolute right-0 top-full mt-2 w-56 rounded-xl bg-popover border border-border shadow-xl z-50 overflow-hidden"
                        >
                          <div className="p-3 border-b border-border">
                            <p className="font-medium text-foreground">{user.name}</p>
                            <p className="text-xs text-muted-foreground">@{user.username || user.name.toLowerCase().replace(/\s+/g, '')}</p>
                          </div>
                          <div className="p-1">
                            <Link
                              href="/profile"
                              onClick={() => setShowUserMenu(false)}
                              className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left text-foreground hover:bg-accent transition-colors"
                            >
                              <User className="w-4 h-4" /> View Profile
                            </Link>
                            <button
                              onClick={() => { setShowDashboard(true); setShowUserMenu(false); }}
                              className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left text-foreground hover:bg-accent transition-colors"
                            >
                              <LayoutDashboard className="w-4 h-4" /> Dashboard
                            </button>
                            <button
                              onClick={() => { setShowDashboard(true); setShowUserMenu(false); }}
                              className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left text-foreground hover:bg-accent transition-colors"
                            >
                              <FileCode className="w-4 h-4" /> My Snippets
                            </button>
                            <button
                              onClick={() => { setShowPricing(true); setShowUserMenu(false); }}
                              className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left text-foreground hover:bg-accent transition-colors"
                            >
                              <Star className="w-4 h-4" /> {user.isPremium ? 'Manage Subscription' : 'Upgrade to Pro'}
                            </button>
                            <button
                              onClick={() => { setShowDashboard(true); setShowUserMenu(false); }}
                              className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left text-foreground hover:bg-accent transition-colors"
                            >
                              <Settings className="w-4 h-4" /> Settings
                            </button>
                          </div>
                          <div className="p-1 border-t border-border">
                            <button
                              onClick={() => { logout(); setShowUserMenu(false); }}
                              className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left text-destructive hover:bg-destructive/10 transition-colors"
                            >
                              <LogOut className="w-4 h-4" /> Sign Out
                            </button>
                          </div>
                        </motion.div>
                      </>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowAuthModal(true)}
                    className="px-4 py-2 rounded-xl text-sm text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => setShowAuthModal(true)}
                    className="px-4 py-2 rounded-xl text-sm bg-gradient-to-r from-violet-600 to-blue-600 text-white font-medium hover:from-violet-500 hover:to-blue-500 transition-all shadow-lg shadow-violet-500/25"
                  >
                    Get Started
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Execution limit warning for free users */}
        {user && !user.isPremium && user.executionsToday >= 8 && (
          <div className="bg-amber-500/10 border-t border-amber-500/20 py-1.5">
            <div className="container mx-auto px-4 flex items-center justify-center gap-4 text-xs">
              <span className="text-amber-600 dark:text-amber-400 flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5" />
                {10 - user.executionsToday} code runs remaining today
              </span>
              <button
                onClick={() => setShowPricing(true)}
                className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-600 dark:text-amber-400 hover:bg-amber-500/30 transition-colors"
              >
                Upgrade for Unlimited
              </button>
            </div>
          </div>
        )}
      </motion.header>

      {/* Modals */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
      
      <UserDashboard
        isOpen={showDashboard}
        onClose={() => setShowDashboard(false)}
        onOpenPricing={() => { setShowDashboard(false); setShowPricing(true); }}
      />
      
      <PricingModal
        isOpen={showPricing}
        onClose={() => setShowPricing(false)}
      />
      
      <SnippetExplorer
        isOpen={showExplorer}
        onClose={() => setShowExplorer(false)}
        onLoadSnippet={onLoadSnippet}
      />
    </>
  );
}
