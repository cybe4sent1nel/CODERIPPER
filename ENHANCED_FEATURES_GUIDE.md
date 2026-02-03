# 🚀 CodeRipper Enhanced Features - Setup Guide

## Overview

CodeRipper has been dramatically enhanced with professional features including:

✅ **HTML/CSS/React/Vue/SVG Support** with live preview  
✅ **Voice Coding** - Code with your voice using AI  
✅ **Project Manager** - Organize files in folders  
✅ **Figma to Code** - Convert designs to code  
✅ **GitHub Integration** - Import repos, commit, version control  
✅ **Enhanced Editor** - Better IntelliSense, shortcuts, and Monaco features  

---

## 📦 Installation & Setup

### 1. Install Dependencies

```bash
cd web
npm install
```

New dependencies added:
- `@babel/standalone` - For React/JSX transformation in live preview

### 2. Environment Variables

Create or update `.env.local` in the `web/` directory:

```env
# AI Service (optional - falls back to template-based generation)
AI_SERVICE_URL=http://localhost:8001

# Figma Integration (optional)
FIGMA_ACCESS_TOKEN=your_figma_token_here

# MongoDB (existing)
MONGODB_URI=your_mongodb_connection_string

# GitHub OAuth (optional - for production)
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
```

### 3. Start Development Server

```bash
npm run dev
```

Visit http://localhost:3000

---

## 🎨 New Features Guide

### 1. Live Preview for Web Languages

**Supported Languages:**
- HTML - Full HTML5 support with styles and scripts
- CSS - Live styling preview
- React - JSX with hooks support
- Vue - Single File Component (.vue)
- SVG - Animated SVG graphics

**How to Use:**
1. Select HTML, CSS, React, Vue, or SVG from language dropdown
2. Write your code in the editor
3. Live preview appears automatically below the editor
4. Toggle fullscreen for better viewing
5. Refresh preview if needed

**Example:**
```html
<!DOCTYPE html>
<html>
<body>
  <h1>Hello World!</h1>
  <button onclick="alert('Hi!')">Click Me</button>
</body>
</html>
```

### 2. Voice Coding

**How to Use:**
1. Click "Voice Coding" button in the toolbar
2. Allow microphone access when prompted
3. Select target language (JavaScript, Python, React, etc.)
4. Speak your requirements naturally
5. Click "Generate Code" to create code from your speech

**Example Voice Commands:**
- "Create a function to calculate fibonacci numbers"
- "Build a React component with a counter"
- "Make a form with email validation"
- "Write a Python script to sort a list"

**Browser Support:**
- ✅ Chrome
- ✅ Edge
- ✅ Safari (limited)
- ❌ Firefox (not supported)

### 3. Project Manager

**Features:**
- Create folders and files
- Organize project structure
- Switch between files
- Rename and delete items
- Visual file tree

**How to Use:**
1. Project panel appears on the left side
2. Click folder icons to create new folders/files
3. Click file names to open them in the editor
4. Right-click or use buttons to rename/delete
5. Drag and drop support (coming soon)

**Keyboard Shortcuts:**
- `Ctrl+N` - New file
- `Ctrl+Shift+N` - New folder
- `F2` - Rename selected
- `Delete` - Delete selected

### 4. Figma to Code

**How to Use:**
1. Open your design in Figma
2. Copy the share link (File > Share > Copy link)
3. Click "Figma to Code" button in CodeRipper
4. Paste the Figma URL
5. Select output framework (HTML/React/Vue)
6. Click "Convert to Code"

**What You Get:**
- Pixel-perfect responsive layouts
- Clean, production-ready code
- Modern CSS (Flexbox, Grid)
- Component-based structure
- Accessibility features

**Setup Figma Token:**
1. Go to Figma > Account Settings
2. Generate Personal Access Token
3. Add to `.env.local` as `FIGMA_ACCESS_TOKEN`

### 5. GitHub Integration

**How to Use:**

