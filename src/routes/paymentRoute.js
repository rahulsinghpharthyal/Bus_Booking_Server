import express from "express";
import { isAuthenticate } from "../middlewares/isAuthenticate.js";
import { createOrder, verifyPayment } from "../controllers/paymentController.js";

const router = express.Router();

router.post("/create-order", isAuthenticate, createOrder);
router.post("/verify", isAuthenticate, verifyPayment);

export default router;
