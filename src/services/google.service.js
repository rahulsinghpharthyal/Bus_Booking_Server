import { OAuth2Client } from "google-auth-library";
import ApiError from "../utils/ApiError.js";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export async function verifyGoogleToken(idToken) {
  try {
    const ticket = await client.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    if (!payload) {
      throw new ApiError(400, "Failed to get user details from Google");
    }

    return payload;
  } catch (err) {
    throw new ApiError(401, "Invalid Google ID token");
  }
}
