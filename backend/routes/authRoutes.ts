import { Router } from "express";
import passport from "passport";
import { loginUser } from "../controller/user";
import { reqUser } from "../types";

const router = Router();

/*
 *    Logs in user
 *    GET /api/auth/google
 *    Returns: user object or null on error
 */
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    prompt: "select_account",
  })
);

/*
 *    Logs in user
 *    GET /api/auth/google/callback
 *    Returns: user object or null on error
 */
router.get("/google/callback",
  passport.authenticate("google", {
    failureRedirect: `${process.env.FRONTEND_URL}/signin`,
  }),
  async (req: reqUser, res: any) => {
    await loginUser(req, res);
  }
);

/*
 *    Logs out user
 *    DELETE /api/auth/logout
 *    Returns: user object or null on error
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