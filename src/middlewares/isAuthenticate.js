import jwt from "jsonwebtoken";
import ApiError from "../utils/ApiError.js";

const isAuthenticate = (req, res, next) => {
  try {
    const authHeader = req.headers.Authorization || req.headers.authorization;
    
    // 1. No token
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new ApiError(401, "Not token provided");
    }
    const token = authHeader.split(" ")[1];
    // Synchronous verify — safe inside try/catch
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    return next(new ApiError(401, "Invalid or expired token"));
  }
};

export { isAuthenticate };
