# 🚀 Quick Deployment Checklist

## Step 1: Backend Deployment (Render)

### 1.1 Create Render Account
- [ ] Go to [Render Dashboard](https://dashboard.render.com)
- [ ] Sign up/Login with GitHub

### 1.2 Deploy Backend
- [ ] Click "New +" → "Web Service"
- [ ] Connect your GitHub repository
- [ ] Configure service:
  - **Name**: `talk-to-me-fluent-backend`
  - **Environment**: `Node`
  - **Build Command**: `cd server && npm install`
  - **Start Command**: `cd server && npm start`

### 1.3 Set Environment Variables in Render
Add these environment variables in Render dashboard:

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

- [ ] Click "Create Web Service"
- [ ] Wait for deployment to complete
- [ ] Copy the backend URL (e.g., `https://your-app.onrender.com`)

## Step 2: Frontend Deployment (Vercel)

### 2.1 Create Vercel Account
- [ ] Go to [Vercel Dashboard](https://vercel.com/dashboard)
- [ ] Sign up/Login with GitHub

### 2.2 Deploy Frontend
- [ ] Click "New Project"
- [ ] Import your GitHub repository
- [ ] Configure project:
  - **Framework Preset**: `Vite`
  - **Root Directory**: `./` (root of project)
  - **Build Command**: `npm run build`
  - **Output Directory**: `dist`

### 2.3 Set Environment Variables in Vercel
Add these environment variables in Vercel dashboard:

```env
VITE_API_URL=https://your-backend-url.onrender.com
VITE_APP_NAME=Talk to Me Fluent
VITE_APP_VERSION=1.0.0
VITE_DEV_MODE=false
VITE_GEMINI_API_KEY=your_gemini_api_key_here
```

- [ ] Click "Deploy"
- [ ] Wait for deployment to complete
- [ ] Copy the frontend URL (e.g., `https://your-app.vercel.app`)

## Step 3: Update URLs

### 3.1 Update Backend Environment Variables
After getting your frontend URL, update these in Render:
- [ ] Update `GOOGLE_CALLBACK_URL` with your Render backend URL
- [ ] Update `CORS_ORIGINS` with your Vercel frontend URL

### 3.2 Update Frontend Environment Variables
After getting your backend URL, update this in Vercel:
- [ ] Update `VITE_API_URL` with your Render backend URL

## Step 4: Google OAuth Configuration

### 4.1 Update Google Cloud Console
- [ ] Go to [Google Cloud Console](https://console.cloud.google.com)
- [ ] Navigate to "APIs & Services" → "Credentials"
- [ ] Edit your OAuth 2.0 Client ID

### 4.2 Update Authorized Redirect URIs
- [ ] Add: `https://your-backend-url.onrender.com/api/auth/google/callback`

### 4.3 Update Authorized JavaScript Origins
- [ ] Add: `https://your-frontend-url.vercel.app`

## Step 5: Testing

### 5.1 Test Backend
- [ ] Visit your backend URL
- [ ] Test API endpoint: `https://your-backend-url.onrender.com/api/auth/login`

### 5.2 Test Frontend
- [ ] Visit your Vercel URL
- [ ] Test registration/login
- [ ] Test chat functionality
- [ ] Test voice features

## Step 6: Final Verification

- [ ] Authentication flow works
- [ ] Chat with AI works
- [ ] Voice recognition works
- [ ] Google OAuth works
- [ ] All features functional

## 🎉 Success!

Your Talk to Me Fluent app is now live!
- **Frontend**: https://your-app.vercel.app
- **Backend**: https://your-app.onrender.com

## 🔧 Troubleshooting

If something doesn't work:
1. Check deployment logs in both platforms
2. Verify all environment variables are set correctly
3. Test API endpoints individually
4. Check browser console for errors
5. Verify Google OAuth configuration

## 📞 Need Help?

- Check the detailed `DEPLOYMENT.md` guide
- Review deployment logs in Render/Vercel dashboards
- Test each component individually 