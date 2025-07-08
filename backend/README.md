# 🚀 Tube Pay Backend API

A modern Express.js backend for the Tube Pay YouTube donations platform. Built with TypeScript, PostgreSQL, Redis, and integrated with Google OAuth and Razorpay payments.

## 🛠️ Tech Stack

- **Express.js 5** - Node.js web framework
- **TypeScript** - Type safety and better development experience
- **Prisma** - Database ORM for PostgreSQL
- **Redis** - Caching and session storage
- **Passport.js** - Google OAuth authentication
- **Razorpay** - Payment gateway integration
- **CORS** - Cross-origin resource sharing

## 📦 Installation

### Prerequisites
- Node.js 18+
- Docker Desktop (for PostgreSQL and Redis)
- npm

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Setup
Create a `.env` file in the backend directory:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database (Docker PostgreSQL)
DATABASE_URL="postgresql://postgres:password@localhost:5432/youtube_donations"

# Session
SESSION_SECRET="your-super-secret-session-key"

# Google OAuth
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# URLs
FRONTEND_URL="http://localhost:3000"
BACKEND_URL="http://localhost:5000"

# Redis (Docker Redis Stack)
REDIS_URL="redis://localhost:6379"

# Razorpay (for payments)
RAZORPAY_KEY_ID="your-razorpay-key-id"
RAZORPAY_KEY_SECRET="your-razorpay-key-secret"

# RESEND (for sending emails)
RESEND_KEY="your-resend-api-key"
RESEND_EMAIL="your-resend-email"
```

### 3. Database Setup
```bash
# Run PostgreSQL container
docker run --name postgres-server \
  -p 5432:5432 \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=youtube_donations \
  -d postgres

# Run database migrations
npx prisma migrate dev
```

### 4. Redis Setup
```bash
# Run Redis Stack container
docker run -d \
  --name redis-stack \
  -p 6379:6379 \
  -p 8001:8001 \
  redis/redis-stack:latest
```

### 5. Start Development Server
```bash
npm run dev
```

## 🔌 API Endpoints

### Authentication
- `GET /api/auth/google` - Google OAuth login
- `GET /api/auth/google/callback` - OAuth callback handler
- `GET /api/auth/current` - Get current user status
- `DELETE /api/auth/logout` - Logout user

### Users
- `GET /api/user/profile/:id` - Get user profile by ID
- `PATCH /api/user/profile` - Update user profile (authenticated)

### Streams
- `GET /api/streams/live` - Get all live streams (public)
- `GET /api/streams/:id` - Get stream by ID (public)
- `POST /api/streams` - Create new stream (streamer only)
- `PATCH /api/streams/:id` - Update stream (streamer only)
- `DELETE /api/streams/:id` - Delete stream (streamer only)

### Payments
- `POST /api/payment/order` - Create payment order (authenticated)
- `POST /api/payment/verify` - Verify payment (authenticated)
- `GET /api/payment/sent` - Get sent payments (authenticated)
- `GET /api/payment/received` - Get received payments (authenticated)

### Cache Monitoring
- `GET /api/payment/cache/stats` - Get Redis cache statistics
- `GET /api/payment/cache/health` - Check Redis connection health
- `POST /api/payment/cache/clear` - Clear payment caches

## 🗄️ Database Schema

### Users
- `id` - Unique identifier (CUID)
- `name` - Display name
- `email` - Email address (unique)
- `avatarUrl` - Profile picture URL
- `role` - User role (ADMIN, STREAMER, USER)
- `createdAt` - Account creation timestamp

### Streams
- `id` - Unique identifier (CUID)
- `title` - Stream title
- `description` - Stream description (optional)
- `streamLink` - External stream URL (optional)
- `isLive` - Live status (default: true)
- `streamerId` - Creator's user ID (foreign key)
- `createdAt` - Stream creation timestamp

### Payments
- `id` - Unique identifier (CUID)
- `amount` - Donation amount (float)
- `message` - Optional message from donor
- `userId` - Donor's user ID (foreign key)
- `streamId` - Target stream ID (foreign key)
- `status` - Payment status (PENDING, SUCCESS, FAILED)
- `createdAt` - Payment timestamp

## 🔒 Security Features

- **Google OAuth** - Secure authentication with Google
- **Session Management** - Redis-based session storage
- **Rate Limiting** - API abuse prevention (10 requests/minute for payments)
- **CORS Protection** - Cross-origin security
- **Input Validation** - Data sanitization and validation
- **Authentication Middleware** - Protected routes
- **Email Notifications** - Secure payment confirmations via Resend

## 📊 Performance Features

- **Redis Caching** - High-performance data caching
  - Payment details (5 min TTL)
  - User payment lists (3 min TTL)
  - Stream donations (24 hours TTL)
- **Database Indexing** - Optimized queries with Prisma
- **Pagination** - Efficient data loading for payment lists
- **Real-time Updates** - Live donation counters

## 🧪 Testing

```bash
# Type checking
npm run type-check

# Build for production
npm run build

# Start production server
npm start
```

## 🐳 Docker Support

The backend includes Docker support for containerized deployment:

```bash
# Build Docker image
docker build -t tube-pay-backend .

# Run container
docker run -p 5000:5000 tube-pay-backend
```

## 🔧 Configuration

### Google OAuth Setup
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API
4. Create OAuth 2.0 Client ID
5. Set authorized redirect URIs:
   - `http://localhost:5000/api/auth/google/callback` (development)
   - `https://yourdomain.com/api/auth/google/callback` (production)

### Razorpay Setup
1. Sign up at [Razorpay](https://razorpay.com/)
2. Get your API keys from the dashboard
3. Add keys to `.env` file

### Resend Email Setup
1. Sign up at [Resend](https://resend.com/)
2. Get your API key from the dashboard
3. Add your verified domain email to `.env` file
4. The system will automatically send payment notifications to both parties

## 🚀 Development

```bash
# Development mode with hot reload
npm run dev

# Type checking
npm run type-check

# Clean build directory
npm run clean

# Build for production
npm run build
```

## 📝 Environment Variables Reference

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `PORT` | Server port | Yes | 5000 |
| `NODE_ENV` | Environment mode | Yes | development |
| `DATABASE_URL` | PostgreSQL connection string | Yes | - |
| `SESSION_SECRET` | Session encryption key | Yes | - |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID | Yes | - |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret | Yes | - |
| `FRONTEND_URL` | Frontend application URL | Yes | - |
| `BACKEND_URL` | Backend application URL | Yes | - |
| `REDIS_URL` | Redis connection string | Yes | - |
| `RAZORPAY_KEY_ID` | Razorpay API key ID | Yes | - |
| `RAZORPAY_KEY_SECRET` | Razorpay API secret | Yes | - |
| `RESEND_KEY` | RESEND API secret | Yes | - |
| `RESEND_EMAIL` | Email for sending mails | Yes | - |

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and type checking
5. Submit a pull request

---

**Part of the Tube Pay YouTube Donations Platform** 