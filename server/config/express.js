// server/config/express.js
// Configures and creates the Express app, registers middleware, and connects API routes
// Receives HTTP requests from React client and routes them to appropriate controllers

import express from "express"; // to create web server
import cookieParser from "cookie-parser"; // Allows server to read cookies sent by the browser (because JWT is stored in an HTTPOnly cookie)
import cors from "cors"; // Allows requests from a different origin because React runs on another port (allows cookies to be sent from the browser)
import config from "./config.js"; // for CORS origin

// Routes (Study Planner)
import authRoutes from "../app/routes/auth.routes.js"; // Login / logout / session routes
import courseRoutes from "../app/routes/courses.routes.js"; // Course CRUD routes
import taskRoutes from "../app/routes/studyTasks.routes.js"; // Study task CRUD routes

// Create and configure express app
export default function createApp() {
    // Create Express app instance
    const app = express(); 

    // Enable cors so the React front-end can call this API (and send cookies for authentication)
    app.use(
        cors({
          origin: config.clientOrigin || "http://localhost:5173", // Allow React origin from .env or default to localhost:5173 (Vite dev server)
          credentials: true // Allow cookies to be sent (HTTPOnly cookie authentication)
        })
    );

    app.use(express.json()); // Parse incoming JSON request bodies (to define req.body)
    app.use(express.urlencoded({ extended: true })); // Parse URL-encoded form data
    app.use(cookieParser()); // Parse cookies from incoming requests (to read req.cookies.token)

    // Test route response to confirm the server is running
    app.get("/api/test", (req, res) => res.send("Study Planner API is running"));

    // API Routes
    app.use("/api/auth", authRoutes); // Authentication routes (/api/auth/login, /api/auth/logout, /api/auth/me)
    app.use("/api/courses", courseRoutes); // Course routes (CRUD) (Courses belong to a user)
    app.use("/api/tasks", taskRoutes); // Task routes (CRUD) (Tasks belong to a course AND a user)

    return app; // Return the configured app to server.js
}
