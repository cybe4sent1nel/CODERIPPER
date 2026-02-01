'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSnippets } from '@/contexts/SnippetContext';
import { SNIPPET_CATEGORIES, FEATURED_SNIPPETS } from '@/lib/enterprise-config';
import { LANGUAGES } from '@/lib/constants';
import { X, Search, Eye, Heart, GitFork, Lightbulb, FolderSearch } from 'lucide-react';

interface SnippetExplorerProps {
  isOpen: boolean;
  onClose: () => void;
  onLoadSnippet?: (snippet: any) => void;
}

export default function SnippetExplorer({ isOpen, onClose, onLoadSnippet }: SnippetExplorerProps) {
  const { getPublicSnippets, likeSnippet, forkSnippet } = useSnippets();
  const [snippets, setSnippets] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'recent' | 'popular' | 'mostLiked'>('recent');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      loadSnippets();
    }
  }, [isOpen, selectedCategory, selectedLanguage, sortBy, searchQuery]);

  const loadSnippets = async () => {
    setIsLoading(true);
    try {
      const results = await getPublicSnippets({
        category: selectedCategory || undefined,
        language: selectedLanguage || undefined,
        search: searchQuery || undefined,
        sortBy,
      });
      
      // Merge with featured snippets for demo
      const merged = [...results, ...FEATURED_SNIPPETS.map(f => ({
        ...f,
        isPublic: true,
        createdAt: new Date().toISOString(),
      }))];
      
      setSnippets(merged);
    } catch (error) {
      console.error('Failed to load snippets:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFork = async (snippetId: string) => {
    try {
      const forked = await forkSnippet(snippetId);
      onLoadSnippet?.(forked);
      onClose();
    } catch (error) {
      console.error('Failed to fork snippet:', error);
    }
  };

  const handleLike = async (snippetId: string) => {
    await likeSnippet(snippetId);
    loadSnippets();
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
        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
        
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: 'spring', duration: 0.5 }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-6xl max-h-[90vh] overflow-hidden rounded-3xl bg-card border border-border shadow-2xl"
        >
          {/* Decorative elements */}
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[128px]" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-[128px]" />

          <div className="relative h-[85vh] flex flex-col">
            {/* Header */}
            <div className="p-6 border-b border-border">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
                    <FolderSearch className="w-8 h-8 text-cyan-500" /> Explore Snippets
                  </h2>
                  <p className="text-muted-foreground text-sm mt-1">
                    Discover and learn from the community's code
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Search & Filters */}
              <div className="flex flex-wrap gap-4">
                {/* Search */}
                <div className="flex-1 min-w-[200px]">
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search snippets..."
                      className="w-full pl-12 pr-4 py-3 rounded-xl bg-muted border border-border text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Language Filter */}
                <select
                  value={selectedLanguage || ''}
                  onChange={(e) => setSelectedLanguage(e.target.value || null)}
                  className="px-4 py-3 rounded-xl bg-muted border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-cyan-500"
                >
                  <option value="">All Languages</option>
                  {Object.entries(LANGUAGES).map(([key, lang]) => (
                    <option key={key} value={key}>{lang.name}</option>
                  ))}
                </select>

                {/* Sort */}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="px-4 py-3 rounded-xl bg-muted border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-cyan-500"
                >
                  <option value="recent">Most Recent</option>
                  <option value="popular">Most Viewed</option>
                  <option value="mostLiked">Most Liked</option>
                </select>
              </div>

              {/* Categories */}
              <div className="flex gap-2 mt-4 overflow-x-auto pb-2 scrollbar-hide">
                <button
                  onClick={() => setSelectedCategory(null)}
                  className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                    !selectedCategory
                      ? 'bg-gradient-to-r from-cyan-600 to-emerald-600 text-white'
                      : 'bg-muted text-muted-foreground hover:text-foreground border border-border'
                  }`}
                >
                  All
                </button>
                {SNIPPET_CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all flex items-center gap-1 ${
                      selectedCategory === cat.id
                        ? 'bg-gradient-to-r from-cyan-600 to-emerald-600 text-white'
                        : 'bg-muted text-muted-foreground hover:text-foreground border border-border'
                    }`}
                  >
                    <span>{cat.icon}</span>
                    <span>{cat.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="h-48 rounded-xl bg-muted/30 animate-pulse" />
                  ))}
                </div>
              ) : snippets.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {snippets.map((snippet, index) => (
                    <motion.div
                      key={snippet.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="group p-4 rounded-xl bg-muted/30 border border-border hover:border-cyan-500/30 transition-all hover:shadow-lg hover:shadow-cyan-500/5"
                    >
                      {/* Header */}
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-foreground truncate group-hover:text-cyan-500 dark:group-hover:text-cyan-400 transition-colors">
                            {snippet.title}
                          </h3>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            by {snippet.authorName || snippet.author || 'Anonymous'}
                          </p>
                        </div>
                        <span className="px-2 py-0.5 rounded text-xs bg-secondary text-secondary-foreground">
                          {snippet.language}
                        </span>
                      </div>

                      {/* Description */}
                      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                        {snippet.description || 'No description'}
                      </p>

                      {/* Code Preview */}
                      <div className="relative h-24 mb-3 rounded-lg bg-background overflow-hidden">
                        <pre className="p-3 text-xs text-muted-foreground font-mono">
                          {(snippet.code || '').slice(0, 150)}...
                        </pre>
                        <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
                      </div>

                      {/* Tags */}
                      {snippet.tags && snippet.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-3">
                          {snippet.tags.slice(0, 3).map((tag: string) => (
                            <span
                              key={tag}
                              className="px-2 py-0.5 rounded-full text-xs bg-secondary text-muted-foreground"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Stats & Actions */}
                      <div className="flex items-center justify-between pt-3 border-t border-border">
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Eye className="w-3 h-3" /> {snippet.views || 0}
                          </span>
                          <button 
                            onClick={() => handleLike(snippet.id)}
                            className="flex items-center gap-1 hover:text-red-500 dark:hover:text-red-400 transition-colors"
                          >
                            <Heart className="w-3 h-3" /> {snippet.likes || 0}
                          </button>
                          <span className="flex items-center gap-1">
                            <GitFork className="w-3 h-3" /> {snippet.forks || 0}
                          </span>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => onLoadSnippet?.(snippet)}
                            className="px-3 py-1.5 rounded-lg bg-secondary text-secondary-foreground text-xs hover:bg-secondary/80 transition-colors"
                          >
                            Open
                          </button>
                          <button
                            onClick={() => handleFork(snippet.id)}
                            className="px-3 py-1.5 rounded-lg bg-cyan-600/20 text-cyan-600 dark:text-cyan-400 text-xs hover:bg-cyan-600/30 transition-colors"
                          >
                            Fork
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <div className="w-20 h-20 rounded-2xl bg-muted flex items-center justify-center mb-4">
                    <Search className="w-10 h-10 text-muted-foreground" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">No snippets found</h3>
                  <p className="text-muted-foreground max-w-md">
                    Try adjusting your search or filters to find what you're looking for.
                  </p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-border bg-background/50">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  {snippets.length} snippets found
                </p>
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  <Lightbulb className="w-4 h-4" /> Tip: Fork a snippet to add it to your collection and modify it
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
