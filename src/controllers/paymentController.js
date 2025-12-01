import { asyncHandler } from "../middlewares/asyncHandler.js";
import { createOrderService, verifyPaymentService } from "../services/payment.service.js";


//Create Order:-
const createOrder = asyncHandler(async(req, res)=> {
    const {amount} = req.body;
    const userId = req.userId;
    const order = await createOrderService({amount, userId});

    return res.status(200).json({
        success: true,
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        key: process.env.RAZORPAY_KEY_ID,
    });
})

//Verify Order:-
const verifyPayment = asyncHandler(async (req, res)=> {
        const {razorpay_order_id, razorpay_payment_id, razorpay_signature} = req.body;

        const payment = await verifyPaymentService({
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature
        })

        return res.status(200).json({
            success: true,
            payment,
            message: "Payment verifcation Successfully"
        })
})

export {
    createOrder,
    verifyPayment
}