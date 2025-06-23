import { Router } from "express";
import { authenticate }from "../middleware/authenticate";
import { getUserById, updateUser } from "../controller/user";

const router = Router();

/*
 *    Gets user profile with data
 */
router.get("/profile/:id", getUserById);

/*
 *    Updates user profile with name, returns user object or null on error
 */
router.patch("/profile", authenticate, updateUser);

export default router;