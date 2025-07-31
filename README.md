# 🌍 Talk to Me Fluent

<div align="center">

![Talk to Me Fluent](https://img.shields.io/badge/Language%20Learning-AI%20Powered-blue?style=for-the-badge&logo=react)
![React](https://img.shields.io/badge/React-18.0.0-61DAFB?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0.0-3178C6?style=for-the-badge&logo=typescript)
![Vite](https://img.shields.io/badge/Vite-5.0.0-646CFF?style=for-the-badge&logo=vite)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3.0.0-38B2AC?style=for-the-badge&logo=tailwind-css)

**Revolutionizing Language Learning Through AI-Powered Conversations** 🚀

[![Deploy on Vercel](https://img.shields.io/badge/Deploy%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com)
[![Deploy on Render](https://img.shields.io/badge/Deploy%20on-Render-46E3B7?style=for-the-badge&logo=render)](https://render.com)

</div>

---

## ✨ What Makes This Special?

**Talk to Me Fluent** is not just another language learning app—it's your personal AI language tutor that adapts to your learning style. Imagine having a conversation partner who never gets tired, speaks 20+ languages, and remembers every mistake you've ever made to help you improve.

### 🎯 Core Features

| Feature | Description | Tech Stack |
|---------|-------------|------------|
| 🗣️ **AI Conversations** | Real-time chat with AI tutors in your target language | Google Gemini AI |
| 🎤 **Voice Recognition** | Speak naturally and get instant pronunciation feedback | Web Speech API |
| 📊 **Smart Analytics** | Track progress, streaks, and learning patterns | Custom Analytics |
| 🎮 **Gamification** | Earn achievements, compete on leaderboards | Achievement System |
| 🌍 **Cultural Integration** | Learn language with cultural context | Cultural Modules |
| 📱 **Mobile-First** | Gesture controls and mobile-optimized experience | React Native-like |

## 🛠️ Modern Tech Stack

### Frontend Architecture
```typescript
// Modern React with TypeScript
├── React 18 (Concurrent Features)
├── TypeScript 5.0 (Strict Mode)
├── Vite (Lightning Fast Builds)
├── Tailwind CSS (Utility-First Styling)
├── Shadcn/ui (Beautiful Components)
└── React Router 6 (Modern Routing)
```

### Backend Infrastructure
```javascript
// Scalable Node.js Backend
├── Express.js (RESTful APIs)
├── MongoDB Atlas (Cloud Database)
├── JWT Authentication (Secure Sessions)
├── Google OAuth (Social Login)
└── bcryptjs (Password Security)
```

### AI & Speech Processing
```python
# Advanced AI Integration
├── Google Gemini AI (Language Processing)
├── Web Speech API (Voice Recognition)
├── Real-time Translation
└── Pronunciation Analysis
```

## 🚀 Quick Start

### Prerequisites
- **Node.js** ≥ 16.0.0
- **MongoDB Atlas** account
- **Google Cloud Console** setup
- **Git** for version control

### 1. Clone & Setup
```bash
# Clone the repository
git clone https://github.com/M-RajaBabu/talk-to-me-fluent-main.git
cd talk-to-me-fluent-main

# Install dependencies
npm install
cd server && npm install && cd ..
```

### 2. Environment Configuration

Create `.env` in the root directory:
```env
# Frontend Environment Variables
VITE_API_URL=http://localhost:5000
VITE_APP_NAME=Talk to Me Fluent
VITE_APP_VERSION=1.0.0
VITE_DEV_MODE=true
VITE_GEMINI_API_KEY=your_gemini_api_key_here
```

Create `server/.env`:
```env
# Backend Environment Variables
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/talktome
GOOGLE_CLIENT_ID=your_google_oauth_client_id
GOOGLE_CLIENT_SECRET=your_google_oauth_client_secret
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback
SESSION_SECRET=your_secure_session_secret
CORS_ORIGINS=http://localhost:8080,http://localhost:5173
PORT=5000
NODE_ENV=development
GEMINI_API_KEY=your_gemini_api_key_here
```

### 3. Start Development Servers

**Terminal 1 - Backend:**
```bash
cd server
npm run dev
```

**Terminal 2 - Frontend:**
```bash
npm run dev
```

### 4. Open Your Browser
- 🌐 **Frontend**: http://localhost:8080
- 🔧 **Backend API**: http://localhost:5000

## 🔐 Security Best Practices

### API Key Management
⚠️ **Important**: Never commit API keys to version control!

```bash
# ✅ Good: Use environment variables
VITE_GEMINI_API_KEY=your_api_key_here

# ❌ Bad: Hardcoding in source code
const API_KEY = "AIzaSyBgj3wA1VTtYyvWhd43k1CCeF0rsFd7yRE";
```

### Environment Variables Checklist
- [ ] All API keys stored in `.env` files
- [ ] `.env` files added to `.gitignore`
- [ ] Environment variables properly configured in deployment
- [ ] Secrets rotated regularly
- [ ] Access logs monitored

## 📁 Project Structure

```
talk-to-me-fluent-main/
├── 📁 src/
│   ├── 🧩 components/          # Reusable UI components
│   │   ├── ai/                # AI-powered features
│   │   ├── chat/              # Chat interface
│   │   ├── cultural/          # Cultural integration
│   │   ├── gamification/      # Achievement system
│   │   ├── learning/          # Learning tools
│   │   ├── mobile/            # Mobile experience
│   │   ├── music/             # Music learning
│   │   └── ui/                # UI components
│   ├── 📄 pages/              # Page components
│   ├── 🪝 hooks/              # Custom React hooks
│   ├── 🛠️ lib/                # Utilities and API config
│   ├── 📝 types/              # TypeScript definitions
│   └── 🚀 main.tsx           # App entry point
├── 🖥️ server/
│   ├── 📊 models/             # MongoDB models
│   ├── 🛣️ routes/             # API routes
│   └── ⚙️ server.js           # Express server
├── 📦 public/                 # Static assets
└── 📋 package.json           # Dependencies
```

## 🎮 Available Scripts

### Frontend Commands
```bash
npm run dev          # 🚀 Start development server
npm run build        # 📦 Build for production
npm run preview      # 👀 Preview production build
npm run lint         # 🔍 Run ESLint
npm run type-check   # ✅ TypeScript type checking
```

### Backend Commands
```bash
npm start            # 🚀 Start production server
npm run dev          # 🔧 Start development server
npm run test         # 🧪 Run tests
```

## 🌟 Advanced Features

### AI Learning System
- **Personalized Lessons**: AI adapts to your learning pace
- **Conversation Practice**: Real-time chat with AI tutors
- **Grammar Correction**: Instant feedback on mistakes
- **Vocabulary Building**: Contextual word learning

### Mobile Experience
- **Gesture Controls**: Swipe and tap interactions
- **Offline Mode**: Learn without internet
- **Voice Commands**: Hands-free navigation
- **Progressive Web App**: Install as native app

### Cultural Integration
- **Cultural Context**: Learn language with cultural insights
- **Regional Dialects**: Understand local variations
- **Cultural Etiquette**: Learn proper social customs
- **Traditional Stories**: Language through storytelling

## 🚀 Deployment

### Frontend (Vercel)
```bash
# Automatic deployment from GitHub
vercel --prod
```

### Backend (Render)
```bash
# Configure in Render dashboard
# Set environment variables
# Deploy automatically
```

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions.

## 🤝 Contributing

We love contributions! Here's how you can help:

### Development Workflow
1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### Code Standards
- ✅ TypeScript strict mode
- ✅ ESLint configuration
- ✅ Prettier formatting
- ✅ Conventional commits
- ✅ Test coverage

### Getting Help
- 📖 [Documentation](./docs/)
- 🐛 [Issue Tracker](https://github.com/M-RajaBabu/talk-to-me-fluent-main/issues)
- 💬 [Discussions](https://github.com/M-RajaBabu/talk-to-me-fluent-main/discussions)

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

<div align="center">

**Raja Babu Meena** 🚀

[![GitHub](https://img.shields.io/badge/GitHub-M--RajaBabu-181717?style=for-the-badge&logo=github)](https://github.com/M-RajaBabu)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Raja%20Babu%20Meena-0A66C2?style=for-the-badge&logo=linkedin)](https://linkedin.com/in/rajababumeena)
[![Portfolio](https://img.shields.io/badge/Portfolio-Website-FF6B6B?style=for-the-badge)](https://rajababumeena.dev)

*Full-Stack Developer | AI Enthusiast | Language Learning Advocate*

</div>

## 🙏 Acknowledgments

- **Google Gemini AI** for powerful language processing
- **Shadcn/ui** for beautiful, accessible components
- **Lucide React** for stunning icons
- **Tailwind CSS** for utility-first styling
- **Vite** for lightning-fast development
- **MongoDB Atlas** for reliable cloud database
- **Vercel & Render** for seamless deployment

---

<div align="center">

**🌟 Star this repository if you find it helpful! 🌟**

**Talk to Me Fluent** - Making language learning interactive, engaging, and accessible to everyone! 🌍🗣️✨

[![GitHub stars](https://img.shields.io/github/stars/M-RajaBabu/talk-to-me-fluent-main?style=social)](https://github.com/M-RajaBabu/talk-to-me-fluent-main)
[![GitHub forks](https://img.shields.io/github/forks/M-RajaBabu/talk-to-me-fluent-main?style=social)](https://github.com/M-RajaBabu/talk-to-me-fluent-main)

</div>
