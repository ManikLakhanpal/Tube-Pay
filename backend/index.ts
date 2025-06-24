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

const app = express();
const port = process.env.PORT!;

app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  credentials: true,
}));

app.use(
  session({
    store: new RedisStore({ client: redisClient }),
    secret: process.env.SESSION_SECRET || "your-secret-key",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production",
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
    console.log(`Server is running on http://localhost:${port}`);
})