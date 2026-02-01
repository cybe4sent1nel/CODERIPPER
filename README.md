<p align="center">
  <img src="LOGO-PIC.png" alt="CodeRipper Logo" width="150" height="150" />
</p>

<h1 align="center">🚀 CodeRipper</h1>

<p align="center">
  <strong>Next-Generation Online Code Compiler & AI-Powered Editor</strong>
</p>

<p align="center">
  <a href="#features">Features</a> •
  <a href="#demo">Demo</a> •
  <a href="#installation">Installation</a> •
  <a href="#deployment">Deployment</a> •
  <a href="#tech-stack">Tech Stack</a> •
  <a href="#developer">Developer</a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-14.2-black?style=for-the-badge&logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/TypeScript-5.3-blue?style=for-the-badge&logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/TailwindCSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css" alt="TailwindCSS" />
  <img src="https://img.shields.io/badge/Monaco_Editor-Latest-purple?style=for-the-badge" alt="Monaco Editor" />
</p>

---

## ✨ Features

### 🎯 Core Features
- **Multi-Language Support** - Python, JavaScript, TypeScript, Java, C++, C, Go, Rust, Ruby, PHP, Swift, Kotlin, Scala, R, and more
- **AI-Powered Assistance** - Code explanation, optimization, debugging, review, and comment generation
- **Real-Time Code Execution** - Execute code instantly with the Piston API
- **Monaco Editor** - VS Code's powerful editor with IntelliSense, syntax highlighting, and more

### 🎮 Gamification
- **Global Leaderboard** - Compete with developers worldwide
- **Daily Challenges** - AI-generated coding challenges
- **Achievement Badges** - 21 unique achievements across 5 tiers (Bronze → Diamond)
- **Streak System** - Track your coding consistency

### 🎨 UI/UX
- **Dark/Light Mode** - Beautiful theme switching
- **Responsive Design** - Works on desktop, tablet, and mobile
- **Smooth Animations** - Powered by Framer Motion
- **Keyboard Shortcuts** - Boost your productivity

### 💼 Enterprise Features
- **Code Snippets** - Save and share your code
- **User Authentication** - Secure login system
- **Premium Tiers** - Pro features for power users

---

## 🖥️ Demo

Visit [CodeRipper](https://coderipper.dev) to try it out!

---

## 🚀 Installation

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Go 1.20+ (optional, for local exec-engine)

### Quick Start

```bash
# Clone the repository
git clone https://github.com/fahadkhan/coderipper.git
cd coderipper

# Install dependencies
npm install
cd web && npm install

# Set up environment variables
cp web/.env.example web/.env.local
# Edit web/.env.local with your OPENROUTER_API_KEY

# Start development server
npm run dev
```

The app will be available at `http://localhost:3000`

### Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `OPENROUTER_API_KEY` | Yes | API key from [OpenRouter](https://openrouter.ai) |
| `NEXT_PUBLIC_APP_URL` | No | Your app URL (default: http://localhost:3000) |
| `AI_MODEL_PRIMARY` | No | Primary AI model (default: free model) |

---

## 🌐 Deployment

### Vercel (Recommended)

1. Fork this repository
2. Import to [Vercel](https://vercel.com)
3. Add environment variables:
   - `OPENROUTER_API_KEY` (required)
   - `NEXT_PUBLIC_APP_URL` (your production URL)
4. Deploy!

### Docker

```bash
docker-compose up -d
```

---

## 🛠️ Tech Stack

| Category | Technologies |
|----------|--------------|
| **Frontend** | Next.js 14, React 18, TypeScript |
| **Styling** | TailwindCSS, Framer Motion |
| **Editor** | Monaco Editor (VS Code) |
| **AI** | OpenRouter API (GPT-4, Claude, Gemini, Llama) |
| **Execution** | Piston API, Custom Go Engine |
| **Auth** | JWT, Custom Auth Context |
| **Database** | PostgreSQL (optional) |

---

## 📁 Project Structure

```
coderipper/
├── web/                    # Next.js frontend
│   ├── components/         # React components
│   ├── pages/              # Next.js pages
│   ├── lib/                # Utilities & services
│   ├── contexts/           # React contexts
│   └── styles/             # Global styles
├── services/
│   └── exec-engine/        # Go code execution service
├── infra/                  # Infrastructure configs
└── tests/                  # E2E tests
```

---

## 👨‍💻 Developer

<p align="center">
  <img src="https://github.com/fahadkhan.png" width="100" height="100" style="border-radius: 50%;" alt="Fahad Khan" />
</p>

<h3 align="center">Fahad Khan</h3>

<p align="center">
  <strong>Full Stack Developer & Software Engineer</strong>
</p>

<p align="center">
  <a href="https://github.com/fahadkhan">
    <img src="https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white" alt="GitHub" />
  </a>
  <a href="https://linkedin.com/in/fahadkhan">
    <img src="https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white" alt="LinkedIn" />
  </a>
  <a href="https://twitter.com/fahadkhan">
    <img src="https://img.shields.io/badge/Twitter-1DA1F2?style=for-the-badge&logo=twitter&logoColor=white" alt="Twitter" />
  </a>
</p>

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- [Monaco Editor](https://microsoft.github.io/monaco-editor/) - The code editor that powers VS Code
- [OpenRouter](https://openrouter.ai) - AI model routing
- [Piston](https://github.com/engineer-man/piston) - Code execution engine
- [Vercel](https://vercel.com) - Hosting platform

---

<p align="center">
  Made with ❤️ by <strong>Fahad Khan</strong>
</p>

<p align="center">
  <sub>If you found this project useful, please consider giving it a ⭐!</sub>
</p>