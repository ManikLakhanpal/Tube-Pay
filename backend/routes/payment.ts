import { Router } from "express";
import { authenticate } from "../middleware/authenticate";
import { createOrderHandler, verifyOrderHandler } from "../controller/payment";

const router = Router();

router.use(authenticate);

/*
 *    Creates an order
 *    POST /api/payment/order
 *    Returns: order object or null on error
 */
router.post("/order", createOrderHandler);

/*
 *    Verifies the payments
 *    POST /api/payment/verify
 *    Returns: success: true or false
 */
router.post("/verify", verifyOrderHandler);

export default router;
