// Enhanced subscription plans with comprehensive features
export const SUBSCRIPTION_PLANS = {
  free: {
    id: 'free',
    name: 'Free',
    price: 0,
    period: 'forever',
    description: 'Perfect for learning and small projects',
    features: [
      { name: '10 code executions per day', included: true },
      { name: '5 saved snippets', included: true },
      { name: 'Basic AI code explanation', included: true },
      { name: '7 programming languages', included: true },
      { name: 'Public snippets only', included: true },
      { name: 'Community support', included: true },
      { name: 'Ads supported', included: true },
      { name: 'Advanced AI features', included: false },
      { name: 'Private snippets', included: false },
      { name: 'Code collaboration', included: false },
      { name: 'Version history', included: false },
      { name: 'API access', included: false },
    ],
    limits: {
      executionsPerDay: 10,
      savedSnippets: 5,
      collaborators: 0,
      fileSize: 50000, // 50KB
      apiCalls: 0,
    },
    buttonText: 'Get Started Free',
    highlighted: false,
    badge: null,
  },
  pro: {
    id: 'pro',
    name: 'Pro',
    price: 9.99,
    yearlyPrice: 99.99, // Save ~17%
    period: 'month',
    description: 'Best for professional developers',
    features: [
      { name: 'Unlimited code executions', included: true },
      { name: 'Unlimited saved snippets', included: true },
      { name: 'Full AI assistant suite', included: true },
      { name: 'All 15+ programming languages', included: true },
      { name: 'Private & public snippets', included: true },
      { name: 'Priority email support', included: true },
      { name: 'No ads', included: true },
      { name: 'Code optimization AI', included: true },
      { name: 'Security analysis AI', included: true },
      { name: 'Version history (30 days)', included: true },
      { name: 'Export to multiple formats', included: true },
      { name: 'Custom themes', included: true },
    ],
    limits: {
      executionsPerDay: -1, // Unlimited
      savedSnippets: -1,
      collaborators: 5,
      fileSize: 500000, // 500KB
      apiCalls: 1000,
    },
    buttonText: 'Start 7-Day Free Trial',
    highlighted: true,
    badge: 'Most Popular',
  },
  team: {
    id: 'team',
    name: 'Team',
    price: 29.99,
    yearlyPrice: 299.99,
    period: 'month',
    description: 'Perfect for development teams',
    features: [
      { name: 'Everything in Pro', included: true },
      { name: 'Real-time collaboration', included: true },
      { name: 'Team workspace', included: true },
      { name: 'Admin dashboard', included: true },
      { name: 'SSO/SAML authentication', included: true },
      { name: 'Priority chat support', included: true },
      { name: 'Version history (1 year)', included: true },
      { name: 'Code review workflows', included: true },
      { name: 'Team analytics', included: true },
      { name: 'Custom integrations', included: true },
      { name: 'API access (10K calls/mo)', included: true },
      { name: 'Webhook notifications', included: true },
    ],
    limits: {
      executionsPerDay: -1,
      savedSnippets: -1,
      collaborators: 50,
      fileSize: 2000000, // 2MB
      apiCalls: 10000,
    },
    buttonText: 'Start Team Trial',
    highlighted: false,
    badge: 'Best Value',
  },
  enterprise: {
    id: 'enterprise',
    name: 'Enterprise',
    price: null, // Custom pricing
    period: 'custom',
    description: 'For large organizations',
    features: [
      { name: 'Everything in Team', included: true },
      { name: 'Unlimited team members', included: true },
      { name: 'On-premise deployment', included: true },
      { name: 'Custom SLA', included: true },
      { name: 'Dedicated support manager', included: true },
      { name: '24/7 phone support', included: true },
      { name: 'Unlimited version history', included: true },
      { name: 'White-label options', included: true },
      { name: 'Custom AI model training', included: true },
      { name: 'Compliance (SOC2, HIPAA)', included: true },
      { name: 'Unlimited API access', included: true },
      { name: 'Custom integrations', included: true },
    ],
    limits: {
      executionsPerDay: -1,
      savedSnippets: -1,
      collaborators: -1,
      fileSize: -1,
      apiCalls: -1,
    },
    buttonText: 'Contact Sales',
    highlighted: false,
    badge: 'Custom',
  },
} as const;

