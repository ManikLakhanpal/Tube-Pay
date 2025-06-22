import { Router } from "express";
import passport from "passport";
import loginUser from "../controller/user";

const router = Router();

router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    prompt: "select_account",
  })
);

router.get("/google/callback",
  passport.authenticate("google", {
    failureRedirect: `${process.env.FRONTEND_URL}/signin`,
  }),
  async (req: any, res: any) => {
    const user = await loginUser(req, res);
    
    if (user != null) {
      req.user.uid = user!.id;
    }

    res.redirect("/");
  }
);

router.delete("/logout", (req: any, res: any) => {
  req.logout((err: any) => {
    if (err) {
      return res.status(500).json({ error: "Failed to logout" });
    }
  });
  
  res.redirect("/");
});

export default router;