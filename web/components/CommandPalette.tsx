'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MagnifyingGlassIcon,
  CommandLineIcon,
  CogIcon,
  DocumentDuplicateIcon,
  ArrowDownTrayIcon,
  ShareIcon,
  SparklesIcon,
  CodeBracketIcon,
  PlayIcon,
  DocumentTextIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { type LanguageKey } from '@/lib/constants';

interface Command {
  id: string;
  label: string;
  category: string;
  keywords: string[];
  icon: React.ReactNode;
  action: () => void;
  shortcut?: string;
}

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onRunCode: () => void;
  onExplainCode: () => void;
  onOptimizeCode: () => void;
  onFormatCode: () => void;
  onDownloadCode: () => void;
  onShareCode: () => void;
  onChangeLanguage: (lang: LanguageKey) => void;
  availableLanguages: Array<{ key: LanguageKey; name: string }>;
}

export default function CommandPalette({
  isOpen,
  onClose,
  onRunCode,
  onExplainCode,
  onOptimizeCode,
  onFormatCode,
  onDownloadCode,
  onShareCode,
  onChangeLanguage,
  availableLanguages
}: CommandPaletteProps) {
  const [search, setSearch] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);

  const commands: Command[] = useMemo(() => [
    {
      id: 'run',
      label: 'Run Code',
      category: 'Execution',
      keywords: ['execute', 'compile', 'run', 'start'],
      icon: <PlayIcon className="w-5 h-5" />,
      action: onRunCode,
      shortcut: 'Ctrl+Enter'
    },
    {
      id: 'explain',
      label: 'Explain Code with AI',
      category: 'AI',
      keywords: ['ai', 'explain', 'understand', 'help'],
      icon: <SparklesIcon className="w-5 h-5" />,
      action: onExplainCode,
      shortcut: 'Ctrl+E'
    },
    {
      id: 'optimize',
      label: 'Optimize Code with AI',
      category: 'AI',
      keywords: ['ai', 'optimize', 'improve', 'enhance'],
      icon: <CodeBracketIcon className="w-5 h-5" />,
      action: onOptimizeCode,
      shortcut: 'Ctrl+O'
    },
    {
      id: 'format',
      label: 'Format Code',
      category: 'Editing',
      keywords: ['format', 'beautify', 'clean', 'prettier'],
      icon: <DocumentTextIcon className="w-5 h-5" />,
      action: onFormatCode,
      shortcut: 'Shift+Alt+F'
    },
    {
      id: 'download',
      label: 'Download Code',
      category: 'File',
      keywords: ['download', 'save', 'export'],
      icon: <ArrowDownTrayIcon className="w-5 h-5" />,
      action: onDownloadCode,
      shortcut: 'Ctrl+S'
    },
    {
      id: 'share',
      label: 'Share Code',
      category: 'Collaboration',
      keywords: ['share', 'link', 'collaborate'],
      icon: <ShareIcon className="w-5 h-5" />,
      action: onShareCode,
      shortcut: 'Ctrl+Shift+S'
    },
    {
      id: 'copy',
      label: 'Copy All Code',
      category: 'Editing',
      keywords: ['copy', 'clipboard'],
      icon: <DocumentDuplicateIcon className="w-5 h-5" />,
      action: () => {},
      shortcut: 'Ctrl+C'
    },
    ...availableLanguages.map(lang => ({
      id: `lang-${lang.key}`,
      label: `Switch to ${lang.name}`,
      category: 'Language',
      keywords: ['language', 'switch', lang.name.toLowerCase()],
      icon: <CommandLineIcon className="w-5 h-5" />,
      action: () => {
        onChangeLanguage(lang.key);
        onClose();
      }
    }))
  ], [availableLanguages, onRunCode, onExplainCode, onOptimizeCode, onFormatCode, onDownloadCode, onShareCode, onChangeLanguage, onClose]);

  const filteredCommands = useMemo(() => {
    if (!search) return commands;

    const searchLower = search.toLowerCase();
    return commands.filter(cmd =>
      cmd.label.toLowerCase().includes(searchLower) ||
      cmd.category.toLowerCase().includes(searchLower) ||
      cmd.keywords.some(kw => kw.includes(searchLower))
    );
  }, [commands, search]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [search]);

  useEffect(() => {
    if (!isOpen) {
      setSearch('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => Math.min(prev + 1, filteredCommands.length - 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => Math.max(prev - 1, 0));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        const cmd = filteredCommands[selectedIndex];
        if (cmd) {
          cmd.action();
          onClose();
        }
      } else if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, selectedIndex, filteredCommands, onClose]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-start justify-center pt-32"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: -20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: -20 }}
          className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden border border-gray-200 dark:border-gray-700"
          onClick={e => e.stopPropagation()}
        >
          {/* Search Input */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Type a command or search..."
                className="w-full pl-11 pr-10 py-3 bg-gray-50 dark:bg-gray-800 rounded-lg border-none outline-none text-base"
                autoFocus
              />
              <kbd className="absolute right-3 top-1/2 -translate-y-1/2 px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded text-xs font-mono">
                ESC
              </kbd>
            </div>
          </div>

          {/* Commands List */}
          <div className="max-h-96 overflow-y-auto">
            {filteredCommands.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                No commands found
              </div>
            ) : (
              <div className="p-2">
                {Object.entries(
                  filteredCommands.reduce((acc, cmd) => {
                    if (!acc[cmd.category]) acc[cmd.category] = [];
                    acc[cmd.category].push(cmd);
                    return acc;
                  }, {} as Record<string, Command[]>)
                ).map(([category, cmds]) => (
                  <div key={category} className="mb-4">
                    <div className="px-3 py-1 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      {category}
                    </div>
                    {cmds.map((cmd, idx) => {
                      const globalIndex = filteredCommands.indexOf(cmd);
                      return (
                        <motion.div
                          key={cmd.id}
                          whileHover={{ scale: 1.01 }}
                          className={`flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer transition-colors ${
                            globalIndex === selectedIndex
                              ? 'bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300'
                              : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                          }`}
                          onClick={() => {
                            cmd.action();
                            onClose();
                          }}
                        >
                          <div className="flex items-center gap-3">
                            <div className={globalIndex === selectedIndex ? 'text-violet-600 dark:text-violet-400' : 'text-gray-500'}>
                              {cmd.icon}
                            </div>
                            <span className="font-medium">{cmd.label}</span>
                          </div>
                          {cmd.shortcut && (
                            <kbd className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded text-xs font-mono">
                              {cmd.shortcut}
                            </kbd>
                          )}
                        </motion.div>
                      );
                    })}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 text-xs text-gray-500 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 bg-white dark:bg-gray-700 rounded">↑↓</kbd>
                Navigate
              </span>
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 bg-white dark:bg-gray-700 rounded">Enter</kbd>
                Select
              </span>
            </div>
            <span>Ctrl+K to open</span>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
