'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSnippets } from '@/contexts/SnippetContext';
import { useAuth } from '@/contexts/AuthContext';
import { SNIPPET_CATEGORIES } from '@/lib/enterprise-config';
import { X, Check, AlertTriangle, Globe, Lock, Save, Loader2 } from 'lucide-react';

interface SaveSnippetModalProps {
  isOpen: boolean;
  onClose: () => void;
  code: string;
  language: string;
  onSave?: (snippet: any) => void;
}

export default function SaveSnippetModal({ isOpen, onClose, code, language, onSave }: SaveSnippetModalProps) {
  const { user, isAuthenticated } = useAuth();
  const { saveSnippet, updateSnippet, currentSnippet } = useSnippets();
  
  const [title, setTitle] = useState(currentSnippet?.title || '');
  const [description, setDescription] = useState(currentSnippet?.description || '');
  const [category, setCategory] = useState(currentSnippet?.category || 'other');
  const [tags, setTags] = useState<string[]>(currentSnippet?.tags || []);
  const [tagInput, setTagInput] = useState('');
  const [isPublic, setIsPublic] = useState(currentSnippet?.isPublic || false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      if (!tags.includes(tagInput.trim().toLowerCase())) {
        setTags([...tags, tagInput.trim().toLowerCase()]);
      }
      setTagInput('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    setTags(tags.filter(t => t !== tag));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Please enter a title');
      return;
    }
    
    setError('');
    setIsLoading(true);
    
    try {
      if (currentSnippet) {
        // Update existing snippet
        await updateSnippet(currentSnippet.id, {
          title: title.trim(),
          description: description.trim(),
          code,
          category,
          tags,
          isPublic,
        });
      } else {
        // Save new snippet
        const saved = await saveSnippet({
          title: title.trim(),
          description: description.trim(),
          code,
          language,
          category,
          tags,
          isPublic,
        });
        onSave?.(saved);
      }
      
      setSuccess(true);
      setTimeout(() => {
        onClose();
        setSuccess(false);
        // Reset form if saving new
        if (!currentSnippet) {
          setTitle('');
          setDescription('');
          setCategory('other');
          setTags([]);
        }
      }, 1500);
    } catch (err: any) {
      setError(err.message || 'Failed to save snippet');
    } finally {
      setIsLoading(false);
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
          className="relative w-full max-w-lg overflow-hidden rounded-2xl bg-card border border-border shadow-2xl"
        >
          {/* Decorative elements */}
          <div className="absolute -top-20 -right-20 w-40 h-40 bg-emerald-500/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-teal-500/20 rounded-full blur-3xl" />

          {/* Success overlay */}
          <AnimatePresence>
            {success && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-card/95"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', delay: 0.1 }}
                  className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center mb-4"
                >
                  <Check className="w-10 h-10 text-white" strokeWidth={3} />
                </motion.div>
                <p className="text-xl font-semibold text-foreground">Snippet Saved!</p>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="relative p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-foreground">
                  {currentSnippet ? 'Update Snippet' : 'Save Snippet'}
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  {isPublic ? 'This snippet will be visible to everyone' : 'This snippet will be private'}
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {!isAuthenticated && (
              <div className="mb-6 p-4 rounded-xl bg-amber-500/10 border border-amber-500/30">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-6 h-6 text-amber-500 flex-shrink-0" />
                  <div>
                    <p className="text-amber-600 dark:text-amber-400 font-medium">Sign in required</p>
                    <p className="text-sm text-amber-600/80 dark:text-amber-400/80 mt-1">
                      You need to sign in to save snippets. They'll be stored locally for now.
                    </p>
                  </div>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">
                  Title <span className="text-destructive">*</span>
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="My awesome snippet"
                  className="w-full px-4 py-3 rounded-xl bg-muted border border-border text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="What does this code do?"
                  rows={2}
                  className="w-full px-4 py-3 rounded-xl bg-muted border border-border text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all resize-none"
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">
                  Category
                </label>
                <div className="grid grid-cols-5 gap-2">
                  {SNIPPET_CATEGORIES.slice(0, 10).map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setCategory(cat.id)}
                      className={`p-2 rounded-lg text-center transition-all ${
                        category === cat.id
                          ? 'bg-emerald-500/20 border-2 border-emerald-500'
                          : 'bg-muted/50 border border-border hover:border-muted-foreground/50'
                      }`}
                      title={cat.name}
                    >
                      <span className="text-lg">{cat.icon}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Tags */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">
                  Tags
                </label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-secondary/50 text-secondary-foreground text-sm"
                    >
                      #{tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="hover:text-destructive"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleAddTag}
                  placeholder="Type a tag and press Enter"
                  className="w-full px-4 py-2 rounded-xl bg-muted border border-border text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all text-sm"
                />
              </div>

              {/* Public toggle */}
              <div className="flex items-center justify-between p-4 rounded-xl bg-muted/50 border border-border">
                <div className="flex items-center gap-3">
                  {isPublic ? <Globe className="w-6 h-6 text-emerald-500" /> : <Lock className="w-6 h-6 text-muted-foreground" />}
                  <div>
                    <p className="font-medium text-foreground">{isPublic ? 'Public' : 'Private'}</p>
                    <p className="text-xs text-muted-foreground">
                      {isPublic ? 'Anyone can view and fork' : 'Only you can see this'}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsPublic(!isPublic)}
                  className={`relative w-12 h-6 rounded-full transition-colors ${
                    isPublic ? 'bg-emerald-500' : 'bg-muted-foreground/30'
                  }`}
                >
                  <span
                    className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
                      isPublic ? 'translate-x-7' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {/* Code preview */}
              <div className="p-3 rounded-xl bg-muted/30 border border-border">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-muted-foreground">Code Preview</span>
                  <span className="px-2 py-0.5 rounded text-xs bg-secondary text-secondary-foreground">
                    {language}
                  </span>
                </div>
                <pre className="text-xs text-muted-foreground font-mono overflow-hidden max-h-20 line-clamp-4">
                  {code.slice(0, 300)}{code.length > 300 ? '...' : ''}
                </pre>
              </div>

              {error && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-destructive text-sm bg-destructive/10 p-3 rounded-lg"
                >
                  {error}
                </motion.p>
              )}

              {/* Actions */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-3 px-4 rounded-xl border border-border text-muted-foreground font-medium hover:bg-accent transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold hover:from-emerald-500 hover:to-teal-500 transition-all disabled:opacity-50 shadow-lg shadow-emerald-500/25"
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Saving...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      <Save className="w-4 h-4" />
                      {currentSnippet ? 'Update' : 'Save'} Snippet
                    </span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
