import { asyncHandler } from "../middlewares/asyncHandler.js";
import { markPaymentFailedService, markPaymentSuccessService } from "../services/payment.service.js";
import ApiError from "../utils/ApiError.js";
import { getIO } from "../utils/socket.js";
import { verifyWebhookSignature } from "../utils/token.js";

export const handleRazorpayWebhook = asyncHandler(async (req, res) => {
  const rawBody = req.body; // RAW BODY ONLY (Buffer)
  const signature = req.headers["x-razorpay-signature"];

  if (!signature) {
    throw new ApiError(400, "Missing Razorpay webhook signature");
  }

  // Verify webhook signature
  const isValid = verifyWebhookSignature(rawBody, signature);

  if (!isValid) {
    throw new ApiError(400, "Invalid webhook signature");
  }

  // Convert buffer → JSON
  const payload = JSON.parse(rawBody.toString());

  // Process event
//   await processWebhookEvent(payload);
  const event = payload.event;
  const paymentData = payload.payload?.payment?.entity;

  console.log("Webhook received event:", event);
  const orderId = paymentData.order_id;
 
  const io = getIO();
    if (event === "payment.captured") {
        await markPaymentSuccessService(paymentData);

        // 🔥 EMIT SUCCESS TO SPECIFIC USER ROOM
        io.to(orderId).emit("payment-status", {
            status: "success",
            message: "Payment captured successfully!",
            orderId,
            paymentId: payment.id,
        });
    }

    if (event === "payment.failed") {
      await markPaymentFailedService(payment);

      // 🔥 EMIT FAILURE TO SPECIFIC USER ROOM
      io.to(orderId).emit("payment-status", {
        status: "failed",
        message: "Payment failed",
        orderId,
        paymentId: payment.id,
      });
    }


  // Razorpay needs quick success response
  return res.status(200).send("Webhook processed successfully");
});