**First Time Setup:**
1. Click "Connect GitHub"
2. Generate Personal Access Token:
   - Go to GitHub Settings
   - Developer settings > Personal access tokens
   - Generate new token with `repo` permissions
3. Paste token when prompted

**Import Repository:**
1. Click "GitHub" button
2. Browse your repositories
3. Click "Import" on any repo
4. Files will be loaded into Project Manager

**Commit Changes:**
1. Make changes to your files
2. Click "Commit" button
3. Enter commit message
4. Changes pushed to GitHub

**Version Control:**
- View commit history
- Branch management
- Pull requests (coming soon)

---

## ⌨️ Keyboard Shortcuts

### Editor Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl+S` | Save current file (custom save, not browser save) |
| `Ctrl+R` | Run code |
| `Ctrl+/` | Toggle comment |
| `Ctrl+D` | Duplicate line |
| `Ctrl+F` | Find in file |
| `Ctrl+H` | Find and replace |
| `Alt+↑/↓` | Move line up/down |
| `Ctrl+Shift+K` | Delete line |
| `Ctrl+Space` | Trigger IntelliSense |
| `F11` | Toggle fullscreen |

### Project Manager

| Shortcut | Action |
|----------|--------|
| `Ctrl+N` | New file |
| `Ctrl+Shift+N` | New folder |
| `F2` | Rename |
| `Delete` | Delete selected |

### Code Navigation

| Shortcut | Action |
|----------|--------|
| `Ctrl+Click` | Go to definition |
| `F12` | Go to definition |
| `Alt+F12` | Peek definition |
| `Shift+F12` | Find all references |

---

## 🧠 Enhanced IntelliSense

### Features:
- Smart autocomplete for all languages
- Parameter hints
- Quick info on hover
- Signature help
- Code snippets
- Error detection
- Syntax highlighting

### Language-Specific Features:

**JavaScript/TypeScript:**
- ES6+ features
- React/JSX support
- Node.js APIs
- Browser APIs

**Python:**
- Standard library
- Common packages
- Type hints

**HTML:**
- Tag autocomplete
- Attribute suggestions
- Emmet abbreviations

**CSS:**
- Property autocomplete
- Color picker
- Vendor prefixes

---

## 🎯 Integration with Existing Code

### Update Your Editor Component

The Editor component now accepts these new props:

```typescript
interface EditorProps {
  language: LanguageKey; // Now includes 'html', 'css', 'react', 'vue', 'svg'
  onLanguageChange: (language: LanguageKey) => void;
  showLivePreview?: boolean; // Auto-enabled for web languages
  showProjectManager?: boolean; // Show file tree
  enableVoiceCoding?: boolean; // Enable voice features
  githubIntegration?: boolean; // Enable GitHub
}
```

### Example Usage:

```tsx
import Editor from '@/components/Editor';
import LivePreview from '@/components/LivePreview';
import VoiceCoding from '@/components/VoiceCoding';
import ProjectManager from '@/components/ProjectManager';
import FigmaToCode from '@/components/FigmaToCode';
import GitHubIntegration from '@/components/GitHubIntegration';

function MyEditorPage() {
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('react');

  return (
    <div className="flex h-screen">
      {/* Project Manager Sidebar */}
      <div className="w-64">
        <ProjectManager 
          onFileSelect={(file) => {
            setCode(file.content);
            setLanguage(file.language);
          }}
        />
      </div>

      {/* Main Editor Area */}
      <div className="flex-1 flex flex-col">
        {/* Toolbar */}
        <div className="flex gap-2 p-4 border-b">
          <VoiceCoding 
            onCodeGenerated={(code, lang) => {
              setCode(code);
              setLanguage(lang);
            }}
          />
          <FigmaToCode 
            onCodeGenerated={(code, lang) => {
              setCode(code);
              setLanguage(lang);
            }}
          />
          <GitHubIntegration />
        </div>

        {/* Editor */}
        <Editor 
          language={language}
          onLanguageChange={setLanguage}
        />

        {/* Live Preview (auto-shows for web languages) */}
        {['html', 'css', 'react', 'vue', 'svg'].includes(language) && (
          <LivePreview 
            code={code}
            language={language}
          />
        )}
      </div>
    </div>
  );
}
```

