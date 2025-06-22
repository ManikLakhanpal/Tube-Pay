import express from "express";
import { configurePassport } from "./config/passport";
import authRoutes from "./routes/authRoutes";
import session from "express-session";
import redisClient from "./config/redis";
import { RedisStore } from "connect-redis";

const app = express();
const port = process.env.PORT!;

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

const passport = configurePassport();
app.use(passport.initialize());
app.use(passport.session());

// * Routes
app.use('/api/auth', authRoutes);

app.get('/', (req: any, res: any) => {
    if (req.user) {
        return res.json([{"status": "verified"},{"user" :req.user}]);
    }
    
    res.json([{"status": "Not verified"},{"user" :req.user}]);
})

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
})