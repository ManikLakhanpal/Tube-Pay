import prisma from "../config/prisma";
import { reqUser } from "../types";

const authenticate = async (req: reqUser, res: any, next: any) => {
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

    const user = await prisma.user.findUnique({
      where: { id: uid },
    });

    if (!user) {
      console.log("User not found in database");
      return res.status(401).json({ error: "User not found in database" });
    }

    next();
  } catch (error) {
    console.error("Authentication middleware error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export default authenticate;