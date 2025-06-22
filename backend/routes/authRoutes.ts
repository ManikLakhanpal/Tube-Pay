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
    const user = loginUser(req, res);

    console.log(user);
    res.redirect("/");
  }
);

export default router;