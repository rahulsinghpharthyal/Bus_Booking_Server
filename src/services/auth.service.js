import { generateAccessToken, generateRefreshToken, hashToken } from "../utils/token.js";
import User from "../models/user.model.js";
import ApiError from "../utils/ApiError.js";

export async function generateUserTokens(userId) {
  const accessToken = generateAccessToken(userId);
  const refreshToken = generateRefreshToken(userId);
  const hashed = hashToken(refreshToken);

  // STORE HASHED TOKEN IN DB
  const user = await User.findById(userId);
  if (!user) throw new ApiError(404, "User not found");

  user.refreshTokens.push({ token: hashed });
  await user.save();

  return { accessToken, refreshToken };
}


export async function rotateRefreshToken(oldRefreshToken) {
  if (!oldRefreshToken) throw new ApiError(401, "No refresh token provided");

  const hashedOld = hashToken(oldRefreshToken);

  // Find user who owns this hashed token
  const user = await User.findOne({ "refreshTokens.token": hashedOld });

  if (!user) throw new ApiError(401, "Invalid refresh token");

  // Remove old token (rotation security)
  user.refreshTokens = user.refreshTokens.filter(
    (t) => t.token !== hashedOld
  );

  // Create new refresh token
  const newRefreshToken = generateRefreshToken(user._id);
  const newHashedRefreshToken = hashToken(newRefreshToken);

  // Save the new one
  user.refreshTokens.push({ token: newHashedRefreshToken });
  await user.save();

  // Also generate a new access token
  const newAccessToken = generateAccessToken(user._id);

  return {
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
  };
}
