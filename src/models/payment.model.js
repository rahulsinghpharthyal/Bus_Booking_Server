import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    orderId: { 
        type: String, 
        required: true 
    },
    paymentId: { 
        type: String 
    },
    signature: { 
        type: String 
    },
    amount: { 
        type: Number, 
        required: true 
    },
    currency: { 
        type: String, 
        default: "INR" 
    },
    status: { 
        type: String, 
        enum: ["PENDING", "SUCCESS", "FAILED"], 
        default: "PENDING" 
    },
    user: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User", 
        required: true 
    },
  },
  { timestamps: true }
);

const Payment = mongoose.model("Payment", paymentSchema);

export default Payment;
