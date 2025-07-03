import express from "express";
import { configurePassport } from "./config/passport";
import authRoutes from "./routes/authRoutes";
import session from "express-session";
import redisClient from "./config/redis";
import { RedisStore } from "connect-redis";
import { authenticate } from "./middleware/authenticate";
import userRoutes from "./routes/userRoutes";
import streamRoutes from "./routes/streamRoutes";
import { reqUser } from "./types";
import cors from "cors";
import os from "os";
import paymentRoutes from "./routes/payment";

const app = express();
const port = process.env.PORT!;

const allowedOrigins = [
  `${process.env.FRONTEND_URL}`,
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

app.set("trust proxy", 1);

app.use(
  session({
    store: new RedisStore({ client: redisClient }),
    secret: process.env.SESSION_SECRET || "your-secret-key",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production", // Must be true in production
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    },
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const passport = configurePassport();
app.use(passport.initialize());
app.use(passport.session());

// * Routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/streams', streamRoutes);
app.use('/api/payment', paymentRoutes);

app.get('/', (req: reqUser, res: any) => {
    if (req.user) {
        return res.json([{"status": "verified"},{"user" :req.user}]);
    }
    
    res.status(200).json([{"status": "Not verified"},{"user" :req.user}]);
})

app.get('/test', authenticate, (req: reqUser, res: any) => {
    console.log("Protected route was accessed");

    res.status(200).json([{"status": "verified"},{"user" : req.user }]);
})

app.listen(port, () => {
  const interfaces = os.networkInterfaces();
  const addresses: string[] = [];

  for (const iface of Object.values(interfaces)) {
    if (!iface) continue;
    for (const config of iface) {
      if (config.family === "IPv4" && !config.internal) {
        addresses.push(config.address);
      }
    }
  }

  console.log(`✓ Server started`);
  console.log(`- Local: http://localhost:${port}`);
  addresses.forEach(addr => {
    console.log(`- Network: http://${addr}:${port}`);
  });
});