'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/router';
import { NextSeo } from 'next-seo';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';
import EnterpriseHeader from '@/components/EnterpriseHeader';
import { 
  User, Mail, MapPin, Link2, Github, Twitter, Linkedin, 
  Calendar, Trophy, Flame, Code2, Star, Award, Shield,
  Edit3, Camera, Save, X, CheckCircle, Clock, Target,
  Zap, Crown, Medal, Sparkles, TrendingUp, Activity
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

// Badge definitions with tiers
const BADGE_DEFINITIONS: Record<string, { name: string; description: string; icon: any; tier: string; color: string }> = {
  'first-code': { name: 'First Steps', description: 'Ran your first code', icon: Code2, tier: 'bronze', color: 'from-amber-600 to-amber-800' },
  'code-warrior': { name: 'Code Warrior', description: '100 executions', icon: Zap, tier: 'silver', color: 'from-gray-400 to-gray-600' },
  'code-master': { name: 'Code Master', description: '500 executions', icon: Crown, tier: 'gold', color: 'from-yellow-400 to-yellow-600' },
  'code-legend': { name: 'Code Legend', description: '1000 executions', icon: Trophy, tier: 'platinum', color: 'from-cyan-400 to-cyan-600' },
  'streak-starter': { name: 'Streak Starter', description: '3-day streak', icon: Flame, tier: 'bronze', color: 'from-amber-600 to-amber-800' },
  'streak-warrior': { name: 'Streak Warrior', description: '7-day streak', icon: Flame, tier: 'silver', color: 'from-gray-400 to-gray-600' },
  'streak-master': { name: 'Streak Master', description: '30-day streak', icon: Flame, tier: 'gold', color: 'from-yellow-400 to-yellow-600' },
  'polyglot': { name: 'Polyglot', description: 'Used 5 languages', icon: Code2, tier: 'silver', color: 'from-gray-400 to-gray-600' },
  'ai-enthusiast': { name: 'AI Enthusiast', description: 'Used AI features 10 times', icon: Sparkles, tier: 'silver', color: 'from-purple-400 to-purple-600' },
  'speed-demon': { name: 'Speed Demon', description: 'Sub-100ms execution', icon: Zap, tier: 'gold', color: 'from-yellow-400 to-yellow-600' },
  'bug-hunter': { name: 'Bug Hunter', description: 'Fixed 10 errors', icon: Target, tier: 'silver', color: 'from-gray-400 to-gray-600' },
  'early-adopter': { name: 'Early Adopter', description: 'Joined during beta', icon: Star, tier: 'platinum', color: 'from-cyan-400 to-cyan-600' },
  'premium-member': { name: 'Premium Member', description: 'Upgraded to Pro', icon: Crown, tier: 'diamond', color: 'from-violet-400 to-violet-600' },
  'snippet-master': { name: 'Snippet Master', description: 'Saved 20 snippets', icon: Code2, tier: 'gold', color: 'from-yellow-400 to-yellow-600' },
  'community-hero': { name: 'Community Hero', description: 'Shared 10 public snippets', icon: Medal, tier: 'gold', color: 'from-yellow-400 to-yellow-600' },
};

const TIER_COLORS = {
  bronze: 'from-amber-600 to-amber-800 shadow-amber-500/30',
  silver: 'from-gray-300 to-gray-500 shadow-gray-400/30',
  gold: 'from-yellow-400 to-yellow-600 shadow-yellow-500/30',
  platinum: 'from-cyan-300 to-cyan-500 shadow-cyan-400/30',
  diamond: 'from-violet-400 to-fuchsia-500 shadow-violet-500/30',
};

export default function ProfilePage() {
  const router = useRouter();
  const { user, isAuthenticated, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: '',
    username: '',
    bio: '',
    location: '',
    website: '',
    github: '',
    twitter: '',
    linkedin: '',
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    if (user) {
      setEditForm({
        name: user.name || '',
        username: user.username || '',
        bio: user.bio || '',
        location: user.location || '',
        website: user.website || '',
        github: user.socialLinks?.github || '',
        twitter: user.socialLinks?.twitter || '',
        linkedin: user.socialLinks?.linkedin || '',
      });
    }
  }, [user]);

  const handleSave = async () => {
    setIsSaving(true);
    await updateProfile({
      name: editForm.name,
      username: editForm.username,
      bio: editForm.bio,
      location: editForm.location,
      website: editForm.website,
      socialLinks: {
        github: editForm.github,
        twitter: editForm.twitter,
        linkedin: editForm.linkedin,
      },
    });
    setIsSaving(false);
    setIsEditing(false);
  };

  if (!user) {
    return null;
  }

  const memberSince = new Date(user.createdAt).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });

  const stats = [
    { label: 'Total Runs', value: user.totalExecutions, icon: Code2, color: 'text-blue-500' },
    { label: 'Current Streak', value: `${user.streakDays} days`, icon: Flame, color: 'text-orange-500' },
    { label: 'Longest Streak', value: `${user.longestStreak || user.streakDays} days`, icon: Trophy, color: 'text-yellow-500' },
    { label: 'Points', value: user.totalPoints || 0, icon: Star, color: 'text-purple-500' },
    { label: 'Global Rank', value: `#${user.rank || '999+'}`, icon: TrendingUp, color: 'text-green-500' },
    { label: 'Snippets', value: user.snippetsCount, icon: Code2, color: 'text-cyan-500' },
  ];

  return (
    <>
      <NextSeo
        title={`${user.name} (@${user.username}) - CodeRipper Profile`}
        description={`${user.name}'s coding profile on CodeRipper. ${user.bio || 'Join the coding community!'}`}
      />

      <div className="min-h-screen bg-gradient-to-br from-background via-background to-background">
        <EnterpriseHeader />

        <main className="container mx-auto px-4 py-8 max-w-5xl">
          {/* Profile Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <Card className="overflow-hidden">
              {/* Cover Background */}
              <div className="h-32 bg-gradient-to-r from-violet-600 via-purple-600 to-blue-600 relative">
                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20" />
              </div>

              <CardContent className="relative px-6 pb-6">
                {/* Avatar */}
                <div className="absolute -top-16 left-6">
                  <div className="relative group">
                    <div className="absolute -inset-1.5 bg-gradient-to-r from-violet-500 via-purple-500 to-blue-500 rounded-full blur opacity-75 group-hover:opacity-100 transition-opacity animate-pulse" />
                    <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-background shadow-2xl">
                      <Image
                        src={user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`}
                        alt={user.name}
                        width={128}
                        height={128}
                        className="w-full h-full object-cover"
                        unoptimized
                      />
                    </div>
                    {user.isPremium && (
                      <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-gradient-to-r from-yellow-400 to-amber-500 flex items-center justify-center shadow-lg">
                        <Crown className="w-4 h-4 text-white" />
                      </div>
                    )}
                  </div>
                </div>

                {/* Edit Button */}
                <div className="flex justify-end pt-4">
                  {isEditing ? (
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setIsEditing(false)}
                      >
                        <X className="w-4 h-4 mr-1" />
                        Cancel
                      </Button>
                      <Button
                        size="sm"
                        onClick={handleSave}
                        disabled={isSaving}
                      >
                        <Save className="w-4 h-4 mr-1" />
                        {isSaving ? 'Saving...' : 'Save'}
                      </Button>
                    </div>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsEditing(true)}
                    >
                      <Edit3 className="w-4 h-4 mr-1" />
                      Edit Profile
                    </Button>
                  )}
                </div>

                {/* User Info */}
                <div className="mt-8 space-y-4">
                  {isEditing ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">Full Name</label>
                          <input
                            type="text"
                            value={editForm.name}
                            onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                            className="w-full mt-1 px-3 py-2 rounded-lg bg-muted border border-border focus:outline-none focus:ring-2 focus:ring-violet-500"
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">Username</label>
                          <input
                            type="text"
                            value={editForm.username}
                            onChange={(e) => setEditForm({ ...editForm, username: e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, '') })}
                            className="w-full mt-1 px-3 py-2 rounded-lg bg-muted border border-border focus:outline-none focus:ring-2 focus:ring-violet-500"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Bio</label>
                        <textarea
                          value={editForm.bio}
                          onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                          rows={3}
                          className="w-full mt-1 px-3 py-2 rounded-lg bg-muted border border-border focus:outline-none focus:ring-2 focus:ring-violet-500 resize-none"
                          placeholder="Tell us about yourself..."
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">Location</label>
                          <input
                            type="text"
                            value={editForm.location}
                            onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                            className="w-full mt-1 px-3 py-2 rounded-lg bg-muted border border-border focus:outline-none focus:ring-2 focus:ring-violet-500"
                            placeholder="City, Country"
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">Website</label>
                          <input
                            type="url"
                            value={editForm.website}
                            onChange={(e) => setEditForm({ ...editForm, website: e.target.value })}
                            className="w-full mt-1 px-3 py-2 rounded-lg bg-muted border border-border focus:outline-none focus:ring-2 focus:ring-violet-500"
                            placeholder="https://yoursite.com"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">GitHub</label>
                          <input
                            type="text"
                            value={editForm.github}
                            onChange={(e) => setEditForm({ ...editForm, github: e.target.value })}
                            className="w-full mt-1 px-3 py-2 rounded-lg bg-muted border border-border focus:outline-none focus:ring-2 focus:ring-violet-500"
                            placeholder="username"
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">Twitter</label>
                          <input
                            type="text"
                            value={editForm.twitter}
                            onChange={(e) => setEditForm({ ...editForm, twitter: e.target.value })}
                            className="w-full mt-1 px-3 py-2 rounded-lg bg-muted border border-border focus:outline-none focus:ring-2 focus:ring-violet-500"
                            placeholder="username"
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">LinkedIn</label>
                          <input
                            type="text"
                            value={editForm.linkedin}
                            onChange={(e) => setEditForm({ ...editForm, linkedin: e.target.value })}
                            className="w-full mt-1 px-3 py-2 rounded-lg bg-muted border border-border focus:outline-none focus:ring-2 focus:ring-violet-500"
                            placeholder="username"
                          />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div>
                        <h1 className="text-2xl font-bold">{user.name}</h1>
                        <p className="text-muted-foreground">@{user.username}</p>
                      </div>

                      {user.bio && (
                        <p className="text-foreground/80">{user.bio}</p>
                      )}

                      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                        {user.location && (
                          <span className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            {user.location}
                          </span>
                        )}
                        {user.website && (
                          <a
                            href={user.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 hover:text-violet-500 transition-colors"
                          >
                            <Link2 className="w-4 h-4" />
                            Website
                          </a>
                        )}
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          Joined {memberSince}
                        </span>
                      </div>

                      {/* Social Links */}
                      <div className="flex gap-2">
                        {user.socialLinks?.github && (
                          <a
                            href={`https://github.com/${user.socialLinks.github}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 rounded-lg bg-muted hover:bg-accent transition-colors"
                          >
                            <Github className="w-5 h-5" />
                          </a>
                        )}
                        {user.socialLinks?.twitter && (
                          <a
                            href={`https://twitter.com/${user.socialLinks.twitter}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 rounded-lg bg-muted hover:bg-accent transition-colors"
                          >
                            <Twitter className="w-5 h-5" />
                          </a>
                        )}
                        {user.socialLinks?.linkedin && (
                          <a
                            href={`https://linkedin.com/in/${user.socialLinks.linkedin}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 rounded-lg bg-muted hover:bg-accent transition-colors"
                          >
                            <Linkedin className="w-5 h-5" />
                          </a>
                        )}
                      </div>
                    </>
                  )}
                </div>

                {/* Plan Badge */}
                <div className="absolute top-4 left-40">
                  <Badge
                    className={`${
                      user.isPremium
                        ? 'bg-gradient-to-r from-yellow-400 to-amber-500 text-black'
                        : 'bg-muted'
                    }`}
                  >
                    {user.isPremium ? (
                      <>
                        <Crown className="w-3 h-3 mr-1" />
                        Pro
                      </>
                    ) : (
                      'Free'
                    )}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Stats Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 + index * 0.05 }}
              >
                <Card className="text-center p-4 hover:shadow-lg transition-shadow">
                  <stat.icon className={`w-6 h-6 mx-auto mb-2 ${stat.color}`} />
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          {/* Badges Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-yellow-500" />
                  Achievements & Badges
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                  {user.badges.map((badgeId, index) => {
                    const badge = BADGE_DEFINITIONS[badgeId];
                    if (!badge) return null;
                    const IconComponent = badge.icon;
                    const tierColor = TIER_COLORS[badge.tier as keyof typeof TIER_COLORS];

                    return (
                      <motion.div
                        key={badgeId}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3 + index * 0.05 }}
                        className="relative group"
                      >
                        <div className={`p-4 rounded-xl bg-gradient-to-br ${tierColor} shadow-lg text-center`}>
                          <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-white/20 flex items-center justify-center">
                            <IconComponent className="w-6 h-6 text-white" />
                          </div>
                          <p className="text-sm font-bold text-white">{badge.name}</p>
                          <p className="text-xs text-white/80 capitalize">{badge.tier}</p>
                        </div>
                        
                        {/* Tooltip */}
                        <div className="absolute -top-12 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-popover border border-border rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-opacity z-10 whitespace-nowrap pointer-events-none">
                          <p className="text-xs">{badge.description}</p>
                        </div>
                      </motion.div>
                    );
                  })}

                  {/* Locked Badges */}
                  {Object.entries(BADGE_DEFINITIONS)
                    .filter(([id]) => !user.badges.includes(id))
                    .slice(0, 5)
                    .map(([badgeId, badge], index) => {
                      const IconComponent = badge.icon;
                      return (
                        <motion.div
                          key={badgeId}
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.5 + index * 0.05 }}
                          className="relative group"
                        >
                          <div className="p-4 rounded-xl bg-muted/50 border border-dashed border-border text-center opacity-50">
                            <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-muted flex items-center justify-center">
                              <IconComponent className="w-6 h-6 text-muted-foreground" />
                            </div>
                            <p className="text-sm font-medium text-muted-foreground">{badge.name}</p>
                            <p className="text-xs text-muted-foreground">Locked</p>
                          </div>
                          
                          {/* Tooltip */}
                          <div className="absolute -top-12 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-popover border border-border rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-opacity z-10 whitespace-nowrap pointer-events-none">
                            <p className="text-xs">{badge.description}</p>
                          </div>
                        </motion.div>
                      );
                    })}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Activity Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-8"
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-green-500" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  <Code2 className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Start coding to see your activity here!</p>
                  <Button className="mt-4" onClick={() => router.push('/')}>
                    <Code2 className="w-4 h-4 mr-2" />
                    Open Editor
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </main>

        {/* Footer */}
        <footer className="border-t border-border mt-12 py-6">
          <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
            <p>© {new Date().getFullYear()} CodeRipper. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </>
  );
}
