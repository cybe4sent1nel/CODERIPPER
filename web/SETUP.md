# CodeRipper - AI-Powered Online Code Editor

## 🚀 Setup Instructions

### 1. Environment Variables

Copy the example environment file:
```bash
cp .env.example .env.local
```

Update `.env.local` with your configuration:
```env
# Required for AI features
NEXT_PUBLIC_OPENROUTER_API_KEY=your_openrouter_api_key_here

# Application URLs
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:8081

# Optional: Analytics
NEXT_PUBLIC_GA_ID=your_google_analytics_id
```

### 2. OpenRouter API Setup

1. Sign up at [openrouter.ai](https://openrouter.ai)
2. Get your API key from the dashboard
3. Add it to your `.env.local` file
4. The app will use mock responses if no API key is provided

### 3. Backend Service

Your existing backend service should work with the new API calls. The app expects:
- Service running on `http://localhost:8081/run`
- Accepts POST requests with language, files, timeLimit, memoryLimit

### 4. Development

Start the development server:
```bash
cd web
npm run dev
```

Build for production:
```bash
npm run build
npm start
```

## 🎯 Features

- ✅ Multi-language support (7 languages)
- ✅ AI-powered code assistance
- ✅ Beautiful dark/light theme
- ✅ Code sharing and downloading
- ✅ Real-time execution
- ✅ Professional UI/UX
- ✅ PWA ready
- ✅ SEO optimized
- ✅ Mobile responsive

## 💼 SaaS Business Model

The application includes:
- Free tier with basic features
- Pro tier with advanced AI features
- Team tier with collaboration tools
- Ready for ad revenue integration
- Stripe-ready for subscriptions

## 📱 PWA Features

- Offline capability
- App installation
- Service worker caching
- Progressive enhancement

## 🔧 Missing Assets

To complete the setup, add these files to `/public/`:
- `favicon.ico` (32x32)
- `icon-192x192.png` (192x192)
- `icon-512x512.png` (512x512)
- `apple-touch-icon.png` (180x180)

Generate these at: https://favicon.io/

The application handles missing icons gracefully with fallbacks.