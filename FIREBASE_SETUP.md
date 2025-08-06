# Firebase Authentication Setup

## Prerequisites

1. Install Firebase dependency:
```bash
npm install firebase
```

## Firebase Console Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select existing project
3. Enable Authentication:
   - Go to Authentication > Sign-in method
   - Enable Google provider
   - Add your domain to authorized domains
   - Configure OAuth consent screen

## Google Cloud Console Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your Firebase project
3. Go to APIs & Services > Credentials
4. Create OAuth 2.0 Client ID for Web application
5. Add authorized origins and redirect URIs:
   - Authorized origins: `http://localhost:5000`, `http://127.0.0.1:5000`
   - Redirect URIs: `http://localhost:5000/__/auth/handler`

## Environment Setup

1. Copy `env.example` to `.env`
2. Get Firebase config from Firebase Console > Project Settings > General > Your apps
3. Fill in the environment variables:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

## Features

- ✅ Google OAuth login
- ✅ Restricted to @surveysparrow.com domain
- ✅ User profile display with avatar
- ✅ Secure logout
- ✅ Protected routes
- ✅ User name and email display
- ✅ Toast notifications for auth events

## Domain Restriction

The authentication is configured to only allow users with `@surveysparrow.com` email addresses:

1. Google provider is configured with `hd: 'surveysparrow.com'` parameter
2. Additional client-side validation checks email domain
3. Users with invalid domains are automatically signed out

## Usage

Once configured, users will:
1. See a login page when not authenticated
2. Click "Sign in with Google" button
3. Be redirected to Google OAuth
4. Only succeed if using @surveysparrow.com email
5. See the main chat interface with their profile in the header
6. Can logout from the profile dropdown 