'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Snippet, SnippetVersion } from '@/lib/types';
import { useAuth } from './AuthContext';
import { getAppUrl } from '@/lib/utils';

interface SnippetContextType {
  snippets: Snippet[];
  currentSnippet: Snippet | null;
  isLoading: boolean;
  saveSnippet: (snippet: SaveSnippetInput) => Promise<Snippet>;
  updateSnippet: (id: string, updates: Partial<Snippet>) => Promise<void>;
  deleteSnippet: (id: string) => Promise<void>;
  loadSnippet: (id: string) => Promise<Snippet | null>;
  setCurrentSnippet: (snippet: Snippet | null) => void;
  forkSnippet: (id: string) => Promise<Snippet>;
  likeSnippet: (id: string) => Promise<void>;
  getPublicSnippets: (filter?: SnippetFilter) => Promise<Snippet[]>;
  getMySnippets: () => Snippet[];
  exportSnippet: (id: string, format: ExportFormat) => Promise<string | Blob>;
  getSnippetVersions: (id: string) => SnippetVersion[];
  restoreVersion: (snippetId: string, versionId: string) => Promise<void>;
}

interface SaveSnippetInput {
  title: string;
  description?: string;
  code: string;
  language: string;
  isPublic?: boolean;
  category?: string;
  tags?: string[];
}

interface SnippetFilter {
  language?: string;
  category?: string;
  tags?: string[];
  search?: string;
  sortBy?: 'recent' | 'popular' | 'mostLiked';
}

type ExportFormat = 'file' | 'gist' | 'pdf' | 'markdown' | 'image' | 'embed';

const SnippetContext = createContext<SnippetContextType | undefined>(undefined);

