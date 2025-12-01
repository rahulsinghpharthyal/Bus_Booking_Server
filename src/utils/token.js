import jwt from "jsonwebtoken";
import crypto from 'crypto';

// Access token - short life
export const generateAccessToken = (userId) => {
  const accessToken = jwt.sign(
    {userId: userId },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRY}
  );
  return accessToken;
};

// Refresh token - long life
export const generateRefreshToken = (userId) => {
  const refreshToken = jwt.sign(
    { userId },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRY }
  );
  return refreshToken;
};

// Hash refresh token before storing
export const hashToken = (token) => {
  return crypto.createHash("sha256").update(token).digest("hex");
};


// generate expectedSignature for razorpay payment verification:-
export const generateExpectedSignature = (orderId, paymentId) => {
  const body = `${orderId}|${paymentId}`;
  return crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(body)
    .digest("hex");
};


const WEBHOOK_SECRET = process.env.RAZORPAY_WEBHOOK_SECRET;

// 1️⃣ Validate webhook signature
export const verifyWebhookSignature = (rawBody, signature) => {
  const expected = crypto
    .createHmac("sha256", WEBHOOK_SECRET)
    .update(rawBody)
    .digest("hex");

  return expected === signature;
};


