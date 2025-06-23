import prisma from "../config/prisma";
import { findUser } from "../services/user";
import { reqUser } from "../types";

export const authenticate = async (req: reqUser, res: any, next: any) => {
  try {
    if (!req.isAuthenticated || !req.isAuthenticated()) {
      console.log("User not authenticated");
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { uid } = req.user;

    if (!uid) {
      console.log("UID missing from user session");
      return res.status(401).json({ error: "UID missing from user session" });
    }

    const user = await findUser(undefined, uid);

    if (!user) {
      console.log(`User with UID ${uid} not found in database`);
      return res.status(401).json({ error: "User not found" });
    }

    next();
  } catch (error) {
    console.error("Authentication middleware error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

