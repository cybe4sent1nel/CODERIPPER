# 🔧 Dependency Detection & Management

## Overview
CodeRipper now includes **automatic dependency detection** for React and Vue components! When you write code that uses external packages, the editor will:

✅ **Detect** required npm packages automatically  
✅ **Show** which dependencies your code needs  
✅ **Provide** CDN links for browser-compatible packages  
✅ **Generate** installation instructions (npm, yarn, pnpm)  
✅ **Warn** about packages that may not work without installation

---

## 📦 How It Works

### 1. **Automatic Detection**
The dependency checker analyzes your code using pattern matching to identify:
- Import statements (`import ... from 'package'`)
- Common library usage patterns
- Framework-specific dependencies

### 2. **Free API Integration**
We use **npms.io API** (completely free, no auth required) to:
- Check if packages exist
- Get latest version information
- Show package descriptions
- Display download statistics

### 3. **CDN Support**
For browser-compatible packages, we provide CDN URLs from:
- **jsdelivr.net** - Fast, reliable CDN
- Auto-loads popular packages (React, Vue, Axios, Lodash, etc.)
- No npm installation needed for web development!

---

## 🎯 Supported Packages

### React Packages (Auto-Detected)
- `react-router-dom` - Routing
- `react-hook-form` - Forms
- `@tanstack/react-query` - Data fetching
- `axios` - HTTP client
- `zustand`, `jotai`, `recoil` - State management
- `framer-motion` - Animations
- `@headlessui/react` - UI components
- `@radix-ui/react-*` - Primitives
- `date-fns` - Date utilities
- `lodash` - Utility functions
- `clsx`, `classnames` - CSS utilities
- `react-icons` - Icon library

### Vue Packages (Auto-Detected)
- `vue-router` - Routing
- `pinia` - State management (recommended)
- `vuex` - State management (legacy)
- `@vueuse/core` - Composition utilities
- `axios` - HTTP client
- `element-plus` - UI components
- `vuetify` - Material Design
- `@headlessui/vue` - UI components

---

## 🚀 Usage Examples

### Example 1: React with React Router
```jsx
import { BrowserRouter, Route, Link } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>
      </nav>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
    </BrowserRouter>
  );
}
```

**CodeRipper will show:**
```
📦 Detected 1 external dependencies
💡 In CodeRipper, we auto-load popular packages via CDN
⚠️ 1 packages may not work without npm install:
   - react-router-dom@^6.20.0
```

### Example 2: React with Axios
```jsx
import axios from 'axios';
import { useState, useEffect } from 'react';

function App() {
  const [data, setData] = useState(null);
  
  useEffect(() => {
    axios.get('https://api.example.com/data')
      .then(res => setData(res.data));
  }, []);
  
  return <div>{data?.message}</div>;
}
```

**CodeRipper will show:**
```
📦 Detected 1 external dependencies
💡 In CodeRipper, we auto-load popular packages via CDN
✅ 1 packages available via CDN (auto-loaded)
```

### Example 3: Vue with Pinia
```vue
<template>
  <div>{{ count }}</div>
  <button @click="increment">+</button>
</template>

<script>
import { defineStore } from 'pinia';

const useCounterStore = defineStore('counter', {
  state: () => ({ count: 0 }),
  actions: {
    increment() { this.count++ }
  }
});

export default {
  setup() {
    const counter = useCounterStore();
    return { count: counter.count, increment: counter.increment };
  }
}
</script>
```

**CodeRipper will show:**
```
📦 Detected 1 external dependencies
💡 In CodeRipper, we auto-load popular packages via CDN
⚠️ 1 packages may not work without npm install:
   - pinia@^2.1.7
```

---

## 📊 Dependency Info Panel

When dependencies are detected, you'll see an **information button** in the Live Preview header:

```
┌─────────────────────────────────────────────────┐
│ 🔧 Live Preview (REACT)  [ℹ️ 2 dependencies]  │
├─────────────────────────────────────────────────┤
│ 📦 External Dependencies Detected              │
│                                                  │
│ 📦 Detected 2 external dependencies             │
│ 💡 In CodeRipper, we auto-load via CDN         │
│ ✅ 1 packages available via CDN (auto-loaded)   │
│ ⚠️ 1 packages may not work without npm install │
│    - react-router-dom@^6.20.0                   │
│                                                  │
│ ▶ Show Installation Instructions               │
└─────────────────────────────────────────────────┘
```

---

## 🛠️ Installation Instructions

Click **"Show Installation Instructions"** to see:

```bash
📦 Installation Instructions:

# Using npm:
npm install axios@^1.6.5 react-router-dom@^6.20.0

# Using yarn:
yarn add axios@^1.6.5 react-router-dom@^6.20.0

# Using pnpm:
pnpm add axios@^1.6.5 react-router-dom@^6.20.0

🌐 CDN URLs (for browser):
<!-- axios -->
<script src="https://cdn.jsdelivr.net/npm/axios@1/dist/axios.min.js"></script>
```

