import crypto from "crypto";
import { reqUser } from "../types";
import razorpay from "../config/razorpay";
import { createPayment, getPayment, updatePayment } from "../services/payment";

/*
 *    Creates an order
 *    POST /api/payment/order
 *    Returns: order object or null on error
 */
export const createOrderHandler = async (req: reqUser, res: any) => {
  try {
    // * STEP 1: Get the amount from the request body
    const { amount, message, streamId } = req.body;
    const amountInPaise = amount * 100;

    // * STEP 2: Create the options for the order
    const options = {
      amount: amountInPaise,
      currency: "INR",
      receipt: `tubepay#${Date.now()}`,
    };

    // * STEP 3: Create the order
    const order = await razorpay.orders.create(options);

    // * STEP 4: Check if the order is created
    if (!order) {
      console.log("Error creating order", order, options);

      return res.status(500).send("Error creating order");
    }

    // * STEP 5: Create the payment
    await createPayment(order.id, amount, message, req.user.uid, streamId);

    // * STEP 6: Send the order to the client
    res.status(200).json(order);
  } catch (err) {
    console.log(err);

    res.status(500).send("Error creating order");
  }
};

/*
 *    Verifies the payments
 *    POST /api/payment/verify
 *    Returns: success: true or false
 */
export const verifyOrderHandler = async (req: reqUser, res: any) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
    req.body;

  console.log(req.body);
  const hmac = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!);
  hmac.update(razorpay_order_id + "|" + razorpay_payment_id);
  const generatedSignature = hmac.digest("hex");

  if (generatedSignature === razorpay_signature) {

    // * STEP 1: Get the payment
    const payment = await getPayment(razorpay_order_id);

    if (!payment) {
      console.log(`Payment not found for order id: ${razorpay_order_id}`);

      return res
        .status(404)
        .send({ success: false, message: "Payment not found." });
    }

    // * STEP 2: Update the payment
    await updatePayment(razorpay_order_id, "SUCCESS");

    console.log(`Payment verified successfully for payment id: ${razorpay_payment_id}`);
    res
      .status(200)
      .send({ success: true, message: "Payment verified successfully!" });
  } else {

    console.log(`Payment verification failed for payment id: ${razorpay_payment_id}`);
    res
      .status(401)
      .send({ success: false, message: "Payment verification failed." });
  }
};