// AI Features Configuration
export const AI_FEATURES = {
  explain: {
    id: 'explain',
    name: 'Code Explanation',
    description: 'Get detailed explanations of your code',
    icon: '💡',
    tier: 'free',
  },
  optimize: {
    id: 'optimize',
    name: 'Code Optimization',
    description: 'AI suggestions for performance improvements',
    icon: '⚡',
    tier: 'pro',
  },
  debug: {
    id: 'debug',
    name: 'Smart Debugging',
    description: 'AI-powered bug detection and fixes',
    icon: '🐛',
    tier: 'pro',
  },
  security: {
    id: 'security',
    name: 'Security Analysis',
    description: 'Detect vulnerabilities and security issues',
    icon: '🔒',
    tier: 'pro',
  },
  documentation: {
    id: 'documentation',
    name: 'Auto Documentation',
    description: 'Generate comprehensive code documentation',
    icon: '📝',
    tier: 'pro',
  },
  testing: {
    id: 'testing',
    name: 'Test Generation',
    description: 'Auto-generate unit tests for your code',
    icon: '🧪',
    tier: 'pro',
  },
  translate: {
    id: 'translate',
    name: 'Code Translation',
    description: 'Convert code between programming languages',
    icon: '🔄',
    tier: 'pro',
  },
  review: {
    id: 'review',
    name: 'Code Review',
    description: 'Comprehensive AI code review with scoring',
    icon: '⭐',
    tier: 'team',
  },
  refactor: {
    id: 'refactor',
    name: 'Smart Refactoring',
    description: 'Intelligent code restructuring suggestions',
    icon: '🔧',
    tier: 'pro',
  },
  complete: {
    id: 'complete',
    name: 'AI Completion',
    description: 'Intelligent code completion and suggestions',
    icon: '✨',
    tier: 'pro',
  },
} as const;

// Snippet Categories
export const SNIPPET_CATEGORIES = [
  { id: 'algorithm', name: 'Algorithms', icon: '🧮', color: '#8B5CF6' },
  { id: 'data-structure', name: 'Data Structures', icon: '📊', color: '#06B6D4' },
  { id: 'api', name: 'API & Web', icon: '🌐', color: '#10B981' },
  { id: 'database', name: 'Database', icon: '🗃️', color: '#F59E0B' },
  { id: 'utility', name: 'Utilities', icon: '🛠️', color: '#EC4899' },
  { id: 'ui', name: 'UI Components', icon: '🎨', color: '#3B82F6' },
  { id: 'testing', name: 'Testing', icon: '🧪', color: '#EF4444' },
  { id: 'blockchain', name: 'Blockchain', icon: '⛓️', color: '#6366F1' },
  { id: 'ai-ml', name: 'AI/ML', icon: '🤖', color: '#14B8A6' },
  { id: 'other', name: 'Other', icon: '📁', color: '#6B7280' },
] as const;

// Achievement Badges
export const BADGES = [
  { id: 'first-code', name: 'First Steps', description: 'Run your first code', icon: '🎯', points: 10 },
  { id: 'ten-snippets', name: 'Collector', description: 'Save 10 snippets', icon: '📚', points: 50 },
  { id: 'hundred-runs', name: 'Code Runner', description: '100 code executions', icon: '🏃', points: 100 },
  { id: 'polyglot', name: 'Polyglot', description: 'Use 5 different languages', icon: '🌍', points: 75 },
  { id: 'helper', name: 'Helper', description: 'Get 10 likes on your snippets', icon: '❤️', points: 100 },
  { id: 'popular', name: 'Popular', description: 'Reach 100 views on a snippet', icon: '👀', points: 150 },
  { id: 'contributor', name: 'Contributor', description: 'Fork and improve 5 snippets', icon: '🔄', points: 200 },
  { id: 'streak-7', name: 'Weekly Warrior', description: '7-day coding streak', icon: '🔥', points: 100 },
  { id: 'streak-30', name: 'Monthly Master', description: '30-day coding streak', icon: '💎', points: 500 },
  { id: 'ai-master', name: 'AI Master', description: 'Use all AI features', icon: '🤖', points: 250 },
] as const;

// Ad Placements Configuration
export const AD_PLACEMENTS = {
  banner_top: {
    id: 'banner_top',
    size: '728x90',
    position: 'top',
    showForPlan: ['free'],
  },
  sidebar: {
    id: 'sidebar',
    size: '300x250',
    position: 'sidebar',
    showForPlan: ['free'],
  },
  inline: {
    id: 'inline',
    size: '468x60',
    position: 'inline',
    showForPlan: ['free'],
  },
  interstitial: {
    id: 'interstitial',
    size: 'fullscreen',
    position: 'modal',
    showForPlan: ['free'],
    frequency: 10, // Show every 10 executions
  },
} as const;

