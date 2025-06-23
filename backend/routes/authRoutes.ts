import { Router } from "express";
import passport from "passport";
import { loginUser } from "../controller/user";
import { reqUser } from "../types";

const router = Router();

/*
 *    Logs in user, returns user object or null on error
 */
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    prompt: "select_account",
  })
);

/*
 *    Logs in user, returns user object or null on error
 */
// router.get("/google/callback",
//   passport.authenticate("google", {
//     failureRedirect: `${process.env.FRONTEND_URL}/signin`,
//   }),
//   async (req: reqUser, res: any) => {
//     const user = await loginUser(req, res);
    
//     if (user != null) {
//       req.user.uid = user!.id;
//     }

//     res.redirect("/");
//   }
// );

router.get("/google/callback", (req: reqUser, res: any, next: any) => {
  passport.authenticate("google", async (err: any, user: any, info: any) => {
    if (err) {
      console.error("Google OAuth error:", err, info);
      return res.status(500).json({ error: err, info });
    }
    if (!user) {
      console.error("Google OAuth failed:", info);
      return res.redirect(`${process.env.FRONTEND_URL}/signin`);
    }
    req.logIn(user, async (err) => {
      if (err) {
        return next(err);
      }
      console.log("Google OAuth successful for user:", user);
      await loginUser(req, res);

      if (user != null) {
        req.user.uid = user!.id;
      }

      res.redirect("/");
    });
  })(req, res, next);
});

/*
 *    Logs out user, returns user object or null on error
 */
router.delete("/logout", (req: reqUser, res: any) => {
  req.logout((err: any) => {
    if (err) {
      return res.status(500).json({ error: "Failed to logout" });
    }
  });
  
  res.redirect("/");
});

export default router;