// Helper to generate unique IDs
const generateId = () => `snippet_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

export function SnippetProvider({ children }: { children: ReactNode }) {
  const { user, incrementUsage, checkUsageLimit } = useAuth();
  const [snippets, setSnippets] = useState<Snippet[]>([]);
  const [currentSnippet, setCurrentSnippet] = useState<Snippet | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [versions, setVersions] = useState<Record<string, SnippetVersion[]>>({});

  // Load snippets from localStorage
  useEffect(() => {
    const savedSnippets = localStorage.getItem('coderipper_snippets');
    if (savedSnippets) {
      try {
        setSnippets(JSON.parse(savedSnippets));
      } catch (e) {
        console.error('Failed to parse saved snippets:', e);
      }
    }
    
    const savedVersions = localStorage.getItem('coderipper_versions');
    if (savedVersions) {
      try {
        setVersions(JSON.parse(savedVersions));
      } catch (e) {
        console.error('Failed to parse saved versions:', e);
      }
    }
  }, []);

  // Save snippets to localStorage
  useEffect(() => {
    if (snippets.length > 0) {
      localStorage.setItem('coderipper_snippets', JSON.stringify(snippets));
    }
  }, [snippets]);

  useEffect(() => {
    if (Object.keys(versions).length > 0) {
      localStorage.setItem('coderipper_versions', JSON.stringify(versions));
    }
  }, [versions]);

  const saveSnippet = async (snippetData: SaveSnippetInput): Promise<Snippet> => {
    if (!user) throw new Error('Must be logged in to save snippets');
    
    if (!checkUsageLimit('snippet') && !user.isPremium) {
      throw new Error('Snippet limit reached. Upgrade to Pro for unlimited snippets.');
    }
    
    const newSnippet: Snippet = {
      id: generateId(),
      authorId: user.id,
      authorName: user.name,
      title: snippetData.title,
      description: snippetData.description,
      code: snippetData.code,
      language: snippetData.language,
      category: snippetData.category,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      views: 0,
      likes: 0,
      forks: 0,
      isPublic: snippetData.isPublic ?? false,
      isFavorite: false,
      tags: snippetData.tags || [],
    };
    
    setSnippets(prev => [newSnippet, ...prev]);
    incrementUsage('snippet');
    
    // Create initial version
    const initialVersion: SnippetVersion = {
      id: `version_${Date.now()}`,
      snippetId: newSnippet.id,
      code: newSnippet.code,
      message: 'Initial version',
      createdAt: new Date().toISOString(),
    };
    
    setVersions(prev => ({
      ...prev,
      [newSnippet.id]: [initialVersion],
    }));
    
    return newSnippet;
  };

  const updateSnippet = async (id: string, updates: Partial<Snippet>) => {
    setSnippets(prev => prev.map(s => {
      if (s.id === id) {
        const updated: Snippet = {
          ...s,
          ...updates,
          updatedAt: new Date().toISOString(),
        };
        
        // If code changed, create new version
        if (updates.code && updates.code !== s.code) {
          const newVersion: SnippetVersion = {
            id: `version_${Date.now()}`,
            snippetId: id,
            code: updates.code,
            message: updates.description || 'Updated',
            createdAt: new Date().toISOString(),
          };
          
          setVersions(prev => ({
            ...prev,
            [id]: [...(prev[id] || []), newVersion].slice(-30), // Keep last 30 versions
          }));
        }
        
        return updated;
      }
      return s;
    }));
    
    if (currentSnippet?.id === id) {
      setCurrentSnippet(prev => prev ? { ...prev, ...updates } : null);
    }
  };

  const deleteSnippet = async (id: string) => {
    setSnippets(prev => prev.filter(s => s.id !== id));
    setVersions(prev => {
      const newVersions = { ...prev };
      delete newVersions[id];
      return newVersions;
    });
    
    if (currentSnippet?.id === id) {
      setCurrentSnippet(null);
    }
  };

  const loadSnippet = async (id: string): Promise<Snippet | null> => {
    setIsLoading(true);
    
    // Check local snippets first
    const localSnippet = snippets.find(s => s.id === id);
    if (localSnippet) {
      // Increment views
      await updateSnippet(id, { views: (localSnippet.views || 0) + 1 });
      setIsLoading(false);
      return localSnippet;
    }
    
    // In a real app, would fetch from API
    setIsLoading(false);
    return null;
  };

  const forkSnippet = async (id: string): Promise<Snippet> => {
    const original = snippets.find(s => s.id === id);
    if (!original) throw new Error('Snippet not found');
    if (!user) throw new Error('Must be logged in to fork');
    
    const forked = await saveSnippet({
      title: `${original.title} (Fork)`,
      description: `Forked from ${original.authorName || 'anonymous'}`,
      code: original.code,
      language: original.language,
      isPublic: false,
      category: original.category,
      tags: [...(original.tags || []), 'forked'],
    });
    
    // Update original's fork count
    await updateSnippet(id, { forks: (original.forks || 0) + 1 });
    
    return forked;
  };

  const likeSnippet = async (id: string) => {
    const snippet = snippets.find(s => s.id === id);
    if (!snippet) return;
    
    // In real app, would check if user already liked
    await updateSnippet(id, { likes: (snippet.likes || 0) + 1 });
  };

  const getPublicSnippets = async (filter?: SnippetFilter): Promise<Snippet[]> => {
    let filtered = snippets.filter(s => s.isPublic);
    
    if (filter?.language) {
      filtered = filtered.filter(s => s.language === filter.language);
    }
    if (filter?.category) {
      filtered = filtered.filter(s => s.category === filter.category);
    }
    if (filter?.tags?.length) {
      filtered = filtered.filter(s => 
        filter.tags!.some(tag => s.tags?.includes(tag))
      );
    }
    if (filter?.search) {
      const searchLower = filter.search.toLowerCase();
      filtered = filtered.filter(s => 
        s.title.toLowerCase().includes(searchLower) ||
        s.description?.toLowerCase().includes(searchLower) ||
        s.code.toLowerCase().includes(searchLower)
      );
    }
    
    // Sort
    switch (filter?.sortBy) {
      case 'popular':
        filtered.sort((a, b) => (b.views || 0) - (a.views || 0));
        break;
      case 'mostLiked':
        filtered.sort((a, b) => (b.likes || 0) - (a.likes || 0));
        break;
      case 'recent':
      default:
        filtered.sort((a, b) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
    }
    
    return filtered;
  };

  const getMySnippets = (): Snippet[] => {
    if (!user) return [];
    return snippets.filter(s => s.authorId === user.id);
  };

  const exportSnippet = async (id: string, format: ExportFormat): Promise<string | Blob> => {
    const snippet = snippets.find(s => s.id === id);
    if (!snippet) throw new Error('Snippet not found');
    
    switch (format) {
      case 'file':
        return snippet.code;
      case 'markdown':
        return `# ${snippet.title}\n\n${snippet.description || ''}\n\n\`\`\`${snippet.language}\n${snippet.code}\n\`\`\``;
      case 'embed':
        return `<iframe src="${getAppUrl()}/embed/${id}" width="100%" height="400" frameborder="0"></iframe>`;
      default:
        return snippet.code;
    }
  };

  const getSnippetVersions = (id: string): SnippetVersion[] => {
    return versions[id] || [];
  };

  const restoreVersion = async (snippetId: string, versionId: string) => {
    const snippetVersions = versions[snippetId];
    if (!snippetVersions) return;
    
    const version = snippetVersions.find(v => v.id === versionId);
    if (!version) return;
    
    await updateSnippet(snippetId, { code: version.code });
  };

  return (
    <SnippetContext.Provider
      value={{
        snippets,
        currentSnippet,
        isLoading,
        saveSnippet,
        updateSnippet,
        deleteSnippet,
        loadSnippet,
        setCurrentSnippet,
        forkSnippet,
        likeSnippet,
        getPublicSnippets,
        getMySnippets,
        exportSnippet,
        getSnippetVersions,
        restoreVersion,
      }}
    >
      {children}
    </SnippetContext.Provider>
  );
}

export function useSnippets() {
  const context = useContext(SnippetContext);
  if (context === undefined) {
    throw new Error('useSnippets must be used within a SnippetProvider');
  }
  return context;
}
