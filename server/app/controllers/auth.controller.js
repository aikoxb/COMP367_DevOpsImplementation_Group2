// server/app/controllers/auth.controller.js
// Handles user registration, login, logout, and JWT cookie authentication
// Validates credentials, creates/verifies JWT tokens, and sends authentication responses to React

import jwt from "jsonwebtoken"; // To create and verify JWT tokens
import User from "../models/user.model.js"; //  for login and registration
import config from "../../config/config.js"; // Ifor JWT secret key
import { errorResponse } from "../utils/error.js"; // for error responses

// Create a JWT token that stores userId
function createToken(userId) {
    return jwt.sign(
        { userId: userId }, // Store userId inside the token payload
        config.secretKey, // Use secret key from config file
        { expiresIn: "7d" } // Token expires in 7 days
    );
}

// Login endpoint that creates the cookie
export async function signin(req, res) {
    try {
        // Read username and password from req.body.auth
        const { username, password } = req.body.auth || {}; // Use empty object as default to avoid destructuring undefined

        // If either username or password is missing, return an error
        if (!username || !password) {
            return errorResponse(res, 400, "Username and password are required");
        }

        // Find the user by username
        const user = await User.findOne({ username: username });
        if (!user) {
            return errorResponse(res, 401, "Invalid credentials");
        }

        // Verify password using the method from user.model.js
        const match = await user.verifyPassword(password);
        if (!match) {
            return errorResponse(res, 401, "Invalid credentials");
        }

        // Create JWT token for the user after successful login
        const token = createToken(user._id);

        // Store & set the JWT token in an HTTP-only cookie
        res.cookie("token", token, {
            httpOnly: true, // Browser JS cannot read cookie (Cookie is HTTP-only)
            sameSite: "lax", // The cookie is sent when the user is navigating normally in the browser (not for random or unrelated website requests)
            secure: false, // Set to true only when using HTTPS in production
        });

        // Respond with user info
        return res.json({
            message: "Signed in",
            user: {
                id: user._id,
                username: user.username,
                firstName: user.firstName,
                lastName: user.lastName,
                program: user.program,
                studyLevel: user.studyLevel,
                preferredStudyTime: user.preferredStudyTime,
                createdAt: user.createdAt
            }
        });
    } catch (err) {
        return errorResponse(res, 500, err.message); // Send server error if something fails
    }
}

// Logout endpoint that clears the cookie
export function signout(req, res) {
    // Clear the token cookie so the browser stops sending JWT
    res.clearCookie('token', {
        httpOnly: true,
        sameSite: 'lax',
        secure: false, // Set to true only when using HTTPS in production
    });

    // Respond with a success message
    return res.status(200).json({ message: 'Signed out' });
}

// Read the auth cookie and tell the frontend if the user is logged in
export async function readCookie(req, res) {
    const token = req.cookies.token; // Read JWT token from cookies

    // If there is no token cookie, user is not logged in
    if (!token) {
        return res.json({ authenticated: false });
    }

    try {
        // Verify token and extract userId
        const decoded = jwt.verify(token, config.secretKey);

        // Find the user from the database using the token userId
        const user = await User.findById(decoded.userId).select("-password");

        // If user doesn't exist, treat as logged out
        if (!user) {
            return res.json({ authenticated: false });
        }

        // If token is valid and user exists, return authenticated true and user profile
        return res.json({ authenticated: true, user: user });
    } catch (err) {
        // If token is invalid, treat as logged out
        return res.json({ authenticated: false });  
    }
}

export async function register(req, res) {
    try {
        // Read user fields from request body
        const { username, password, firstName, lastName, program, studyLevel, preferredStudyTime } = req.body;

        // Check if username and password are provided
        if (!username || !password) {
            return errorResponse(res, 400, "Username and password are required");
        }

        // Check if username is already taken
        const existingUser = await User.findOne({ username: username });
        if (existingUser) {
            return errorResponse(res, 400, "Username already exists");
        }

        // Create user (password will be hashed by the pre('save') hook)
        const newUser = await User.create({
            username: username,
            password: password,
            firstName: firstName,
            lastName: lastName,
            program: program,
            studyLevel: studyLevel,
            preferredStudyTime: preferredStudyTime
        });

        // Return created user profile (do not return password)
        return res.status(201).json({
            message: "Registered",
            user: {
                id: newUser._id,
                username: newUser.username,
                firstName: newUser.firstName,
                lastName: newUser.lastName,
                program: newUser.program,
                studyLevel: newUser.studyLevel,
                preferredStudyTime: newUser.preferredStudyTime,
                createdAt: newUser.createdAt
            }
        });
    } catch (err) {
        return errorResponse(res, 400, err.message);
    }
}
