# Vercel Deployment Guide for ThriveChat

## 🚀 Quick Deploy

### Root Directory Selection
**Important**: Select `/Users/vinothkumar/ThriveChat` as your root directory in Vercel.

## 📁 Project Structure
```
ThriveChat/                 ← SELECT THIS AS ROOT DIRECTORY
├── client/                 (React frontend)
├── server/                 (Node.js backend - not deployed to Vercel)
├── vercel.json             (Vercel configuration)
├── package.json            (Dependencies and build scripts)
└── vite.config.ts          (Vite configuration)
```

## 🔧 Deployment Steps

### 1. Push to GitHub
```bash
git add .
git commit -m "Prepare for Vercel deployment"
git push origin main
```

### 2. Connect to Vercel
1. Go to [vercel.com](https://vercel.com)
2. Sign in with GitHub
3. Click "Import Project"
4. Select your ThriveChat repository

### 3. Configure Project Settings
- **Framework Preset**: Vite
- **Root Directory**: `.` (current directory)
- **Build Command**: `npm run build:client`
- **Output Directory**: `dist/public`
- **Install Command**: `npm install`

### 4. Environment Variables
Add these in Vercel Dashboard → Project Settings → Environment Variables:

#### Required Variables:
```
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_API_BASE_URL=https://ziwj2iq2ib7k5vrgh7p6ylcloi0mdslq.lambda-url.us-west-2.on.aws
```

### 5. Deploy
Click "Deploy" and wait for the build to complete.

## 🏗️ Build Configuration

The project is configured with:
- **Frontend Only**: Only the React client is deployed to Vercel
- **API Calls**: Frontend makes requests to your Lambda function
- **Static Hosting**: Vercel serves the built React app
- **SPA Routing**: All routes redirect to index.html for client-side routing

## ⚙️ Automatic Deployments

Once connected:
- **Main branch**: Automatically deploys to production
- **Other branches**: Create preview deployments
- **Pull requests**: Generate preview URLs

## 🔍 Troubleshooting

### Build Fails
- Check all environment variables are set
- Ensure `npm run build:client` works locally
- Verify all dependencies are in `package.json`

### Firebase Not Working
- Confirm all Firebase environment variables are set
- Check Firebase console for correct configuration
- Verify domain is added to authorized domains

### API Calls Failing
- Ensure `VITE_API_BASE_URL` is set correctly
- Check Lambda function CORS settings
- Verify API endpoints are accessible

## 📋 Post-Deployment Checklist

1. ✅ Firebase authentication works
2. ✅ API calls to Lambda function succeed
3. ✅ Conversation history loads
4. ✅ New chats can be created
5. ✅ User profile displays correctly

## 🌐 Custom Domain (Optional)

1. Go to Vercel Dashboard → Domains
2. Add your custom domain
3. Update DNS records as instructed
4. Update Firebase authorized domains

## 📈 Performance Tips

- Vercel automatically optimizes static assets
- Enable analytics in Vercel dashboard
- Monitor Core Web Vitals
- Use Vercel's built-in analytics

Your ThriveChat frontend will be available at `https://your-project.vercel.app` after successful deployment! 