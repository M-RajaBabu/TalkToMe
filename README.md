# Talk to Me Fluent

A modern language learning application built with React, TypeScript, and Node.js that helps users learn languages through interactive conversations and AI-powered tutoring.

## 🚀 Features

- **Interactive Chat Interface**: Practice conversations in your target language
- **AI-Powered Tutoring**: Get personalized language lessons and feedback
- **Voice Recognition**: Speak and get real-time pronunciation feedback
- **Progress Tracking**: Monitor your learning progress and streaks
- **Multiple Languages**: Support for various languages
- **User Authentication**: Secure login and registration system
- **Responsive Design**: Works seamlessly on desktop and mobile

## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **Shadcn/ui** for UI components
- **React Router** for navigation
- **Lucide React** for icons

### Backend
- **Node.js** with Express
- **MongoDB** with Mongoose
- **JWT** for authentication
- **Google OAuth** integration
- **bcryptjs** for password hashing

### AI & Speech
- **Google Gemini AI** for language processing
- **Web Speech API** for voice recognition and synthesis
- **Real-time chat** with AI tutors

## 📦 Installation

### Prerequisites
- Node.js (v16 or higher)
- MongoDB Atlas account
- Google Cloud Console account (for OAuth)

### Setup

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd talk-to-me-fluent-main
   ```

2. **Install frontend dependencies**
   ```bash
   npm install
   ```

3. **Install backend dependencies**
   ```bash
   cd server
   npm install
   cd ..
   ```

4. **Set up environment variables**
   
   Create `.env` in the root directory:
   ```env
   VITE_API_URL=http://localhost:5000
   VITE_APP_NAME=Talk to Me Fluent
   VITE_APP_VERSION=1.0.0
   VITE_DEV_MODE=true
   ```

   Create `server/.env`:
   ```env
   MONGODB_URI=your_mongodb_connection_string
   GOOGLE_CLIENT_ID=your_google_oauth_client_id
   GOOGLE_CLIENT_SECRET=your_google_oauth_client_secret
   GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback
   SESSION_SECRET=your_session_secret
   CORS_ORIGINS=http://localhost:8080,http://localhost:5173
   PORT=5000
   NODE_ENV=development
   ```

5. **Start the development servers**

   Terminal 1 (Backend):
   ```bash
   cd server
   npm start
   ```

   Terminal 2 (Frontend):
   ```bash
   npm run dev
   ```

6. **Open your browser**
   - Frontend: http://localhost:8080
   - Backend: http://localhost:5000

## 🚀 Deployment

This project is configured for deployment on:
- **Frontend**: Vercel
- **Backend**: Render

See `DEPLOYMENT.md` for detailed deployment instructions.

## 📁 Project Structure

```
talk-to-me-fluent-main/
├── src/
│   ├── components/          # Reusable UI components
│   ├── pages/              # Page components
│   ├── hooks/              # Custom React hooks
│   ├── lib/                # Utility functions and API config
│   ├── types/              # TypeScript type definitions
│   └── main.tsx           # Application entry point
├── server/
│   ├── models/             # MongoDB models
│   ├── routes/             # API routes
│   └── server.js           # Express server
├── public/                 # Static assets
└── package.json           # Frontend dependencies
```

## 🔧 Available Scripts

### Frontend
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Backend
- `npm start` - Start production server
- `npm run dev` - Start development server

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Raja Babu Meena**

- GitHub: [@rajababumeena](https://github.com/rajababumeena)
- LinkedIn: [Raja Babu Meena](https://linkedin.com/in/rajababumeena)

## 🙏 Acknowledgments

- Built with modern web technologies
- Powered by Google Gemini AI
- UI components from Shadcn/ui
- Icons from Lucide React

---

**Talk to Me Fluent** - Making language learning interactive and engaging! 🌍🗣️
