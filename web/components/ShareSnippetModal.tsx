'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SOCIAL_SHARE_OPTIONS, EXPORT_FORMATS } from '@/lib/enterprise-config';
import { X, Link2, Code, Package, Share2, Check, QrCode, Zap, Smartphone, Crown } from 'lucide-react';
import { getAppUrl } from '@/lib/utils';

interface ShareSnippetModalProps {
  isOpen: boolean;
  onClose: () => void;
  snippet: {
    id: string;
    title: string;
    code: string;
    language: string;
  };
}

export default function ShareSnippetModal({ isOpen, onClose, snippet }: ShareSnippetModalProps) {
  const [activeTab, setActiveTab] = useState<'link' | 'embed' | 'export' | 'social'>('link');
  const [copied, setCopied] = useState<string | null>(null);
  
  const shareUrl = `${getAppUrl()}/snippet/${snippet.id}`;
  
  const embedCode = `<iframe src="${shareUrl}/embed" width="100%" height="400" frameborder="0" allow="clipboard-write" loading="lazy"></iframe>`;
  
  const reactEmbed = `import { CodeRipperEmbed } from '@coderipper/react';

<CodeRipperEmbed 
  snippetId="${snippet.id}"
  theme="dark"
  height={400}
/>`;

  const copyToClipboard = async (text: string, type: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleSocialShare = (platform: string) => {
    const text = `Check out my code snippet: "${snippet.title}"`;
    const url = encodeURIComponent(shareUrl);
    
    const shareUrls: Record<string, string> = {
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${url}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
      reddit: `https://reddit.com/submit?url=${url}&title=${encodeURIComponent(snippet.title)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
      hackernews: `https://news.ycombinator.com/submitlink?u=${url}&t=${encodeURIComponent(snippet.title)}`,
    };
    
    if (shareUrls[platform]) {
      window.open(shareUrls[platform], '_blank', 'width=600,height=400');
    }
  };

  const handleExport = async (format: string) => {
    switch (format) {
      case 'file': {
        const extensions: Record<string, string> = {
          javascript: 'js', typescript: 'ts', python: 'py', java: 'java',
          cpp: 'cpp', go: 'go', rust: 'rs', kotlin: 'kt', solidity: 'sol',
          move: 'move', cairo: 'cairo', vyper: 'vy',
        };
        const ext = extensions[snippet.language] || 'txt';
        const blob = new Blob([snippet.code], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${snippet.title.replace(/\s+/g, '_')}.${ext}`;
        a.click();
        URL.revokeObjectURL(url);
        break;
      }
      case 'markdown': {
        const md = `# ${snippet.title}\n\n\`\`\`${snippet.language}\n${snippet.code}\n\`\`\``;
        const blob = new Blob([md], { type: 'text/markdown' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${snippet.title.replace(/\s+/g, '_')}.md`;
        a.click();
        URL.revokeObjectURL(url);
        break;
      }
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
        
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: 'spring', duration: 0.5 }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-xl overflow-hidden rounded-2xl bg-card border border-border shadow-2xl"
        >
          {/* Decorative elements */}
          <div className="absolute -top-20 -right-20 w-40 h-40 bg-blue-500/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-cyan-500/20 rounded-full blur-3xl" />

          <div className="relative p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                  <Link2 className="w-6 h-6 text-blue-500" /> Share Snippet
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Share "{snippet.title}" with the world
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 p-1 mb-6 bg-muted rounded-xl">
              {[
                { id: 'link', label: 'Link', Icon: Link2 },
                { id: 'embed', label: 'Embed', Icon: Code },
                { id: 'export', label: 'Export', Icon: Package },
                { id: 'social', label: 'Social', Icon: Share2 },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-1 ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <tab.Icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              ))}
            </div>

            {/* Content */}
            <div className="space-y-4">
              {activeTab === 'link' && (
                <div className="space-y-4">
                  {/* Direct Link */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Direct Link
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={shareUrl}
                        readOnly
                        className="flex-1 px-4 py-3 rounded-xl bg-muted border border-border text-foreground font-mono text-sm"
                      />
                      <button
                        onClick={() => copyToClipboard(shareUrl, 'link')}
                        className={`px-4 py-3 rounded-xl font-medium transition-all flex items-center gap-2 ${
                          copied === 'link'
                            ? 'bg-emerald-600 text-white'
                            : 'bg-blue-600 text-white hover:bg-blue-500'
                        }`}
                      >
                        {copied === 'link' ? <><Check className="w-4 h-4" /> Copied</> : 'Copy'}
                      </button>
                    </div>
                  </div>

                  {/* QR Code */}
                  <div className="p-4 rounded-xl bg-muted/50 border border-border">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-medium text-foreground">QR Code</span>
                      <span className="px-2 py-1 rounded text-xs bg-violet-500/20 text-violet-600 dark:text-violet-400 flex items-center gap-1">
                        <Crown className="w-3 h-3" /> Pro Feature
                      </span>
                    </div>
                    <div className="flex items-center justify-center h-32 rounded-lg bg-muted/50 border-2 border-dashed border-border">
                      <div className="text-center text-muted-foreground">
                        <Smartphone className="w-8 h-8 mx-auto mb-2" />
                        <p className="text-sm">Upgrade to Pro for QR codes</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'embed' && (
                <div className="space-y-4">
                  {/* HTML Embed */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      HTML Embed
                    </label>
                    <div className="relative">
                      <pre className="p-4 rounded-xl bg-muted border border-border text-foreground font-mono text-sm overflow-x-auto">
                        {embedCode}
                      </pre>
                      <button
                        onClick={() => copyToClipboard(embedCode, 'embed')}
                        className={`absolute top-2 right-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                          copied === 'embed'
                            ? 'bg-emerald-600 text-white'
                            : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                        }`}
                      >
                        {copied === 'embed' ? <Check className="w-4 h-4" /> : 'Copy'}
                      </button>
                    </div>
                  </div>

                  {/* React Embed */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      React Component
                    </label>
                    <div className="relative">
                      <pre className="p-4 rounded-xl bg-muted border border-border text-foreground font-mono text-sm overflow-x-auto whitespace-pre-wrap">
                        {reactEmbed}
                      </pre>
                      <button
                        onClick={() => copyToClipboard(reactEmbed, 'react')}
                        className={`absolute top-2 right-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                          copied === 'react'
                            ? 'bg-emerald-600 text-white'
                            : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                        }`}
                      >
                        {copied === 'react' ? <Check className="w-4 h-4" /> : 'Copy'}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'export' && (
                <div className="grid grid-cols-2 gap-3">
                  {EXPORT_FORMATS.map((format) => (
                    <button
                      key={format.id}
                      onClick={() => handleExport(format.id)}
                      disabled={format.tier !== 'free'}
                      className={`p-4 rounded-xl border text-left transition-all ${
                        format.tier === 'free'
                          ? 'bg-muted/50 border-border hover:border-blue-500 hover:bg-muted'
                          : 'bg-muted/30 border-border/50 opacity-60'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <span className="text-2xl">{format.icon}</span>
                        {format.tier !== 'free' && (
                          <span className="px-2 py-0.5 rounded text-xs bg-violet-500/20 text-violet-600 dark:text-violet-400 capitalize flex items-center gap-1">
                            <Crown className="w-3 h-3" /> {format.tier}
                          </span>
                        )}
                      </div>
                      <p className="mt-2 font-medium text-foreground">{format.name}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{format.description}</p>
                    </button>
                  ))}
                </div>
              )}

              {activeTab === 'social' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-3">
                    {SOCIAL_SHARE_OPTIONS.map((platform) => (
                      <button
                        key={platform.id}
                        onClick={() => handleSocialShare(platform.id)}
                        className="p-4 rounded-xl bg-muted/50 border border-border hover:border-muted-foreground/50 transition-all flex flex-col items-center gap-2"
                        style={{ 
                          ['--hover-color' as any]: platform.color,
                        }}
                      >
                        <span className="text-2xl">{platform.icon}</span>
                        <span className="text-sm text-foreground">{platform.name}</span>
                      </button>
                    ))}
                  </div>
                  
                  {/* Preview Card */}
                  <div className="p-4 rounded-xl bg-muted/30 border border-border">
                    <p className="text-xs text-muted-foreground mb-2">Preview</p>
                    <div className="p-4 rounded-lg bg-white dark:bg-slate-100">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center flex-shrink-0">
                          <Zap className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{snippet.title}</p>
                          <p className="text-sm text-gray-600">CodeRipper - Online Code Compiler</p>
                          <p className="text-xs text-blue-600 mt-1">{shareUrl}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
