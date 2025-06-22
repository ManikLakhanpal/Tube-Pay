import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";

export function configurePassport() {
  console.log("🔧 [PASSPORT] Configuring PassportJS...");

  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID!,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        callbackURL: `${process.env.BACKEND_URL!}/api/auth/google/callback`,
      },
      (accessToken, refreshToken, profile, done) => {
        console.log(profile);

        return done(null, profile);
      }
    )
  );

  console.log("🔧 [PASSPORT] Google OAuth strategy configured successfully");

  // * Stores data of user into the session
  passport.serializeUser((user: any, done: any) => {
    done(null, user);
  });

  // * Retrieves data of user from the session
  passport.deserializeUser((user: any, done: any) => {
    done(null, user);
  });

  return passport;
}
