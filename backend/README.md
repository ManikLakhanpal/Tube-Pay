# YouTube Donations Backend

This backend provides Google OAuth authentication and YouTube Data API v3 integration to fetch YouTube channels and videos.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables in `.env`:
```env
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
BACKEND_URL=http://localhost:3001
FRONTEND_URL=http://localhost:3000
SESSION_SECRET=your_session_secret
PORT=3001
```

3. Enable YouTube Data API v3 in your Google Cloud Console:
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Select your project
   - Go to "APIs & Services" > "Library"
   - Search for "YouTube Data API v3" and enable it

4. Configure OAuth consent screen:
   - Go to "APIs & Services" > "OAuth consent screen"
   - Add the required scopes:
     - `https://www.googleapis.com/auth/youtube.readonly`
     - `https://www.googleapis.com/auth/youtube.channel-memberships.creator`

## API Endpoints

### Authentication
- `GET /api/auth/google` - Initiate Google OAuth login
- `GET /api/auth/google/callback` - OAuth callback handler
- `GET /api/test-auth` - Test authentication status

### YouTube API
- `GET /api/auth/youtube/channels` - Get all YouTube channels for authenticated user
- `GET /api/auth/youtube/channels/:channelId` - Get details for a specific channel
- `GET /api/auth/youtube/channels/:channelId/videos` - Get videos for a specific channel

## Usage Examples

### 1. Authenticate with Google
```bash
# Redirect user to Google OAuth
GET http://localhost:3001/api/auth/google
```

### 2. Get User's YouTube Channels
```bash
# After authentication, fetch user's channels
GET http://localhost:3001/api/auth/youtube/channels
```

Response:
```json
{
  "success": true,
  "channels": [
    {
      "id": "UC...",
      "title": "My YouTube Channel",
      "description": "Channel description",
      "thumbnail": "https://...",
      "subscriberCount": "1000",
      "videoCount": "50",
      "viewCount": "100000",
      "customUrl": "@mychannel",
      "publishedAt": "2020-01-01T00:00:00Z"
    }
  ]
}
```

### 3. Get Specific Channel Details
```bash
GET http://localhost:3001/api/auth/youtube/channels/UC...
```

### 4. Get Channel Videos
```bash
GET http://localhost:3001/api/auth/youtube/channels/UC.../videos?maxResults=10
```

## Error Handling

All endpoints return appropriate HTTP status codes:
- `200` - Success
- `401` - Not authenticated or missing access token
- `404` - Channel not found
- `500` - Server error

Error responses include details:
```json
{
  "error": "Error message",
  "details": "Detailed error information"
}
```

## Development

Run the development server:
```bash
npm run dev
```

Build for production:
```bash
npm run build
npm start
``` 