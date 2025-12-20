import logger from "../config/logger.js";
import { asyncHandler } from "../middlewares/asyncHandler.js";
import {
  createOrderService,
  verifyPaymentService,
} from "../services/payment.service.js";
import { getIO } from "../utils/socket.js";

//Create Order:-
const createOrder = asyncHandler(async (req, res) => {
  const { amount } = req.body;
  const userId = req.userId;
  const order = await createOrderService({ amount, userId });

  return res.status(200).json({
    success: true,
    orderId: order.id,
    amount: order.amount,
    currency: order.currency,
    key: process.env.RAZORPAY_KEY_ID,
  });
});

//Verify Order:-
const verifyPayment = asyncHandler(async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
    req.body;

  const payment = await verifyPaymentService({
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
  });

  // try{
  //   const io = getIO();
  //   io.to(razorpay_order_id).emit("payment_status", {
  //     status: "PENDING",
  //     message: "Waiting for Razorpay webhook confirmation…",
  //     orderId: razorpay_order_id,
  //   });
  // }catch(error){
  //   logger.error("Error on socket Starting...")
  // }

  return res.status(200).json({
    success: true,
    status: "PENDING",
    payment,
    message: "Payment verified (pending final confirmation).",
  });
});

export { createOrder, verifyPayment };
