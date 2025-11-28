import { asyncHandler } from "../middlewares/asyncHandler.js";
import logger from "../config/logger.js";
import { createOrUpdateGoogleUser } from "../services/user.service.js";
import { generateUserTokens, rotateRefreshToken } from "../services/auth.service.js";
import { verifyGoogleToken } from "../services/google.service.js";

const loginOrSignup = asyncHandler(async (req, res, next) => {
  const { id_token } = req.body;
  if (!id_token) {
    throw new ApiError(400, "ID token is required");
  }

  // 1️⃣ Verify Google Token
  const payload = await verifyGoogleToken(id_token);

  // logger.info("this is payload-->", payload);

  const { email, sub: google_id, name, picture, email_verified } = payload;
  if (!email_verified) {
    throw new ApiError(400, "Email is not verified by Google");
  }

  if (!email) {
    throw new ApiError(400, "Google login failed. No email returned");
  }

  // 2️⃣ Create or update user
  const { user, isNewUser } = await createOrUpdateGoogleUser({
    google_id,
    email,
    name,
    picture,
  });

  console.log('this is  user', user)

  // GENERATE TOKENS AND STORE HASHED TOKEN IN DB
  const { accessToken, refreshToken } = await generateUserTokens(
    user._id
  );

  // Remove sensitive fields from response
  const safeUser = {
    id: user._id,
    name: user.name,
    email: user.email,
    user_photo: user.user_photo,
  };

  // You MUST send the refresh token in JSON. Because:
  // Mobile apps do not use cookies
  // They store tokens securely (keychain / keystore)
  // The refresh token is required to generate new access tokens

  // SEND RAW refresh token to client
  return res.status(200).json({
    user: safeUser,
    accessToken,
    refreshToken,
    isNewUser,
  });
});

const generateNewAccessTokenByRefreshToken = asyncHandler(
  async (req, res, next) => {
    const { refreshToken: reqRefreshToken } = req.body;

    const tokens = await rotateRefreshToken(reqRefreshToken);

    return res.status(200).json(tokens);
  }
);

export { loginOrSignup, generateNewAccessTokenByRefreshToken };