---

## 🔧 Monaco Editor Configuration

The editor now has enhanced configuration for each language:

```typescript
// Auto-configured features:
{
  quickSuggestions: true,
  suggestOnTriggerCharacters: true,
  acceptSuggestionOnEnter: 'on',
  tabCompletion: 'on',
  wordBasedSuggestions: true,
  parameterHints: { enabled: true },
  autoClosingBrackets: 'always',
  autoClosingQuotes: 'always',
  formatOnPaste: true,
  formatOnType: true
}
```

---

## 🐛 Troubleshooting

### Live Preview Not Working
1. Check browser console for errors
2. Ensure code is valid (no syntax errors)
3. Try refreshing the preview
4. For React: Make sure JSX syntax is correct

### Voice Coding Not Available
1. Use Chrome or Edge browser
2. Allow microphone permissions
3. Ensure HTTPS connection (required for mic access)
4. Check browser compatibility

### GitHub Integration Issues
1. Verify Personal Access Token has `repo` permissions
2. Check token hasn't expired
3. Ensure repository is accessible
4. Try disconnecting and reconnecting

### Figma Import Failing
1. Ensure Figma link is public or accessible
2. Verify FIGMA_ACCESS_TOKEN in .env.local
3. Check Figma file permissions
4. Try with demo mode (no token required)

---

## 📝 API Endpoints

### Voice Coding
```
POST /api/ai-generate-code
Body: { prompt: string, language: string }
Response: { code: string, language: string }
```

### Figma to Code
```
POST /api/figma-to-code
Body: { url: string, framework: 'html'|'react'|'vue' }
Response: { code: string, language: string }
```

---

## 🚀 Performance Optimization

### Live Preview
- Debounced updates (300ms delay)
- Cached transformations
- Isolated iframe sandbox

### Monaco Editor
- Lazy loading for large files
- Syntax highlighting web workers
- Incremental updates

---

## 📱 Mobile Support

Current mobile features:
- ✅ Responsive editor layout
- ✅ Touch-friendly controls
- ✅ Mobile-optimized preview
- ⚠️ Voice coding (limited browser support)
- ⚠️ Project manager (limited on small screens)

---

## 🎓 Learning Resources

### Tutorials (Coming Soon)
- Building your first HTML page
- Creating React components
- Voice-to-code workflows
- Figma design system to code

### Video Guides
- Feature overview walkthrough
- Advanced editor techniques
- Project organization best practices

---

## 🔐 Security Notes

### Voice Coding
- Speech data is processed locally when possible
- Transcripts sent to AI service are not stored
- User consent required for microphone access

### GitHub Integration
- Personal Access Tokens stored locally
- Never shared with third parties
- Use fine-grained tokens when possible

### Figma Integration
- Read-only access to designs
- No write permissions required
- Tokens encrypted in storage

---

## 🤝 Contributing

Want to add more features?

1. Fork the repository
2. Create feature branch
3. Add your enhancements
4. Submit pull request

---

## 📞 Support

Having issues? Need help?

- 📧 Email: support@coderipper.dev
- 💬 Discord: Join our community
- 📖 Docs: https://docs.coderipper.dev
- 🐛 Issues: GitHub Issues

---

## 🎉 What's Next?

Coming soon:
- [ ] Real-time collaboration
- [ ] More language support (Swift, Kotlin, etc.)
- [ ] Cloud sync for projects
- [ ] VS Code extension
- [ ] Mobile apps (iOS/Android)
- [ ] Team features
- [ ] Advanced debugging tools

---

**Enjoy coding with CodeRipper! 🚀**
