import { Router } from "express";
import { authenticate }from "../middleware/authenticate";
import { getUserById, updateUser } from "../controller/user";

const router = Router();

/*
 *    Gets user profile
 *    GET /api/user/profile/:id
 *    Params: id - user id
 *    Returns: user object or null on error
 */
router.get("/profile/:id", getUserById);

/*
 *    Updates user profile
 *    PATCH /api/user/profile
 *    Body: { name, avatarUrl, role }
 *    Returns: user object or null on error
 */
router.patch("/profile", authenticate, updateUser);

export default router;