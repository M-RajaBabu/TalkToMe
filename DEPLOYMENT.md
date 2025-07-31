# Deployment Guide

## 🚀 Deployment Overview

This project is configured for deployment with:
- **Frontend**: Vercel (React + Vite)
- **Backend**: Render (Node.js + Express)

## 📋 Pre-Deployment Checklist

### ✅ Security Fixes Applied
- [x] Moved sensitive data to environment variables
- [x] Updated `.gitignore` to exclude `.env` files
- [x] Created API configuration utility
- [x] Updated server to use environment variables
- [x] Removed Supabase dependencies
- [x] Updated author information to Raja Babu Meena

### 🔧 Environment Variables Setup

#### Backend Environment Variables (Render)
Create these environment variables in your Render dashboard:

```env
MONGODB_URI=your_mongodb_connection_string
GOOGLE_CLIENT_ID=your_google_oauth_client_id
GOOGLE_CLIENT_SECRET=your_google_oauth_client_secret
GOOGLE_CALLBACK_URL=https://your-backend-url.onrender.com/api/auth/google/callback
JWT_SECRET=your_super_secret_jwt_key_here
GEMINI_API_KEY=your_gemini_api_key_here
NODE_ENV=production
PORT=10000
CORS_ORIGINS=https://your-frontend-url.vercel.app,http://localhost:8080
```

#### Frontend Environment Variables (Vercel)
Create these environment variables in your Vercel dashboard:

```env
VITE_API_URL=https://your-backend-url.onrender.com
VITE_APP_NAME=Talk to Me Fluent
VITE_APP_VERSION=1.0.0
VITE_DEV_MODE=false
VITE_GEMINI_API_KEY=your_gemini_api_key_here
```

## 🎯 Deployment Steps

### 1. Backend Deployment (Render)

1. **Connect Repository**
   - Go to [Render Dashboard](https://dashboard.render.com)
   - Click "New +" → "Web Service"
   - Connect your GitHub repository

2. **Configure Service**
   - **Name**: `talk-to-me-fluent-backend`
   - **Environment**: `Node`
   - **Build Command**: `cd server && npm install`
   - **Start Command**: `cd server && npm start`

3. **Set Environment Variables**
   - Add all backend environment variables listed above
   - **IMPORTANT**: Update `GOOGLE_CALLBACK_URL` with your Render URL after deployment
   - **IMPORTANT**: Update `CORS_ORIGINS` with your Vercel frontend URL after deployment

4. **Deploy**
   - Click "Create Web Service"
   - Wait for deployment to complete
   - Copy the generated URL (e.g., `https://your-app.onrender.com`)

### 2. Frontend Deployment (Vercel)

1. **Connect Repository**
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "New Project"
   - Import your GitHub repository

2. **Configure Project**
   - **Framework Preset**: `Vite`
   - **Root Directory**: `./` (root of project)
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

3. **Set Environment Variables**
   - Add all frontend environment variables listed above
   - **IMPORTANT**: Update `VITE_API_URL` with your Render backend URL

4. **Deploy**
   - Click "Deploy"
   - Wait for deployment to complete
   - Copy the generated URL (e.g., `https://your-app.vercel.app`)

### 3. Update Google OAuth Configuration

1. **Google Cloud Console**
   - Go to [Google Cloud Console](https://console.cloud.google.com)
   - Navigate to "APIs & Services" → "Credentials"
   - Edit your OAuth 2.0 Client ID

2. **Update Authorized Redirect URIs**
   - Add your Render backend URL: `https://your-backend-url.onrender.com/api/auth/google/callback`

3. **Update Authorized JavaScript Origins**
   - Add your Vercel frontend URL: `https://your-frontend-url.vercel.app`

## 🔄 Post-Deployment Updates

### Update Backend Environment Variables
After getting your frontend URL, update these in Render:
```env
GOOGLE_CALLBACK_URL=https://your-backend-url.onrender.com/api/auth/google/callback
CORS_ORIGINS=https://your-frontend-url.vercel.app
```

### Update Frontend Environment Variables
After getting your backend URL, update this in Vercel:
```env
VITE_API_URL=https://your-backend-url.onrender.com
```

## 🧪 Testing Deployment

1. **Test Backend**
   ```bash
   curl https://your-backend-url.onrender.com/api/auth/login
   ```

2. **Test Frontend**
   - Visit your Vercel URL
   - Test login/registration
   - Test chat functionality

## 🚨 Important Notes

### Security
- ✅ All sensitive data moved to environment variables
- ✅ `.env` files excluded from version control
- ✅ API keys and secrets secured
- ✅ JWT secret configured

### CORS Configuration
- Backend configured to accept requests from frontend domain
- Local development still supported

### Database
- MongoDB Atlas connection maintained
- No changes needed to database configuration

### AI Integration
- Gemini API key configured
- AI-powered chat functionality ready

## 🔧 Troubleshooting

### Common Issues

1. **CORS Errors**
   - Ensure `CORS_ORIGINS` includes your frontend URL
   - Check for trailing slashes in URLs

2. **Environment Variables Not Loading**
   - Verify variable names match exactly
   - Check for typos in environment variable names

3. **Build Failures**
   - Ensure all dependencies are in `package.json`
   - Check build logs for specific errors

4. **API Connection Issues**
   - Verify `VITE_API_URL` is correct
   - Check backend is running and accessible

5. **Google OAuth Issues**
   - Verify callback URL matches exactly
   - Check authorized origins in Google Console

### Debug Commands

```bash
# Test backend locally
cd server && npm start

# Test frontend locally
npm run dev

# Check environment variables
echo $VITE_API_URL
```

## 📞 Support

If you encounter issues:
1. Check deployment logs in Render/Vercel dashboards
2. Verify environment variables are set correctly
3. Test API endpoints individually
4. Check browser console for frontend errors
5. Verify Google OAuth configuration

## 🎯 Quick Deployment Checklist

- [ ] Backend deployed on Render
- [ ] Frontend deployed on Vercel
- [ ] Environment variables set in both platforms
- [ ] Google OAuth URLs updated
- [ ] CORS origins configured
- [ ] API endpoints tested
- [ ] Authentication flow working
- [ ] Chat functionality tested 