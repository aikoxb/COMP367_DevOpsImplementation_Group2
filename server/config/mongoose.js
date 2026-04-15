// server/config/mongoose.js
// Connects server to MongoDB - Gets data from MongoDB into models (User, Course, StudyTask) to use in controllers

import mongoose from 'mongoose';  // to connect to MongoDB
import config from "./config.js"; // to get connection string value

// Mongoose models
import "../app/models/user.model.js";
import "../app/models/course.model.js";
import "../app/models/studyTask.model.js";

// Connect to MongoDB
export default async function connectDB() {
    try {
        if (!config.db) {
            throw new Error("MONGODB_URI is missing in .env file"); // throw error, if MONGODB_URI is missing
        }

        // Connect to MongoDB using config value
        await mongoose.connect(config.db); 
        console.log("MongoDB connected");
    } catch (err) {
        console.error("MongoDB connection failed:", err.message);
        process.exit(1);  // Exit the app if DB connection fails
    }
}