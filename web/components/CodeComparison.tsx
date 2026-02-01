"use client";

import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark, oneLight } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import { useTheme } from 'next-themes';
import { 
  XMarkIcon, 
  CheckIcon, 
  ClipboardDocumentIcon,
  SparklesIcon,
  CodeBracketIcon,
  ArrowsRightLeftIcon
} from '@heroicons/react/24/outline';
import { LANGUAGES } from "@/lib/constants";
import toast from 'react-hot-toast';

interface CodeComparisonProps {
  originalCode: string;
  enhancedCode: string;
  language: string;
  isVisible: boolean;
  onClose: () => void;
  onApply?: (newCode: string) => void;
}

export const CodeComparison: React.FC<CodeComparisonProps> = ({
  originalCode,
  enhancedCode,
  language,
  isVisible,
  onClose,
  onApply,
}) => {
  const { theme } = useTheme();
  const [viewMode, setViewMode] = useState<'reveal' | 'side-by-side'>('reveal');
  const [sliderPos, setSliderPos] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const [copiedSide, setCopiedSide] = useState<'original' | 'enhanced' | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  if (!isVisible) return null;

  const languageConfig = LANGUAGES[language as keyof typeof LANGUAGES];
  const languageName = languageConfig?.name || language;
  const syntaxLanguage = language === 'cpp' ? 'cpp' : language === 'csharp' ? 'csharp' : language;

  const copyCode = async (code: string, side: 'original' | 'enhanced') => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedSide(side);
      toast.success('Code copied!');
      setTimeout(() => setCopiedSide(null), 2000);
    } catch {
      toast.error('Failed to copy');
    }
  };

  const handleApply = () => {
    if (onApply) {
      onApply(enhancedCode);
      toast.success('Enhanced code applied to editor!');
      onClose();
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current || !isDragging) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = (x / rect.width) * 100;
    setSliderPos(Math.min(Math.max(percentage, 5), 95));
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Calculate line differences
  const originalLines = originalCode.split('\n');
  const enhancedLines = enhancedCode.split('\n');

  const CodePanel = ({ code, label, isEnhanced }: { code: string; label: string; isEnhanced?: boolean }) => (
    <div className="w-full h-full flex flex-col">
      <div className={`px-4 py-3 border-b flex items-center justify-between flex-shrink-0 ${
        isEnhanced 
          ? 'bg-green-100 dark:bg-green-900/40 border-green-200 dark:border-green-800' 
          : 'bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700'
      }`}>
        <div className="flex items-center gap-2">
          {isEnhanced ? (
            <SparklesIcon className="w-4 h-4 text-green-600 dark:text-green-400" />
          ) : (
            <CodeBracketIcon className="w-4 h-4 text-gray-500" />
          )}
          <span className={`text-sm font-medium ${
            isEnhanced ? 'text-green-700 dark:text-green-300' : 'text-gray-700 dark:text-gray-300'
          }`}>{label}</span>
          {isEnhanced && (
            <span className="px-1.5 py-0.5 text-[10px] font-bold bg-green-200 dark:bg-green-800 text-green-700 dark:text-green-300 rounded">
              AI
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">
            {languageName}
          </span>
        </div>
      </div>
      <div className="flex-1 overflow-auto">
        <SyntaxHighlighter
          language={syntaxLanguage}
          style={theme === 'dark' ? oneDark : oneLight}
          showLineNumbers
          wrapLines
          lineNumberStyle={{ 
            minWidth: '3em', 
            paddingRight: '1em',
            color: theme === 'dark' ? '#6b7280' : '#9ca3af',
            userSelect: 'none'
          }}
          customStyle={{
            margin: 0,
            padding: '1rem',
            fontSize: '13px',
            lineHeight: '1.6',
            background: 'transparent',
            minHeight: '100%',
          }}
        >
          {code}
        </SyntaxHighlighter>
      </div>
    </div>
  );

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="w-full max-w-7xl h-[85vh] bg-white dark:bg-gray-900 rounded-2xl overflow-hidden shadow-2xl flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-violet-600 via-purple-600 to-blue-600 text-white px-6 py-4 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                <SparklesIcon className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold">AI Code Enhancement</h2>
                <p className="text-sm text-white/80">Review the AI-optimized version of your {languageName} code</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {/* View Mode Toggle */}
              <div className="flex bg-white/20 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('reveal')}
                  className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors flex items-center gap-1.5 ${
                    viewMode === 'reveal' ? 'bg-white text-purple-600' : 'text-white hover:bg-white/10'
                  }`}
                >
                  <ArrowsRightLeftIcon className="w-4 h-4" />
                  Reveal
                </button>
                <button
                  onClick={() => setViewMode('side-by-side')}
                  className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                    viewMode === 'side-by-side' ? 'bg-white text-purple-600' : 'text-white hover:bg-white/10'
                  }`}
                >
                  Side by Side
                </button>
              </div>
              <button
                onClick={onClose}
                className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-xl flex items-center justify-center transition-colors"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="bg-gray-100 dark:bg-gray-800 px-6 py-3 flex items-center justify-between border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
            <div className="flex items-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-gray-500 dark:text-gray-400">Original:</span>
                <span className="font-mono text-gray-700 dark:text-gray-300">{originalLines.length} lines</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-500 dark:text-gray-400">Enhanced:</span>
                <span className="font-mono text-green-600 dark:text-green-400">{enhancedLines.length} lines</span>
              </div>
              {viewMode === 'reveal' && (
                <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400">
                  <ArrowsRightLeftIcon className="w-4 h-4" />
                  <span className="text-xs font-medium">Drag slider to compare</span>
                </div>
              )}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => copyCode(originalCode, 'original')}
                className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-md transition-colors"
              >
                {copiedSide === 'original' ? <CheckIcon className="w-3.5 h-3.5 text-green-500" /> : <ClipboardDocumentIcon className="w-3.5 h-3.5" />}
                Copy Original
              </button>
              <button
                onClick={() => copyCode(enhancedCode, 'enhanced')}
                className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-green-700 dark:text-green-400 hover:text-green-900 dark:hover:text-green-200 bg-green-200 dark:bg-green-800 hover:bg-green-300 dark:hover:bg-green-700 rounded-md transition-colors"
              >
                {copiedSide === 'enhanced' ? <CheckIcon className="w-3.5 h-3.5" /> : <ClipboardDocumentIcon className="w-3.5 h-3.5" />}
                Copy Enhanced
              </button>
            </div>
          </div>

          {/* Code Comparison Area */}
          <div className="flex-1 overflow-hidden">
            {viewMode === 'reveal' ? (
              /* Reveal Slider Mode - Drag to move slider */
              <div
                ref={containerRef}
                className="relative w-full h-full"
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
              >
                {/* Original Code - Left Side (visible when slider is right) */}
                <div 
                  className="absolute top-0 left-0 h-full bg-white dark:bg-gray-900"
                  style={{ width: `${sliderPos}%` }}
                >
                  <div className="w-full h-full flex flex-col">
                    <div className="px-4 py-3 border-b flex items-center justify-between flex-shrink-0 bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                      <div className="flex items-center gap-2">
                        <CodeBracketIcon className="w-4 h-4 text-gray-500" />
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Original Code</span>
                      </div>
                      <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">
                        {languageName}
                      </span>
                    </div>
                    <div className="flex-1 overflow-auto">
                      <SyntaxHighlighter
                        language={syntaxLanguage}
                        style={theme === 'dark' ? oneDark : oneLight}
                        showLineNumbers
                        wrapLines
                        lineNumberStyle={{ 
                          minWidth: '3em', 
                          paddingRight: '1em',
                          color: theme === 'dark' ? '#6b7280' : '#9ca3af',
                          userSelect: 'none'
                        }}
                        customStyle={{
                          margin: 0,
                          padding: '1rem',
                          fontSize: '13px',
                          lineHeight: '1.6',
                          background: 'transparent',
                          minHeight: '100%',
                        }}
                      >
                        {originalCode}
                      </SyntaxHighlighter>
                    </div>
                  </div>
                </div>

                {/* Enhanced Code - Right Side (visible when slider is left) */}
                <div 
                  className="absolute top-0 right-0 h-full bg-white dark:bg-gray-900"
                  style={{ width: `${100 - sliderPos}%` }}
                >
                  <div className="w-full h-full flex flex-col">
                    <div className="px-4 py-3 border-b flex items-center justify-between flex-shrink-0 bg-green-100 dark:bg-green-900/40 border-green-200 dark:border-green-800">
                      <div className="flex items-center gap-2">
                        <SparklesIcon className="w-4 h-4 text-green-600 dark:text-green-400" />
                        <span className="text-sm font-medium text-green-700 dark:text-green-300">AI Enhanced Code</span>
                        <span className="px-1.5 py-0.5 text-[10px] font-bold bg-green-200 dark:bg-green-800 text-green-700 dark:text-green-300 rounded">
                          AI
                        </span>
                      </div>
                      <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">
                        {languageName}
                      </span>
                    </div>
                    <div className="flex-1 overflow-auto">
                      <SyntaxHighlighter
                        language={syntaxLanguage}
                        style={theme === 'dark' ? oneDark : oneLight}
                        showLineNumbers
                        wrapLines
                        lineNumberStyle={{ 
                          minWidth: '3em', 
                          paddingRight: '1em',
                          color: theme === 'dark' ? '#6b7280' : '#9ca3af',
                          userSelect: 'none'
                        }}
                        customStyle={{
                          margin: 0,
                          padding: '1rem',
                          fontSize: '13px',
                          lineHeight: '1.6',
                          background: 'transparent',
                          minHeight: '100%',
                        }}
                      >
                        {enhancedCode}
                      </SyntaxHighlighter>
                    </div>
                  </div>
                </div>

                {/* Draggable Slider Handle */}
                <div
                  className="absolute top-0 bottom-0 w-2 bg-gradient-to-b from-purple-500 via-violet-500 to-blue-500 shadow-2xl z-30 cursor-col-resize hover:w-3 transition-all"
                  style={{
                    left: `${sliderPos}%`,
                    transform: 'translateX(-50%)',
                  }}
                  onMouseDown={handleMouseDown}
                >
                  {/* Slider Knob */}
                  <div className="absolute top-1/2 left-1/2 w-12 h-12 bg-white dark:bg-gray-800 rounded-full shadow-xl transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center border-2 border-purple-500 cursor-col-resize hover:scale-110 transition-transform">
                    <ArrowsRightLeftIcon className="w-6 h-6 text-purple-500" />
                  </div>
                  
                  {/* Labels */}
                  <div className="absolute top-4 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-1 pointer-events-none">
                    <div className="flex items-center gap-12 text-xs font-medium whitespace-nowrap">
                      <span className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded-full shadow">
                        ← Original
                      </span>
                      <span className="bg-green-200 dark:bg-green-800 text-green-700 dark:text-green-300 px-2 py-1 rounded-full shadow">
                        Enhanced →
                      </span>
                    </div>
                  </div>
                  
                  {/* Drag hint at bottom */}
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 pointer-events-none">
                    <span className="bg-purple-600 text-white px-3 py-1.5 rounded-full text-xs font-medium shadow-lg whitespace-nowrap">
                      ⟷ Drag to compare
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              /* Side by Side Mode */
              <div className="grid grid-cols-2 h-full divide-x divide-gray-200 dark:divide-gray-700">
                <div className="h-full overflow-hidden bg-white dark:bg-gray-900">
                  <CodePanel code={originalCode} label="Original Code" />
                </div>
                <div className="h-full overflow-hidden bg-green-50/30 dark:bg-green-900/5">
                  <CodePanel code={enhancedCode} label="AI Enhanced Code" isEnhanced />
                </div>
              </div>
            )}
          </div>

          {/* Footer with Actions */}
          <div className="bg-gray-100 dark:bg-gray-800 px-6 py-4 flex items-center justify-between border-t border-gray-200 dark:border-gray-700 flex-shrink-0">
            <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2">
              <SparklesIcon className="w-4 h-4" />
              AI-optimized for better performance and readability
            </p>
            <div className="flex items-center gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-lg transition-colors"
              >
                Cancel
              </button>
              {onApply && (
                <button
                  onClick={handleApply}
                  className="px-6 py-2 text-sm font-medium text-white bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 rounded-lg transition-all shadow-lg shadow-green-500/25 flex items-center gap-2"
                >
                  <CheckIcon className="w-4 h-4" />
                  Apply Enhanced Code
                </button>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};