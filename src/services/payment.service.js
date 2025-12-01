import { razorpayInstance } from "../config/razorpay.js"
import Payment from "../models/payment.model.js";
import { generateExpectedSignature } from "../utils/token.js";

export async function createOrderService ({amount, userId}) {
    const options = {
        amount: amount * 100,
        currency: 'INR',
    }

    const order = await razorpayInstance.orders.create(options);

    await Payment.create({
        orderId: order?.id,
        amount,
        user: userId,
    })

    return order;
}

export async function verifyPaymentService({razorpay_order_id,razorpay_payment_id, razorpay_signature }){
    const expectedSignature = generateExpectedSignature(razorpay_order_id, razorpay_payment_id);

    if(expectedSignature !== razorpay_signature){
        throw new Error(400, "Payment verification failed");
    }

    const payment = await Payment.findOneAndUpdate(
        {orderId: razorpay_order_id},
        {paymentId: razorpay_payment_id, signature: razorpay_signature, status: "PENDING"},
        
    );
    return payment;
}


// 3️⃣ Mark payment as PAID
export async function markPaymentSuccessService (payment) {
    return await Payment.findOneAndUpdate(
        { paymentId: payment.id },
        { status: "SUCCESS" },
        { new: true }
    );
};
// 3️⃣ Mark payment as P
export async function markPaymentFailedService (payment) {
    return await Payment.findOneAndUpdate(
        { paymentId: payment.id },
        { status: "FAILED" },
        { new: true }
    );
};