---

## 🎨 Visual Indicators

### 🟢 CDN Available (Auto-loaded)
Packages with CDN support work immediately in CodeRipper's live preview!

### 🟡 Installation Required
Some packages need npm installation and won't work in browser preview.

### 🔴 Unknown Package
If a package isn't recognized, you'll see a generic suggestion.

---

## 🔍 Behind the Scenes

### Detection Algorithm
1. **Parse Code**: Extract import statements
2. **Pattern Match**: Check against 40+ known patterns
3. **Confidence Score**: Calculate match accuracy
4. **CDN Lookup**: Find browser-compatible versions
5. **Generate Instructions**: Create npm/yarn/pnpm commands

### API Integration (npms.io)
```typescript
// Check if package exists
const response = await fetch(`https://api.npms.io/v2/package/react-router-dom`);
const data = await response.json();

// Returns:
{
  "collected": {
    "metadata": {
      "version": "6.20.0",
      "description": "Declarative routing for React",
      ...
    },
    "npm": {
      "downloads": [{ "count": 12000000 }]
    }
  }
}
```

---

## 💡 Pro Tips

### 1. Use CDN-Compatible Packages
Prefer packages with CDN support for instant preview:
- ✅ `axios` - HTTP client
- ✅ `lodash` - Utilities
- ✅ `moment` - Dates
- ✅ `chart.js` - Charts
- ✅ `d3` - Data visualization

### 2. Check Before Installing
Always review the dependency panel before running npm install.

### 3. Use Version Ranges
We suggest latest stable versions, but you can adjust:
```bash
npm install package@latest  # Latest version
npm install package@^1.0.0  # Compatible with 1.x
npm install package@~1.0.0  # Compatible with 1.0.x
```

### 4. Browser vs Node.js
Some packages are Node.js-only and won't work in browser:
- ❌ `fs` - File system (Node.js only)
- ❌ `path` - Path utilities (Node.js only)
- ✅ `axios` - Works everywhere!
- ✅ `lodash` - Works everywhere!

---

## 🚫 Limitations

### Current Limitations:
1. **Pattern-Based Detection**: May miss dynamic imports
2. **CDN Availability**: Not all packages have CDN builds
3. **Version Specificity**: Uses latest stable by default
4. **Monorepo Packages**: May not detect workspace dependencies

### Future Improvements:
- [ ] Parse `package.json` if provided
- [ ] Support for dynamic imports
- [ ] Custom CDN URL configuration
- [ ] Offline package database
- [ ] Tree-shaking analysis
- [ ] Bundle size estimates

---

## 🎯 Best Practices

### For Users:
1. ✅ Review dependency warnings before running code
2. ✅ Use CDN-compatible packages when possible
3. ✅ Install packages locally for production apps
4. ✅ Keep dependencies up to date

### For CodeRipper:
1. ✅ Auto-load popular CDN packages
2. ✅ Show clear warnings for missing dependencies
3. ✅ Provide installation instructions
4. ✅ Cache dependency information

---

## 📚 Additional Resources

### Package Registries:
- **npm**: https://www.npmjs.com/
- **yarn**: https://yarnpkg.com/
- **pnpm**: https://pnpm.io/

### CDN Providers:
- **jsdelivr**: https://www.jsdelivr.com/
- **unpkg**: https://unpkg.com/
- **cdnjs**: https://cdnjs.com/

### Package Search:
- **npms.io**: https://npms.io/ (What we use!)
- **bundlephobia**: https://bundlephobia.com/ (Bundle size)
- **npm trends**: https://npmtrends.com/ (Compare packages)

---

## 🤝 Contributing

Want to add more package patterns? Edit:
```typescript
// web/lib/dependencyChecker.ts

const REACT_PATTERNS = [
  { 
    pattern: /import\s+.*\s+from\s+['"]your-package['"]/g,
    package: 'your-package',
    version: '^1.0.0',
    cdnUrl: 'https://cdn.jsdelivr.net/npm/your-package@1/dist/index.min.js'
  },
  // Add more patterns...
]
```

---

## ❓ FAQ

**Q: Why doesn't my package work in the preview?**  
A: Some packages require npm installation and don't have CDN builds. Check the dependency panel for warnings.

**Q: Can I use my own package.json?**  
A: Not yet! This feature is planned for future releases.

**Q: How do I know which version to use?**  
A: We suggest the latest stable version. Check npm for specific version info.

**Q: Does this work offline?**  
A: CDN packages require internet. npm packages work offline after installation.

**Q: Can I disable dependency detection?**  
A: Currently no, but this is a planned feature.

---

## 🎉 Summary

CodeRipper's dependency detection makes it **easier than ever** to:
- ✨ Understand what packages your code needs
- 🚀 Get started quickly with CDN-loaded packages
- 📦 Install dependencies correctly with generated commands
- 🎯 Avoid "package not found" errors

No more guessing! CodeRipper tells you exactly what you need. 🔥

---

*Happy coding with smart dependency detection!* 📦✨