// Export Formats
export const EXPORT_FORMATS = [
  { id: 'file', name: 'Source File', description: 'Download as .js, .py, etc.', icon: '📄', tier: 'free' },
  { id: 'gist', name: 'GitHub Gist', description: 'Create a GitHub Gist', icon: '🐙', tier: 'free' },
  { id: 'pdf', name: 'PDF Document', description: 'Export as styled PDF', icon: '📕', tier: 'pro' },
  { id: 'markdown', name: 'Markdown', description: 'Export with syntax highlighting', icon: '📝', tier: 'pro' },
  { id: 'image', name: 'Image (PNG/SVG)', description: 'Beautiful code screenshot', icon: '🖼️', tier: 'pro' },
  { id: 'embed', name: 'Embed Code', description: 'Embeddable iframe/widget', icon: '🔗', tier: 'pro' },
  { id: 'zip', name: 'Project ZIP', description: 'Full project with dependencies', icon: '📦', tier: 'team' },
] as const;

// Keyboard Shortcuts
export const KEYBOARD_SHORTCUTS = [
  { keys: ['Ctrl', 'Enter'], action: 'Run Code', description: 'Execute current code' },
  { keys: ['Ctrl', 'S'], action: 'Save Snippet', description: 'Save current snippet' },
  { keys: ['Ctrl', 'Shift', 'S'], action: 'Share', description: 'Open share dialog' },
  { keys: ['Ctrl', 'Shift', 'F'], action: 'Format', description: 'Format code' },
  { keys: ['Ctrl', 'Space'], action: 'AI Complete', description: 'Trigger AI completion' },
  { keys: ['Ctrl', 'Shift', 'E'], action: 'Explain', description: 'Explain selected code' },
  { keys: ['Ctrl', 'Shift', 'O'], action: 'Optimize', description: 'Optimize code with AI' },
  { keys: ['Ctrl', '/'], action: 'Comment', description: 'Toggle comment' },
  { keys: ['Ctrl', 'D'], action: 'Duplicate', description: 'Duplicate line' },
  { keys: ['F11'], action: 'Fullscreen', description: 'Toggle fullscreen editor' },
] as const;

// Theme Options
export const THEMES = {
  editor: [
    { id: 'vs-dark', name: 'Dark (Default)', preview: '#1e1e1e' },
    { id: 'vs', name: 'Light', preview: '#ffffff' },
    { id: 'hc-black', name: 'High Contrast Dark', preview: '#000000' },
    { id: 'monokai', name: 'Monokai', preview: '#272822' },
    { id: 'dracula', name: 'Dracula', preview: '#282a36' },
    { id: 'nord', name: 'Nord', preview: '#2e3440' },
    { id: 'github-dark', name: 'GitHub Dark', preview: '#0d1117' },
    { id: 'one-dark', name: 'One Dark Pro', preview: '#282c34' },
    { id: 'synthwave', name: 'Synthwave 84', preview: '#262335' },
    { id: 'material', name: 'Material', preview: '#263238' },
  ],
  ui: [
    { id: 'system', name: 'System', description: 'Follow system preference' },
    { id: 'light', name: 'Light', description: 'Light mode' },
    { id: 'dark', name: 'Dark', description: 'Dark mode' },
  ],
} as const;

// Social Share Options
export const SOCIAL_SHARE_OPTIONS = [
  { id: 'twitter', name: 'Twitter/X', icon: '𝕏', color: '#000000' },
  { id: 'linkedin', name: 'LinkedIn', icon: 'in', color: '#0A66C2' },
  { id: 'reddit', name: 'Reddit', icon: '🔴', color: '#FF4500' },
  { id: 'facebook', name: 'Facebook', icon: 'f', color: '#1877F2' },
  { id: 'hackernews', name: 'Hacker News', icon: 'Y', color: '#FF6600' },
  { id: 'devto', name: 'Dev.to', icon: '⌨️', color: '#0A0A0A' },
] as const;

// Sample Public Snippets for Explore Page
export const FEATURED_SNIPPETS = [
  {
    id: 'featured-1',
    title: 'Quick Sort Algorithm',
    description: 'Efficient sorting algorithm with O(n log n) average time complexity',
    language: 'python',
    author: 'CodeMaster',
    likes: 1234,
    views: 5678,
    tags: ['algorithm', 'sorting', 'interview'],
  },
  {
    id: 'featured-2',
    title: 'React Custom Hook - useLocalStorage',
    description: 'Persist state in localStorage with this custom React hook',
    language: 'typescript',
    author: 'ReactDev',
    likes: 987,
    views: 4321,
    tags: ['react', 'hooks', 'storage'],
  },
  {
    id: 'featured-3',
    title: 'Solidity ERC-20 Token',
    description: 'Complete implementation of ERC-20 token standard',
    language: 'solidity',
    author: 'Web3Builder',
    likes: 756,
    views: 3210,
    tags: ['blockchain', 'ethereum', 'token'],
  },
] as const;
