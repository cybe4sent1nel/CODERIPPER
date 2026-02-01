'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Rocket, Cloud, Zap, X, Check, Ban, Sparkles, Bot } from 'lucide-react';

interface AdBannerProps {
  placement: 'top' | 'sidebar' | 'inline' | 'footer';
  isPremium?: boolean;
}

export default function AdBanner({ placement, isPremium = false }: AdBannerProps) {
  // Don't show ads to premium users
  if (isPremium) return null;

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

// Interstitial Ad Component
export function InterstitialAd({ 
  isOpen, 
  onClose, 
  isPremium = false 
}: { 
  isOpen: boolean; 
  onClose: () => void;
  isPremium?: boolean;
}) {
  const [countdown, setCountdown] = React.useState(5);

  React.useEffect(() => {
    if (!isOpen || isPremium) return;
    
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen, isPremium]);

  React.useEffect(() => {
    if (!isOpen) {
      setCountdown(5);
    }
  }, [isOpen]);

  if (!isOpen || isPremium) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
    >
      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        className="relative w-full max-w-lg rounded-2xl bg-card border border-border overflow-hidden"
      >
        {/* Close button / countdown */}
        <div className="absolute top-4 right-4 z-10">
          {countdown > 0 ? (
            <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-foreground font-bold">
              {countdown}
            </div>
          ) : (
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-foreground hover:bg-muted/80 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Ad content */}
        <div className="p-8 text-center">
          <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center mb-6">
            <Zap className="w-10 h-10 text-white" />
          </div>
          
          <h2 className="text-2xl font-bold text-foreground mb-2">
            Unlock Your Full Potential
          </h2>
          <p className="text-muted-foreground mb-6">
            Upgrade to CodeRipper Pro for unlimited executions, no ads, and premium AI features.
          </p>

          <div className="space-y-3">
            <button className="w-full py-3 px-6 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 text-white font-semibold hover:from-violet-500 hover:to-blue-500 transition-all shadow-lg">
              Upgrade to Pro - $9.99/mo
            </button>
            <button 
              onClick={countdown === 0 ? onClose : undefined}
              className={`w-full py-3 px-6 rounded-xl border border-border text-muted-foreground ${
                countdown === 0 ? 'hover:bg-muted cursor-pointer' : 'opacity-50 cursor-not-allowed'
              } transition-all`}
            >
              {countdown > 0 ? `Skip in ${countdown}s` : 'Continue with Free'}
            </button>
          </div>

          {/* Features preview */}
          <div className="mt-6 pt-6 border-t border-border">
            <div className="flex justify-center gap-6 text-sm text-muted-foreground">
              <span className="flex items-center gap-1"><Ban className="w-4 h-4" /> No Ads</span>
              <span className="flex items-center gap-1"><Sparkles className="w-4 h-4" /> Unlimited Runs</span>
              <span className="flex items-center gap-1"><Bot className="w-4 h-4" /> AI Assistant</span>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
