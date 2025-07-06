import { Router } from "express";
import { authenticate } from "../middleware/authenticate";
import {
  createOrderHandler,
  getSentPaymentsHandler,
  getReceivedPaymentsHandler,
  verifyOrderHandler,
} from "../controller/payment";
import { RedisService } from "../services/redis";

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

/*
 *    Redis cache monitoring (for debugging)
 *    GET /api/payment/cache/stats
 *    Returns: cache statistics
 */
router.get("/cache/stats", async (req, res) => {
  try {
    const stats = await RedisService.getCacheStats();
    res.status(200).json(stats);
  } catch (error) {
    res.status(500).json({ error: "Failed to get cache stats" });
  }
});

/*
 *    Redis health check
 *    GET /api/payment/cache/health
 *    Returns: Redis connection status
 */
router.get("/cache/health", async (req, res) => {
  try {
    const health = await RedisService.healthCheck();
    res.status(200).json(health);
  } catch (error) {
    res.status(500).json({ error: "Failed to check cache health" });
  }
});

/*
 *    Clear payment caches (for maintenance)
 *    POST /api/payment/cache/clear
 *    Returns: number of cleared keys
 */
router.post("/cache/clear", async (req, res) => {
  try {
    const clearedCount = await RedisService.clearPaymentCaches();
    res.status(200).json({ 
      message: `Cleared ${clearedCount} payment-related cache keys`,
      clearedCount 
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to clear payment caches" });
  }
});

export default router;
