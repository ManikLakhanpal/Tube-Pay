# 🎥 Tube Pay - YouTube Donations Platform

A modern, full-stack platform for content creators to manage live streams and receive donations from their audience. Built with Next.js, Express.js, PostgreSQL, and Redis.

🌐 **Live Demo**: [https://tube-pay.w16manik.ninja](https://tube-pay.w16manik.ninja)

![Tube Pay](https://img.shields.io/badge/Status-Production%20Ready-brightgreen)
![Next.js](https://img.shields.io/badge/Next.js-15.3.4-black)
![Express](https://img.shields.io/badge/Express-5.1.0-green)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15+-blue)
![Redis](https://img.shields.io/badge/Redis-5.5.6-red)

## 🚀 Features

### For Content Creators
- **Live Stream Management** - Create, update, and manage live streams
- **Real-time Donations** - Receive instant donations with messages
- **Payment Analytics** - Track donation history and earnings
- **QR Code Generation** - Easy donation links for viewers
- **Profile Management** - Customize your creator profile

### For Viewers
- **Browse Live Streams** - Discover active content creators
- **Secure Donations** - Support creators with Razorpay integration
- **Payment History** - Track your donation history
- **Real-time Updates** - See live donation counters

### Technical Features
- **Google OAuth Authentication** - Secure user authentication
- **Redis Caching** - High-performance data caching
- **Rate Limiting** - Prevent payment abuse
- **Real-time Updates** - Live donation counters and notifications
- **Responsive Design** - Works on desktop and mobile
- **TypeScript** - Full type safety across the stack

## 🏗️ Architecture
![Untitled-2025-07-06-2132](https://github.com/user-attachments/assets/771be510-4910-4a50-8ec8-53e04283ce62)


## 🛠️ Tech Stack

### Frontend
- **Next.js 15** - React framework with App Router
- **React 19** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Icon library
- **QRCode** - QR code generation

### Backend
- **Express.js** - Node.js web framework
- **TypeScript** - Type safety
- **Prisma** - Database ORM
- **PostgreSQL** - Primary database
- **Redis** - Caching and session storage
- **Passport.js** - Authentication middleware
- **Razorpay** - Payment gateway

### Infrastructure
- **Docker** - Containerization
- **CORS** - Cross-origin resource sharing
- **Session Management** - Secure user sessions
- **Rate Limiting** - API protection

## 📦 Installation

### Prerequisites
- Node.js 18+ 
- Docker Desktop
- npm

### 1. Clone the Repository
```bash
git clone https://github.com/ManikLakhanpal/Tube-Pay.git
cd Tube-Pay
```

### 2. Backend Setup
```bash
cd backend

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
```

Configure your `.env` file:
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

# RESEND API KEY (for sending emails)
RESEND_KEY="your-resend-api-key"
RESEND_EMAIL="your-resend-email"
```

```bash
# Run database migrations
npx prisma migrate dev

# Start development server
npm run dev
```

### 3. Frontend Setup
```bash
cd frontend

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
```

Configure your `.env.local` file:
```env
NEXT_PUBLIC_API_URL="http://localhost:5000/"
```

```bash
# Start development server
npm run dev
```

### 4. Database Setup with Docker
```bash
# Run PostgreSQL container
docker run --name postgres-server \
  -p 5432:5432 \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=youtube_donations \
  -d postgres

# Verify PostgreSQL is running
docker ps
```

### 5. Redis Setup with Docker
```bash
# Run Redis Stack container (includes RedisInsight for monitoring)
docker run -d \
  --name redis-stack \
  -p 6379:6379 \
  -p 8001:8001 \
  redis/redis-stack:latest

# Verify Redis is running
docker ps

# Test Redis connection
docker exec redis-stack redis-cli ping
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
3. Add keys to backend `.env` file

## 🚀 Running the Application

### Development
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend  
cd frontend
npm run dev

# Docker containers should already be running from setup
# To check container status:
docker ps

# To stop containers:
docker stop postgres-server redis-stack

# To start containers:
docker start postgres-server redis-stack
```

### Production
```bash
# Build frontend
cd frontend
npm run build
npm start

# Build backend
cd backend
npm run build
npm start
```

### Docker Container Management
```bash
# Check running containers
docker ps

# View container logs
docker logs postgres-server
docker logs redis-stack

# Access PostgreSQL shell
docker exec -it postgres-server psql -U postgres -d youtube_donations

# Access Redis CLI
docker exec -it redis-stack redis-cli

# Stop containers
docker stop postgres-server redis-stack

# Remove containers (data will be lost)
docker rm postgres-server redis-stack

# RedisInsight (Redis monitoring UI)
# Access at: http://localhost:8001
```

### Docker Compose (Easiest)
```bash
# Go to root of project where docker-compose.yml file is present
# NOTE: Make sure you create .env file with help of .env.example and fill the fields
docker compose up
```

## 📱 Usage

### For Content Creators
1. **Sign In** - Use Google OAuth to create an account
2. **Create Stream** - Set up a new live stream with title and description
3. **Share QR Code** - Share the generated QR code with your audience
4. **Receive Donations** - Get real-time notifications and track earnings
5. **Manage Profile** - Update your profile and stream settings

### For Viewers
1. **Browse Streams** - View all active live streams
2. **Select Creator** - Choose a creator to support
3. **Make Donation** - Enter amount and optional message
4. **Complete Payment** - Use Razorpay to complete the transaction
5. **Track History** - View your donation history

## 🔌 API Endpoints

### Authentication
- `GET /api/auth/google` - Google OAuth login
- `GET /api/auth/google/callback` - OAuth callback
- `GET /api/auth/logout` - Logout

### Streams
- `GET /api/streams` - Get all streams
- `GET /api/streams/live` - Get live streams
- `POST /api/streams` - Create stream
- `GET /api/streams/:id` - Get stream by ID
- `PATCH /api/streams/:id` - Update stream
- `DELETE /api/streams/:id` - Delete stream

### Payments
- `POST /api/payment/order` - Create payment order
- `POST /api/payment/verify` - Verify payment
- `GET /api/payment/sent` - Get sent payments
- `GET /api/payment/received` - Get received payments

### Cache Monitoring
- `GET /api/payment/cache/stats` - Cache statistics
- `GET /api/payment/cache/health` - Redis health check
- `POST /api/payment/cache/clear` - Clear payment caches

## 🗄️ Database Schema

<img width="849" alt="Screenshot 2025-07-06 at 9 30 51 PM" src="https://github.com/user-attachments/assets/2af5e56e-c971-4276-b2f8-d5b7c8736fc8" />


## 🔒 Security Features

- **Google OAuth** - Secure authentication
- **Session Management** - Redis-based sessions
- **Rate Limiting** - API abuse prevention
- **CORS Protection** - Cross-origin security
- **Input Validation** - Data sanitization
- **HTTPS Ready** - Production security

## 📊 Performance Features

- **Redis Caching** - Fast data retrieval
- **Database Indexing** - Optimized queries
- **Pagination** - Efficient data loading
- **Real-time Updates** - Live donation counters
- **CDN Ready** - Static asset optimization

## 🧪 Testing

### Backend Tests
```bash
cd backend
npm run type-check
```

### Frontend Tests
```bash
cd frontend
npm run lint
npm run build
```

## 🔧 Troubleshooting

### Docker Issues
```bash
# If containers won't start, check if ports are in use
lsof -i :5432  # Check PostgreSQL port
lsof -i :6379  # Check Redis port

# Remove existing containers if needed
docker rm -f postgres-server redis-stack

# Check Docker logs
docker logs postgres-server
docker logs redis-stack
```

### Database Connection Issues
- Ensure PostgreSQL container is running: `docker ps`
- Check database URL in `.env` file
- Verify database exists: `docker exec -it postgres-server psql -U postgres -l`

### Redis Connection Issues
- Ensure Redis container is running: `docker ps`
- Test Redis connection: `docker exec redis-stack redis-cli ping`
- Access RedisInsight at http://localhost:8001 for monitoring

## 🚀 Deployment

### Environment Variables
Set up production environment variables:
```env
NODE_ENV=production
DATABASE_URL="your-production-db-url"
REDIS_URL="your-production-redis-url"
SESSION_SECRET="your-production-session-secret"
FRONTEND_URL="https://yourdomain.com"
```

### Database Migration
```bash
cd backend
npx prisma migrate deploy
```

### Build and Deploy
```bash
# Frontend
cd frontend
npm run build
npm start

# Backend
cd backend
npm run build
npm start
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation** - Check the README files in each directory
- **Issues** - Report bugs via GitHub Issues or just email me
- **Discussions** - Ask questions in GitHub Discussions or just email me

## 🙏 Acknowledgments

- **Next.js** - React framework
- **Express.js** - Node.js web framework
- **Prisma** - Database toolkit
- **Razorpay** - Payment gateway
- **Redis** - In memory data store
- **Tailwind CSS** - CSS framework

---

**Made by Manik Lakhanpal 🔥** 