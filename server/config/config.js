// server/config/config.js
// Loads environment-specific configuration values from .env
// Provides database URI, JWT secret, port, and client origin to the rest of the server.

import dotenv from "dotenv"; // environment variables from .env file

// Read values from .env file from the server folder
dotenv.config({ path: "./.env" }); 

const env = process.env.NODE_ENV || "development"; // Default to development

const config = await import(`./env/${env}.js`); // Load env-specific config file

export default config.default; // Export config object