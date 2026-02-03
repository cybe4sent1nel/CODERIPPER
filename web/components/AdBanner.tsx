'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Rocket, Cloud, Zap, X, Check, Ban, Sparkles, Bot } from 'lucide-react';

interface AdBannerProps {
  placement: 'top' | 'sidebar' | 'inline' | 'footer';
  isPremium?: boolean;
  /** 
   * Indicates if the page has substantial publisher content.
   * Required by AdSense policy - ads should not be shown on:
   * - Pages without content or with low value content
   * - Pages under construction  
   * - Pages used for alerts, navigation or other behavioral purposes
   */
  hasSubstantialContent?: boolean;
}

export default function AdBanner({ placement, isPremium = false, hasSubstantialContent = true }: AdBannerProps) {
  // Don't show ads to premium users
  if (isPremium) return null;
  
  // AdSense Policy: Don't show ads on pages without substantial content
  if (!hasSubstantialContent) return null;

  const sizes = {
    top: 'h-[90px] w-full max-w-[728px]',
    sidebar: 'h-[250px] w-[300px]',
    inline: 'h-[60px] w-full max-w-[468px]',
    footer: 'h-[90px] w-full max-w-[728px]',
  };

  const placementStyles = {
    top: 'mx-auto mb-4',
    sidebar: 'fixed right-4 top-1/2 -translate-y-1/2 z-30 hidden xl:block',
    inline: 'mx-auto my-4',
    footer: 'mx-auto mt-4',
  };

  // Demo ad content - in production, this would be replaced with real ad code
  const demoAds = [
    {
      title: 'Learn to Code',
      description: 'Start your coding journey today',
      cta: 'Get Started',
      bg: 'from-violet-600 to-purple-600',
      Icon: Rocket,
    },
    {
      title: 'Cloud Hosting',
      description: 'Deploy your apps in seconds',
      cta: 'Try Free',
      bg: 'from-blue-600 to-cyan-600',
      Icon: Cloud,
    },
    {
      title: 'Go Pro',
      description: 'Remove ads & unlock all features',
      cta: 'Upgrade',
      bg: 'from-amber-500 to-orange-500',
      Icon: Zap,
    },
  ];

  const randomAd = demoAds[Math.floor(Math.random() * demoAds.length)];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`${sizes[placement]} ${placementStyles[placement]}`}
    >
      <div 
        className={`relative h-full w-full rounded-xl bg-gradient-to-r ${randomAd.bg} overflow-hidden group cursor-pointer`}
        onClick={() => console.log('Ad clicked')}
      >
        {/* Ad content */}
        <div className="absolute inset-0 p-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <randomAd.Icon className="w-8 h-8 text-white" />
            <div>
              <p className="font-bold text-white text-lg">{randomAd.title}</p>
              <p className="text-white/80 text-sm">{randomAd.description}</p>
            </div>
          </div>
          <button className="px-4 py-2 rounded-lg bg-white/20 backdrop-blur-sm text-white font-medium hover:bg-white/30 transition-colors">
            {randomAd.cta}
          </button>
        </div>

        {/* Ad label */}
        <div className="absolute top-1 right-1 px-1.5 py-0.5 rounded text-[10px] bg-black/30 text-white/70">
          Ad
        </div>

        {/* Shine effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
      </div>

      {/* Remove ads prompt */}
      <p className="text-center text-xs text-muted-foreground mt-1">
        <a href="#" className="hover:text-violet-500 dark:hover:text-violet-400 transition-colors">
          Upgrade to Pro to remove ads
        </a>
      </p>
    </motion.div>
  );
}

/**
 * REMOVED: InterstitialAd component
 * Reason: Violates AdSense policy - ads cannot be shown on screens used for 
 * navigation or other behavioral purposes (e.g., after code execution)
 * 
 * Alternative: Use inline upgrade prompts or banners on content-rich pages instead
 */
