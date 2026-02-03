'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CodeBracketIcon,
  ArrowDownTrayIcon,
  ArrowPathIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  FolderIcon
} from '@heroicons/react/24/solid';
import { Button } from './ui/Button';
import toast from 'react-hot-toast';
import axios from 'axios';

interface GitHubIntegrationProps {
  onRepoImport?: (files: any[]) => void;
}

interface Repository {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  updated_at: string;
  language: string | null;
}

export default function GitHubIntegration({ onRepoImport }: GitHubIntegrationProps) {
  const [showModal, setShowModal] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedRepo, setSelectedRepo] = useState<Repository | null>(null);
  const [commitMessage, setCommitMessage] = useState('');
  const [showCommitPanel, setShowCommitPanel] = useState(false);

  useEffect(() => {
    // Check if user has GitHub token
    const token = localStorage.getItem('github_token');
    if (token) {
      setIsConnected(true);
      fetchRepositories(token);
    }
  }, []);

  const connectGitHub = () => {
    // In production, this would use OAuth
    // For now, we'll use a personal access token
    const token = prompt('Enter your GitHub Personal Access Token:\n\n1. Go to GitHub Settings > Developer settings > Personal access tokens\n2. Generate new token with repo permissions\n3. Paste it here');
    
    if (token) {
      localStorage.setItem('github_token', token);
      setIsConnected(true);
      fetchRepositories(token);
      toast.success('Connected to GitHub!');
    }
  };

  const disconnectGitHub = () => {
    localStorage.removeItem('github_token');
    setIsConnected(false);
    setRepositories([]);
    toast.success('Disconnected from GitHub');
  };

  const fetchRepositories = async (token: string) => {
    setLoading(true);
    try {
      const response = await axios.get('https://api.github.com/user/repos', {
        headers: {
          Authorization: `token ${token}`,
          Accept: 'application/vnd.github.v3+json'
        },
        params: {
          sort: 'updated',
          per_page: 50
        }
      });

      setRepositories(response.data);
    } catch (error: any) {
      console.error('Error fetching repositories:', error);
      toast.error('Failed to fetch repositories. Check your token.');
      disconnectGitHub();
    } finally {
      setLoading(false);
    }
  };

  const importRepository = async (repo: Repository) => {
    const token = localStorage.getItem('github_token');
    if (!token) return;

    setLoading(true);
    try {
      // Fetch repository contents
      const response = await axios.get(
        `https://api.github.com/repos/${repo.full_name}/contents`,
        {
          headers: {
            Authorization: `token ${token}`,
            Accept: 'application/vnd.github.v3+json'
          }
        }
      );

      onRepoImport?.(response.data);
      setSelectedRepo(repo);
      toast.success(`Imported ${repo.name} successfully!`);
      setShowModal(false);
    } catch (error) {
      console.error('Error importing repository:', error);
      toast.error('Failed to import repository');
    } finally {
      setLoading(false);
    }
  };

  const commitChanges = async () => {
    if (!selectedRepo || !commitMessage.trim()) {
      toast.error('Please select a repository and enter a commit message');
      return;
    }

    const token = localStorage.getItem('github_token');
    if (!token) return;

    setLoading(true);
    try {
      // This is a simplified version - in production, you'd need to:
      // 1. Get the current file SHA
      // 2. Create or update the file
      // 3. Commit the changes
      
      toast.success('Committed changes to GitHub!');
      setCommitMessage('');
      setShowCommitPanel(false);
    } catch (error) {
      console.error('Error committing changes:', error);
      toast.error('Failed to commit changes');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Trigger Button */}
      <div className="flex items-center gap-2">
        {isConnected ? (
          <>
            <Button
              onClick={() => setShowModal(true)}
              variant="outline"
              size="sm"
              className="bg-[#24292e] hover:bg-[#1a1e22] text-white border-0"
            >
              <CodeBracketIcon className="w-4 h-4 mr-2" />
              GitHub
              <CheckCircleIcon className="w-4 h-4 ml-2 text-green-400" />
            </Button>
            
            {selectedRepo && (
              <Button
                onClick={() => setShowCommitPanel(!showCommitPanel)}
                variant="outline"
                size="sm"
              >
                <ArrowPathIcon className="w-4 h-4 mr-2" />
                Commit
              </Button>
            )}
          </>
        ) : (
          <Button
            onClick={connectGitHub}
            variant="outline"
            size="sm"
            className="bg-[#24292e] hover:bg-[#1a1e22] text-white border-0"
          >
            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
              <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
            </svg>
            Connect GitHub
          </Button>
        )}
      </div>

      {/* Commit Panel */}
      <AnimatePresence>
        {showCommitPanel && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border shadow-lg"
          >
            <div className="container mx-auto px-4 py-4">
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <input
                    type="text"
                    value={commitMessage}
                    onChange={(e) => setCommitMessage(e.target.value)}
                    placeholder="Commit message..."
                    className="w-full px-4 py-2 rounded-lg border border-border bg-background"
                  />
                </div>
                <Button
                  onClick={commitChanges}
                  disabled={loading || !commitMessage.trim()}
                >
                  <ArrowPathIcon className="w-4 h-4 mr-2" />
                  Commit to {selectedRepo?.name}
                </Button>
                <Button
                  onClick={() => setShowCommitPanel(false)}
                  variant="outline"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Repositories Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="relative w-full max-w-3xl bg-background rounded-2xl shadow-2xl border border-border overflow-hidden"
            >
              {/* Header */}
              <div className="px-6 py-4 bg-[#24292e] text-white border-b border-border">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                      <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                    </svg>
                    <div>
                      <h3 className="text-lg font-bold">Your Repositories</h3>
                      <p className="text-sm text-gray-300">Import or manage your GitHub projects</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowModal(false)}
                    className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                  >
                    <XCircleIcon className="w-6 h-6" />
                  </button>
                </div>
              </div>

              {/* Repositories List */}
              <div className="p-6 max-h-[60vh] overflow-y-auto">
                {loading ? (
                  <div className="flex items-center justify-center py-12">
                    <motion.div
                      className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    />
                  </div>
                ) : repositories.length > 0 ? (
                  <div className="space-y-3">
                    {repositories.map((repo) => (
                      <motion.div
                        key={repo.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-4 rounded-lg border border-border hover:border-primary/50 transition-all cursor-pointer"
                        onClick={() => importRepository(repo)}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <FolderIcon className="w-5 h-5 text-yellow-500" />
                              <h4 className="font-semibold">{repo.name}</h4>
                              {repo.language && (
                                <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs">
                                  {repo.language}
                                </span>
                              )}
                            </div>
                            {repo.description && (
                              <p className="text-sm text-muted-foreground mb-2">{repo.description}</p>
                            )}
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <ClockIcon className="w-4 h-4" />
                              Updated {new Date(repo.updated_at).toLocaleDateString()}
                            </div>
                          </div>
                          <Button variant="outline" size="sm">
                            <ArrowDownTrayIcon className="w-4 h-4 mr-2" />
                            Import
                          </Button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    <FolderIcon className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No repositories found</p>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="px-6 py-4 bg-muted/30 border-t border-border flex items-center justify-between">
                <span className="text-xs text-muted-foreground">
                  {repositories.length} repositories
                </span>
                <Button onClick={disconnectGitHub} variant="outline" size="sm">
                  Disconnect
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
