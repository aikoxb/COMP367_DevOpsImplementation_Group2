// server/app/middleware/auth.middleware.js
// Middleware that verifies the JWT stored in the HTTP-only cookie
// Extracts userId from the token and attaches it to req for use in controllers

import jwt from "jsonwebtoken"; // to verify tokens
import config from "../../config/config.js"; // for secret key

// Middleware to protect routes that require authentication
export const requireAuth = (req, res, next) => {
  const token = req.cookies.token; // Read the JWT token cookie

  // If there is no token, return response that the user is not authenticated
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const payload = jwt.verify(token, config.secretKey); // Verify token using secret key
    req.userId = payload.userId; // Save userId for controllers to use
    next(); // Continue to the next function
  } catch (err) {
    return res.status(401).json({ message: "Unauthorized" }); // return response if token is invalid
  }
};