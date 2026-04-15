// server/config/env/development.js
// Defines development environment config values using variables from the .env file.

export default {
    db: process.env.MONGODB_URI,        // MongoDB connection string
    secretKey: process.env.JWT_SECRET,  // JWT secret key
    port: process.env.PORT || 4000,     // Server port
    clientOrigin: process.env.CLIENT_ORIGIN // Frontend URL
};

// Debug log to verify that the MONGODB_URI is being loaded correctly from the .env file
console.log("Loaded MONGODB_URI:", process.env.MONGODB_URI); 