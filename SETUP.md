# YouTube Donations Setup Guide

## Backend Environment Variables

Create a `.env` file in the `backend` directory with the following variables:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
DATABASE_URL="postgresql://username:password@localhost:5432/youtube_donations"

# Session
SESSION_SECRET="your-super-secret-session-key"

# Google OAuth
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# URLs
FRONTEND_URL="http://localhost:3000"
BACKEND_URL="http://localhost:5000"

# Redis (for session storage)
REDIS_URL="redis://localhost:6379"
```

## Frontend Environment Variables

Create a `.env.local` file in the `frontend` directory:

```env
NEXT_PUBLIC_API_URL="http://localhost:5000/api"
```

## Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API
4. Go to "Credentials" and create an OAuth 2.0 Client ID
5. Set the authorized redirect URIs to:
   - `http://localhost:5000/api/auth/google/callback` (for development)
6. Copy the Client ID and Client Secret to your backend `.env` file

## Running the Application

### Backend
```bash
cd backend
npm install
npm run dev
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## Authentication Flow

1. User clicks "Sign In with Google" on the frontend
2. Frontend redirects to `http://localhost:5000/api/auth/google`
3. Google OAuth flow happens
4. Backend receives callback and creates/updates user
5. Backend redirects to `http://localhost:3000/auth/callback`
6. Frontend callback page checks authentication status
7. User is redirected to home page if authenticated

## Troubleshooting

### CORS Issues
- Make sure `FRONTEND_URL` is set correctly in backend `.env`
- Ensure frontend is running on the correct port (3000)

### Authentication Issues
- Check that Google OAuth credentials are correct
- Verify Redis is running for session storage
- Check browser console for any errors

### Database Issues
- Ensure PostgreSQL is running
- Run database migrations: `npx prisma migrate dev`
- Check database connection string 