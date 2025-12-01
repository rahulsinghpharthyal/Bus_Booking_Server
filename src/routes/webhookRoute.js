// routes/webhookRoutes.js

import express from "express";
import { handleRazorpayWebhook } from "../controllers/webhookController.js";

const router = express.Router();

// Razorpay needs RAW JSON, not parsed
router.post("/razorpay", express.raw({ type: "application/json" }),
handleRazorpayWebhook
);

export default router;
