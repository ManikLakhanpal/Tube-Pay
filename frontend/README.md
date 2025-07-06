# 🎨 Tube Pay Frontend

A modern Next.js frontend for the Tube Pay YouTube donations platform. Built with React 19, TypeScript, and Tailwind CSS.

## 🛠️ Tech Stack

- **Next.js 15** - React framework with App Router
- **React 19** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Icon library
- **QRCode** - QR code generation
- **clsx & tailwind-merge** - Conditional styling utilities

## 📦 Installation

### Prerequisites
- Node.js 18+
- npm

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Setup
Create a `.env.local` file in the frontend directory:

```env
# API Configuration
NEXT_PUBLIC_API_URL="http://localhost:5000/"
```

### 3. Start Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 🚀 Features

### For Content Creators
- **Stream Management** - Create, edit, and delete live streams
- **QR Code Generation** - Automatic QR codes for donation links
- **Payment Analytics** - Track donations and earnings
- **Profile Management** - Update profile information
- **Real-time Updates** - Live donation counters

### For Viewers
- **Browse Streams** - Discover active content creators
- **Secure Donations** - Support creators with Razorpay
- **Payment History** - Track donation history
- **Responsive Design** - Works on all devices

## 📱 Pages & Components

### Core Pages
- **Home** (`/`) - Landing page with features and CTA
- **Streams** (`/streams`) - Browse all live streams
- **Stream Details** (`/streams/[id]`) - Individual stream page with donation options
- **Profile** (`/profile`) - User profile management
- **Payments** (`/payments`) - Payment history and management
- **Authentication** (`/signin`, `/auth/callback`) - Google OAuth flow

### Key Components
- **Navigation** - Header with user menu and navigation
- **Stream Cards** - Display stream information and actions
- **Payment Forms** - Donation forms with Razorpay integration
- **QR Code Cards** - Generated QR codes for easy sharing
- **Payment Tables** - Paginated payment history
- **UI Components** - Reusable buttons, cards, and modals

## 🔧 Development

```bash
# Development mode with hot reload
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint
```

## 🎨 Styling

The project uses **Tailwind CSS** for styling with a custom design system:

- **Color Scheme** - Black, white, and gray palette
- **Typography** - Clean, modern fonts
- **Components** - Consistent button, card, and form styles
- **Responsive** - Mobile-first responsive design
- **Animations** - Subtle hover and loading animations

## 🔌 API Integration

The frontend communicates with the backend through a centralized API client:

### Authentication
- Google OAuth integration
- Session management
- Protected routes

### Stream Management
- Fetch live streams
- Create/edit streams
- Stream analytics

### Payment Processing
- Razorpay integration
- Payment verification
- Transaction history

## 📊 State Management

- **React Context** - Authentication state
- **Local State** - Component-specific state
- **Server State** - API data fetching and caching

## 🔒 Security Features

- **CORS Protection** - Secure API communication
- **Input Validation** - Form validation and sanitization
- **Authentication Guards** - Protected route components
- **HTTPS Ready** - Production security

## 🧪 Testing

```bash
# Lint code for errors
npm run lint

# Build to check for TypeScript errors
npm run build
```

## 🐳 Docker Support

The frontend includes Docker support for containerized deployment:

```bash
# Build Docker image
docker build -t tube-pay-frontend .

# Run container
docker run -p 3000:3000 tube-pay-frontend
```

## 📝 Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `NEXT_PUBLIC_API_URL` | Backend API URL | Yes | - |

## 🚀 Deployment

### Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Other Platforms
```bash
# Build the application
npm run build

# Start production server
npm start
```

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── auth/              # Authentication pages
│   ├── payments/          # Payment management
│   ├── profile/           # User profile pages
│   ├── streams/           # Stream browsing and management
│   └── layout.tsx         # Root layout
├── components/            # Reusable components
│   ├── ui/               # Base UI components
│   ├── payments/         # Payment-related components
│   ├── profile/          # Profile components
│   └── streams/          # Stream components
├── contexts/             # React contexts
├── lib/                  # Utility functions and API client
└── types/                # TypeScript type definitions
```

## 🎯 Key Features

### QR Code Generation
- Automatic QR code generation for stream donation links
- Easy sharing for content creators
- Mobile-friendly scanning

### Real-time Updates
- Live donation counters
- Stream status updates
- Payment notifications

### Responsive Design
- Mobile-first approach
- Tablet and desktop optimized
- Touch-friendly interactions

### Performance
- Next.js optimization
- Image optimization
- Code splitting
- Static generation where possible

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run linting and build checks
5. Submit a pull request

## 📚 Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)

---

**Part of the Tube Pay YouTube Donations Platform**
