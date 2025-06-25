import { PaymentStatus } from "@prisma/client";
import prisma from "../config/prisma";

/*
 *    Creates a new payment for a stream, returns payment object or null on error
 */
export const createPayment = async (orderId: string, amount: number, message: string | null, userId: string, streamId: string) => {
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
      return null;
    }

    return payment;
  } catch (error) {
    console.error("Error creating payment:", error);
    return null;
  }
};

/*
 *    Gets a payment by id, returns payment object or null on error
 */
export const getPayment = async (id: string) => {
  try {
    const payment = await prisma.payment.findUnique({
      where: { id },
    });

    if (!payment) {
      console.error("Payment not found:", id);
      return null;
    }

    return payment;
  } catch (error) {
    console.error("Error getting payment:", error);
    return null;
  }
};

/*
 *    Updates a payment by id, returns updated payment object or null on error
 */
export const updatePayment = async (id: string, status: PaymentStatus) => { 
  try {
    const payment = await prisma.payment.update({
      where: { id },
      data: { status },
    });

    if (!payment) {
      console.error("Payment not found:", id);
      return null;
    }

    return payment;
  } catch (error) {
    console.error("Error updating payment:", error);
    return null;
  }
};