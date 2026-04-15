// server/app/routes/auth.routes.js
// Defines authentication routes for register, signin, signout, and session check
// Receives login/logout requests from React and calls auth.controller.js

import express from 'express';  // to create a router
import { signin, signout, register, readCookie } from '../controllers/auth.controller.js';  // Import auth controller functions

// Create router for auth endpoints
const router = express.Router();

// Routes for authentication
router.post("/register", register);
router.post('/signin', signin);
router.post('/signout', signout);
router.get('/read_cookie', readCookie);

// Export router
export default router;