'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { useSnippets } from '@/contexts/SnippetContext';
import { BADGES } from '@/lib/enterprise-config';
import {
  X,
  Crown,
  LayoutDashboard,
  FileCode,
  Trophy,
  Settings,
  Sparkles,
  Zap,
  Flame,
  Award,
  FileText,
  Eye,
  Heart,
  GitFork,
  Globe,
  Lock,
  Check,
  Trash2,
  UserX,
} from 'lucide-react';

interface UserDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenPricing?: () => void;
}

export default function UserDashboard({ isOpen, onClose, onOpenPricing }: UserDashboardProps) {
  const { user, logout, updateProfile } = useAuth();
  const { getMySnippets, snippets } = useSnippets();
  const [activeTab, setActiveTab] = useState<'overview' | 'snippets' | 'settings' | 'badges'>('overview');
  const [mySnippets, setMySnippets] = useState<any[]>([]);

  useEffect(() => {
    if (user) {
      setMySnippets(getMySnippets());
    }
  }, [user, snippets]);

  if (!isOpen || !user) return null;

  const stats = [
    { label: 'Snippets', value: mySnippets.length, Icon: FileCode, color: 'from-blue-500 to-cyan-500' },
    { label: 'Executions', value: user.totalExecutions, Icon: Zap, color: 'from-violet-500 to-purple-500' },
    { label: 'Streak', value: `${user.streakDays}d`, Icon: Flame, color: 'from-orange-500 to-red-500' },
    { label: 'Badges', value: user.badges?.length || 0, Icon: Trophy, color: 'from-amber-500 to-yellow-500' },
  ];

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
          className="relative w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-3xl bg-card border border-border shadow-2xl"
        >
          {/* Decorative elements */}
          <div className="absolute top-0 left-1/3 w-64 h-64 bg-violet-500/10 rounded-full blur-[100px]" />
          <div className="absolute bottom-0 right-1/3 w-64 h-64 bg-blue-500/10 rounded-full blur-[100px]" />

          <div className="relative flex h-[80vh]">
            {/* Sidebar */}
            <div className="w-64 border-r border-border p-6 flex flex-col">
              {/* User Info */}
              <div className="text-center mb-6">
                <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center mb-3 ring-4 ring-violet-500/20">
                  {user.avatar ? (
                    <img src={user.avatar} alt={user.name} className="w-full h-full rounded-full" />
                  ) : (
                    <span className="text-3xl font-bold text-white">
                      {user.name.charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
                <h3 className="font-bold text-foreground text-lg">{user.name}</h3>
                <p className="text-sm text-muted-foreground">{user.email}</p>
                <div className="mt-2">
                  <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${
                    user.isPremium
                      ? 'bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30'
                      : 'bg-muted text-muted-foreground border border-border'
                  }`}>
                    {user.isPremium ? <Crown className="w-3 h-3" /> : null}
                    {user.isPremium ? 'Pro' : 'Free'} Plan
                  </span>
                </div>
              </div>

              {/* Navigation */}
              <nav className="flex-1 space-y-1">
                {[
                  { id: 'overview', label: 'Overview', Icon: LayoutDashboard },
                  { id: 'snippets', label: 'My Snippets', Icon: FileCode },
                  { id: 'badges', label: 'Achievements', Icon: Trophy },
                  { id: 'settings', label: 'Settings', Icon: Settings },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id as any)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all ${
                      activeTab === item.id
                        ? 'bg-gradient-to-r from-violet-600/20 to-blue-600/20 text-foreground border border-violet-500/30'
                        : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                    }`}
                  >
                    <item.Icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                  </button>
                ))}
              </nav>

              {/* Upgrade Button */}
              {!user.isPremium && (
                <button
                  onClick={onOpenPricing}
                  className="mt-4 w-full py-3 px-4 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 text-white font-semibold hover:from-violet-500 hover:to-blue-500 transition-all shadow-lg shadow-violet-500/25 flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4" /> Upgrade to Pro
                </button>
              )}

              {/* Logout */}
              <button
                onClick={logout}
                className="mt-2 w-full py-2 text-muted-foreground hover:text-destructive text-sm transition-colors"
              >
                Sign Out
              </button>
            </div>

            {/* Main Content */}
            <div className="flex-1 overflow-y-auto">
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 text-muted-foreground hover:text-foreground transition-colors z-10"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="p-6">
                {activeTab === 'overview' && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-6"
                  >
                    <h2 className="text-2xl font-bold text-foreground">Dashboard</h2>
                    
                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {stats.map((stat, i) => (
                        <motion.div
                          key={stat.label}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.1 }}
                          className="p-4 rounded-xl bg-muted/50 border border-border"
                        >
                          <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center mb-3`}>
                            <stat.Icon className="w-5 h-5 text-white" />
                          </div>
                          <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                          <p className="text-sm text-muted-foreground">{stat.label}</p>
                        </motion.div>
                      ))}
                    </div>

                    {/* Usage Progress */}
                    <div className="p-6 rounded-xl bg-muted/30 border border-border">
                      <h3 className="font-semibold text-foreground mb-4">Today's Usage</h3>
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-muted-foreground">Code Executions</span>
                            <span className="text-foreground">
                              {user.executionsToday} / {user.isPremium ? '∞' : '10'}
                            </span>
                          </div>
                          <div className="h-2 rounded-full bg-secondary overflow-hidden">
                            <div 
                              className="h-full rounded-full bg-gradient-to-r from-violet-500 to-blue-500"
                              style={{ width: user.isPremium ? '5%' : `${(user.executionsToday / 10) * 100}%` }}
                            />
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-muted-foreground">Saved Snippets</span>
                            <span className="text-foreground">
                              {mySnippets.length} / {user.isPremium ? '∞' : '5'}
                            </span>
                          </div>
                          <div className="h-2 rounded-full bg-secondary overflow-hidden">
                            <div 
                              className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-500"
                              style={{ width: user.isPremium ? '5%' : `${(mySnippets.length / 5) * 100}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Recent Snippets */}
                    <div className="p-6 rounded-xl bg-muted/30 border border-border">
                      <h3 className="font-semibold text-foreground mb-4">Recent Snippets</h3>
                      {mySnippets.length > 0 ? (
                        <div className="space-y-2">
                          {mySnippets.slice(0, 3).map((snippet) => (
                            <div
                              key={snippet.id}
                              className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-accent transition-colors"
                            >
                              <div className="flex items-center gap-3">
                                <FileText className="w-5 h-5 text-muted-foreground" />
                                <div>
                                  <p className="font-medium text-foreground">{snippet.title}</p>
                                  <p className="text-xs text-muted-foreground">{snippet.language}</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                <span className="flex items-center gap-1"><Eye className="w-3 h-3" /> {snippet.views || 0}</span>
                                <span className="flex items-center gap-1"><Heart className="w-3 h-3" /> {snippet.likes || 0}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-muted-foreground text-center py-8">
                          No snippets yet. Start coding to save your first snippet!
                        </p>
                      )}
                    </div>
                  </motion.div>
                )}

                {activeTab === 'snippets' && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-6"
                  >
                    <div className="flex items-center justify-between">
                      <h2 className="text-2xl font-bold text-foreground">My Snippets</h2>
                      <span className="text-muted-foreground">{mySnippets.length} total</span>
                    </div>
                    
                    {mySnippets.length > 0 ? (
                      <div className="grid gap-4">
                        {mySnippets.map((snippet) => (
                          <div
                            key={snippet.id}
                            className="p-4 rounded-xl bg-muted/30 border border-border hover:border-muted-foreground/50 transition-all"
                          >
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <h3 className="font-semibold text-foreground">{snippet.title}</h3>
                                <p className="text-sm text-muted-foreground">{snippet.description || 'No description'}</p>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className={`px-2 py-0.5 rounded text-xs flex items-center gap-1 ${
                                  snippet.isPublic 
                                    ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400' 
                                    : 'bg-muted text-muted-foreground'
                                }`}>
                                  {snippet.isPublic ? <Globe className="w-3 h-3" /> : <Lock className="w-3 h-3" />}
                                  {snippet.isPublic ? 'Public' : 'Private'}
                                </span>
                                <span className="px-2 py-0.5 rounded bg-secondary text-secondary-foreground text-xs">
                                  {snippet.language}
                                </span>
                              </div>
                            </div>
                            <pre className="text-xs text-muted-foreground bg-muted/50 p-3 rounded-lg overflow-hidden max-h-20">
                              {snippet.code.slice(0, 200)}{snippet.code.length > 200 ? '...' : ''}
                            </pre>
                            <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
                              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                <span className="flex items-center gap-1"><Eye className="w-3 h-3" /> {snippet.views || 0}</span>
                                <span className="flex items-center gap-1"><Heart className="w-3 h-3" /> {snippet.likes || 0}</span>
                                <span className="flex items-center gap-1"><GitFork className="w-3 h-3" /> {snippet.forks || 0}</span>
                              </div>
                              <div className="flex gap-2">
                                <button className="px-3 py-1 rounded-lg bg-secondary text-secondary-foreground text-xs hover:bg-secondary/80 transition-colors">
                                  Edit
                                </button>
                                <button className="px-3 py-1 rounded-lg bg-violet-600/20 text-violet-600 dark:text-violet-400 text-xs hover:bg-violet-600/30 transition-colors">
                                  Share
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <div className="w-16 h-16 mx-auto rounded-2xl bg-muted/50 flex items-center justify-center mb-4">
                          <FileCode className="w-8 h-8 text-muted-foreground" />
                        </div>
                        <p className="text-muted-foreground mb-2">No snippets yet</p>
                        <p className="text-sm text-muted-foreground/60">
                          Write some code and save it to build your collection
                        </p>
                      </div>
                    )}
                  </motion.div>
                )}

                {activeTab === 'badges' && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-6"
                  >
                    <h2 className="text-2xl font-bold text-foreground">Achievements</h2>
                    <p className="text-muted-foreground">
                      Earn badges by using CodeRipper. You have {user.badges?.length || 0} of {BADGES.length} badges.
                    </p>
                    
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {BADGES.map((badge) => {
                        const earned = user.badges?.includes(badge.id);
                        return (
                          <div
                            key={badge.id}
                            className={`p-4 rounded-xl border transition-all ${
                              earned
                                ? 'bg-gradient-to-br from-amber-500/10 to-orange-500/10 border-amber-500/30'
                                : 'bg-muted/30 border-border opacity-50'
                            }`}
                          >
                            <div className="text-4xl mb-2">{badge.icon}</div>
                            <h3 className="font-semibold text-foreground">{badge.name}</h3>
                            <p className="text-xs text-muted-foreground mb-2">{badge.description}</p>
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-amber-600 dark:text-amber-400">{badge.points} pts</span>
                              {earned && (
                                <span className="text-xs text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                                  <Check className="w-3 h-3" /> Earned
                                </span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </motion.div>
                )}

                {activeTab === 'settings' && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-6"
                  >
                    <h2 className="text-2xl font-bold text-foreground">Settings</h2>
                    
                    <div className="space-y-4">
                      {/* Editor Settings */}
                      <div className="p-6 rounded-xl bg-muted/30 border border-border">
                        <h3 className="font-semibold text-foreground mb-4">Editor Preferences</h3>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium text-foreground">Font Size</p>
                              <p className="text-xs text-muted-foreground">Editor font size</p>
                            </div>
                            <select className="px-3 py-2 rounded-lg bg-muted border border-border text-foreground text-sm">
                              <option>12px</option>
                              <option>14px</option>
                              <option>16px</option>
                              <option>18px</option>
                            </select>
                          </div>
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium text-foreground">Tab Size</p>
                              <p className="text-xs text-muted-foreground">Spaces per tab</p>
                            </div>
                            <select className="px-3 py-2 rounded-lg bg-muted border border-border text-foreground text-sm">
                              <option>2</option>
                              <option>4</option>
                            </select>
                          </div>
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium text-foreground">Auto-save</p>
                              <p className="text-xs text-muted-foreground">Save snippets automatically</p>
                            </div>
                            <button className="w-12 h-6 rounded-full bg-emerald-500 relative">
                              <span className="absolute right-1 top-1 w-4 h-4 rounded-full bg-white" />
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Theme Settings */}
                      <div className="p-6 rounded-xl bg-muted/30 border border-border">
                        <h3 className="font-semibold text-foreground mb-4">Appearance</h3>
                        <div className="grid grid-cols-3 gap-3">
                          {['Dark', 'Light', 'System'].map((theme) => (
                            <button
                              key={theme}
                              className={`p-3 rounded-xl border text-center transition-all ${
                                theme === 'Dark'
                                  ? 'bg-violet-600/20 border-violet-500 text-foreground'
                                  : 'bg-muted/50 border-border text-muted-foreground hover:border-muted-foreground/50'
                              }`}
                            >
                              {theme}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Danger Zone */}
                      <div className="p-6 rounded-xl bg-destructive/5 border border-destructive/20">
                        <h3 className="font-semibold text-destructive mb-4">Danger Zone</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          These actions are irreversible. Please be certain.
                        </p>
                        <div className="flex gap-3">
                          <button className="px-4 py-2 rounded-lg border border-destructive/30 text-destructive text-sm hover:bg-destructive/10 transition-colors flex items-center gap-2">
                            <Trash2 className="w-4 h-4" /> Delete All Snippets
                          </button>
                          <button className="px-4 py-2 rounded-lg border border-destructive/30 text-destructive text-sm hover:bg-destructive/10 transition-colors flex items-center gap-2">
                            <UserX className="w-4 h-4" /> Delete Account
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
