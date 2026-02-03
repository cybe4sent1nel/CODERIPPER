'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Square3Stack3DIcon,
  SparklesIcon,
  XMarkIcon,
  ArrowPathIcon,
  CodeBracketIcon,
  SwatchIcon
} from '@heroicons/react/24/outline';
import { Button } from './ui/Button';
import toast from 'react-hot-toast';
import axios from 'axios';

interface FigmaToCodeProps {
  onCodeGenerated: (code: string, language: string) => void;
}

export default function FigmaToCode({ onCodeGenerated }: FigmaToCodeProps) {
  const [showModal, setShowModal] = useState(false);
  const [figmaUrl, setFigmaUrl] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [framework, setFramework] = useState<'html' | 'react' | 'vue'>('react');

  const handleConvert = async () => {
    if (!figmaUrl.trim()) {
      toast.error('Please enter a Figma URL');
      return;
    }

    // Validate Figma URL
    if (!figmaUrl.includes('figma.com')) {
      toast.error('Please enter a valid Figma URL');
      return;
    }

    setIsProcessing(true);

    try {
      const response = await axios.post('/api/figma-to-code', {
        url: figmaUrl,
        framework
      });

      const { code, language } = response.data;
      onCodeGenerated(code, language);
      
      toast.success('✨ Design converted to code successfully!');
      setShowModal(false);
      setFigmaUrl('');
    } catch (error: any) {
      console.error('Error converting Figma design:', error);
      toast.error(error.response?.data?.error || 'Failed to convert design. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <>
      {/* Trigger Button */}
      <Button
        onClick={() => setShowModal(true)}
        variant="outline"
        size="sm"
        className="group relative overflow-hidden"
      >
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20"
          initial={{ x: '-100%' }}
          whileHover={{ x: '100%' }}
          transition={{ duration: 0.5 }}
        />
        <Square3Stack3DIcon className="w-4 h-4 mr-2" />
        Figma to Code
        <SparklesIcon className="w-4 h-4 ml-2 group-hover:rotate-12 transition-transform" />
      </Button>

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-2xl bg-background rounded-2xl shadow-2xl border border-border overflow-hidden"
            >
              {/* Header */}
              <div className="px-6 py-4 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-b border-border">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center">
                      <Square3Stack3DIcon className="w-6 h-6 text-purple-500" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold">Figma to Code</h3>
                      <p className="text-sm text-muted-foreground">
                        Convert your Figma designs to production-ready code
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowModal(false)}
                    className="p-2 rounded-lg hover:bg-muted transition-colors"
                  >
                    <XMarkIcon className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 space-y-6">
                {/* Figma URL Input */}
                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <SwatchIcon className="w-4 h-4" />
                    Figma File or Frame URL
                  </label>
                  <input
                    type="url"
                    value={figmaUrl}
                    onChange={(e) => setFigmaUrl(e.target.value)}
                    placeholder="https://www.figma.com/file/..."
                    className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:ring-2 focus:ring-purple-500/50 outline-none transition-all"
                  />
                  <p className="text-xs text-muted-foreground">
                    Paste the link to your Figma file or specific frame
                  </p>
                </div>

                {/* Framework Selection */}
                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <CodeBracketIcon className="w-4 h-4" />
                    Output Framework
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {(['html', 'react', 'vue'] as const).map((fw) => (
                      <button
                        key={fw}
                        onClick={() => setFramework(fw)}
                        className={`p-4 rounded-lg border-2 transition-all ${
                          framework === fw
                            ? 'border-purple-500 bg-purple-500/10'
                            : 'border-border hover:border-purple-500/50'
                        }`}
                      >
                        <div className="text-center">
                          <div className="text-2xl mb-1">
                            {fw === 'html' && '🌐'}
                            {fw === 'react' && '⚛️'}
                            {fw === 'vue' && '💚'}
                          </div>
                          <p className="text-sm font-medium capitalize">{fw}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Features Info */}
                <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
                  <p className="text-sm font-semibold text-blue-500 mb-2">✨ What you'll get:</p>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    <li>• Pixel-perfect responsive layouts</li>
                    <li>• Clean, production-ready code</li>
                    <li>• CSS with modern practices (Flexbox, Grid)</li>
                    <li>• Component-based structure (for React/Vue)</li>
                    <li>• Accessibility features included</li>
                  </ul>
                </div>

                {/* Instructions */}
                <div className="p-4 rounded-lg bg-muted/50">
                  <p className="text-xs font-semibold mb-2">📝 How to get your Figma link:</p>
                  <ol className="text-xs text-muted-foreground space-y-1 list-decimal list-inside">
                    <li>Open your design in Figma</li>
                    <li>Select the frame or file you want to convert</li>
                    <li>Click "Share" and copy the link</li>
                    <li>Make sure link sharing is enabled</li>
                    <li>Paste the link above</li>
                  </ol>
                </div>
              </div>

              {/* Footer Actions */}
              <div className="px-6 py-4 bg-muted/30 border-t border-border flex items-center justify-between">
                <p className="text-xs text-muted-foreground">
                  Powered by AI • Supports Figma files and frames
                </p>

                <div className="flex gap-2">
                  <Button
                    onClick={() => setShowModal(false)}
                    variant="outline"
                  >
                    Cancel
                  </Button>

                  <Button
                    onClick={handleConvert}
                    disabled={!figmaUrl.trim() || isProcessing}
                    className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                  >
                    {isProcessing ? (
                      <>
                        <motion.div
                          className="w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                        />
                        Converting...
                      </>
                    ) : (
                      <>
                        <SparklesIcon className="w-4 h-4 mr-2" />
                        Convert to Code
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
