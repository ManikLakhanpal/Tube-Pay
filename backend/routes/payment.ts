import { Router } from "express";
import { authenticate } from "../middleware/authenticate";
import {
  createOrderHandler,
  getSentPaymentsHandler,
  getReceivedPaymentsHandler,
  verifyOrderHandler,
} from "../controller/payment";

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

/*
 *    Get all payments sent by a user
 *    GET /api/payment/sent
 *    Returns: array of payment objects or null on error
 */
router.get("/sent", getSentPaymentsHandler);

/*
 *    Get all payments received by a streamer
 *    GET /api/payment/received
 *    Returns: object with payments array and pagination info
 */
router.get("/received", getReceivedPaymentsHandler);

export default router;
