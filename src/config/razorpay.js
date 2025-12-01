import Razorpay from "razorpay";
import { RZP_KEY_ID, RZP_KEY_SECRET } from "./config.js";

export const razorpayInstance = new Razorpay({
  key_id: RZP_KEY_ID,
  key_secret: RZP_KEY_SECRET,
});
