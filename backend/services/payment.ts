import { PaymentStatus } from "@prisma/client";
import prisma from "../config/prisma";
import { RedisService } from "./redis";

/*
 *    Creates a new payment for a stream, returns payment object or null on error
 */
export const createPayment = async (
  orderId: string,
  amount: number,
  message: string | null,
  userId: string,
  streamId: string
) => {
  try {
    const payment = await prisma.payment.create({
      data: {
        id: orderId,
        amount,
        message,
        userId,
        streamId,
        status: "PENDING",
      },
    });

    if (!payment) {
      console.error("Error creating payment:", payment);
      throw new Error("Error creating payment");
    }

    // Cache the payment details
    await RedisService.cachePaymentDetails(orderId, payment);

    return payment;
  } catch (error) {
    console.error("Error creating payment:", error);

    throw new Error("Error creating payment");
  }
};

/*
 *    Gets a payment by id with Redis caching, returns payment object or null on error
 */
export const getPayment = async (id: string) => {
  try {
    // First, try to get from cache
    const cachedPayment = await RedisService.getCachedPaymentDetails(id);
    if (cachedPayment) {
      console.log(`📦 Returning cached payment ${id}`);
      return cachedPayment;
    }

    // If not in cache, fetch from database
    console.log(`🗄️ Fetching payment ${id} from database`);
    const payment = await prisma.payment.findUnique({
      where: { id },
    });

    if (!payment) {
      console.error("Payment not found:", id);
      throw new Error("Payment not found");
    }

    // Cache the payment for future requests
    await RedisService.cachePaymentDetails(id, payment);

    return payment;
  } catch (error) {
    console.error("Error getting payment:", error);
    throw new Error("Error getting payment");
  }
};

/*
 *    Get all payments sent by a user with pagination and Redis caching
 *    Params: userId - user id
 *    Params: status - payment status (optional)
 *    Params: page - page number (default: 1)
 *    Params: limit - items per page (default: 10)
 *    Returns: object with payments array, total count, and pagination info
 */
export const getSentPaymentsByUserId = async (
  userId: string,
  status: PaymentStatus | undefined,
  page: number = 1,
  limit: number = 10
) => {
  try {
    // First, try to get from cache
    const cachedPayments = await RedisService.getCachedUserSentPayments(userId, status, page);
    if (cachedPayments) {
      console.log(`📦 Returning cached sent payments for user ${userId} (page: ${page})`);
      return cachedPayments;
    }

    // If not in cache, fetch from database
    console.log(`🗄️ Fetching sent payments for user ${userId} from database (page: ${page})`);
    
    const whereClause: any = { userId };
    // ! if status is provided, add it to the where clause
    if (status !== undefined) {
      whereClause.status = status;
    }

    // * 1. Calculate skip value for pagination
    const skip = (page - 1) * limit;

    // * 2. Get total count for pagination info
    const totalCount = await prisma.payment.count({
      where: whereClause,
    });

    // * 3. Get payments
    const payments = await prisma.payment.findMany({
      where: whereClause,
      select: {
        id: true,
        amount: true,
        message: true,
        createdAt: true,
        status: true,
        stream: {
          select: {
            id: true,
            title: true,
            streamLink: true,
            streamer: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
      skip,
      take: limit,
      orderBy: {
        createdAt: 'desc', // * Most recent payments first
      },
    });

    if (!payments) {
      console.error("No payments found for user:", userId);
      throw new Error("No payments found for user");
    }

    // * Calculate pagination info
    const totalPages = Math.ceil(totalCount / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    const result = {
      payments,
      pagination: {
        currentPage: page,
        totalPages,
        totalCount,
        hasNextPage,
        hasPrevPage,
        limit,
      },
    };

    // Cache the result for future requests
    await RedisService.cacheUserSentPayments(userId, status, page, result);

    return result;
  } catch (error) {
    console.error("Error getting sent payments:", error);
    throw new Error("Error getting sent payments");
  }
};

/*
 *    Get all payments received by a streamer with pagination and Redis caching
 *    Params: streamerId - streamer user id
 *    Params: status - payment status (optional)
 *    Params: page - page number (default: 1)
 *    Params: limit - items per page (default: 10)
 *    Returns: object with payments array, total count, and pagination info
 */
export const getReceivedPaymentsByStreamerId = async (
  streamerId: string,
  status: PaymentStatus | undefined,
  page: number = 1,
  limit: number = 10
) => {
  try {
    // First, try to get from cache
    const cachedPayments = await RedisService.getCachedStreamerReceivedPayments(streamerId, status, page);
    if (cachedPayments) {
      console.log(`📦 Returning cached received payments for streamer ${streamerId} (page: ${page})`);
      return cachedPayments;
    }

    // If not in cache, fetch from database
    console.log(`🗄️ Fetching received payments for streamer ${streamerId} from database (page: ${page})`);
    
    const whereClause: any = {
      stream: {
        streamerId: streamerId,
      },
    };
    
    // * 1. if status is provided, add it to the where clause
    if (status !== undefined) {
      whereClause.status = status;
    }

    // * 2. Calculate skip value for pagination
    const skip = (page - 1) * limit;

    // * 3. Get total count for pagination info
    const totalCount = await prisma.payment.count({
      where: whereClause,
    });

    // * 4. Get payments with pagination
    const payments = await prisma.payment.findMany({
      where: whereClause,
      select: {
        id: true,
        amount: true,
        message: true,
        createdAt: true,
        status: true,
        user: {
          select: {
            id: true,
            name: true,
            avatarUrl: true,
          },
        },
        stream: {
          select: {
            id: true,
            title: true,
            streamLink: true,
          },
        },
      },
      skip,
      take: limit,
      orderBy: {
        createdAt: 'desc', // * Most recent payments first
      },
    });

    if (!payments) {
      console.error("No payments found for streamer:", streamerId);
      throw new Error("No payments found for streamer");
    }

    // * 5. Calculate pagination info
    const totalPages = Math.ceil(totalCount / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    const result = {
      payments,
      pagination: {
        currentPage: page,
        totalPages,
        totalCount,
        hasNextPage,
        hasPrevPage,
        limit,
      },
    };

    // Cache the result for future requests
    await RedisService.cacheStreamerReceivedPayments(streamerId, status, page, result);

    return result;
  } catch (error) {
    console.error("Error getting received payments:", error);
    throw new Error("Error getting received payments");
  }
};

/*
 *    Updates a payment by id with cache invalidation, returns updated payment object or null on error
 */
export const updatePayment = async (id: string, status: PaymentStatus) => {
  try {
    const payment = await prisma.payment.update({
      where: { id },
      data: { status },
    });

    if (!payment) {
      console.error("Payment not found:", id);
      throw new Error("Payment not found");
    }

    // Update the payment in cache
    await RedisService.cachePaymentDetails(id, payment);

    // Invalidate related caches
    await RedisService.invalidatePaymentCaches(id, payment.userId, payment.streamId);

    // If payment is successful, update stream donations
    if (status === "SUCCESS") {
      await RedisService.incrementStreamDonations(payment.streamId, payment.amount);
    }

    return payment;
  } catch (error) {
    console.error("Error updating payment:", error);
    throw new Error("Error updating payment");
  }
};
