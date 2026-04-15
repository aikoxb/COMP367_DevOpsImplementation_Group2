// server/server.js
// Set the environment (development by default)
process.env.NODE_ENV = process.env.NODE_ENV || "development";



import connectDB from "./config/mongoose.js"; // Import MongoDB connection function
import createApp from "./config/express.js"; // Import express app builder
import config from "./config/config.js"; // Import config object that reads from process.env

//Connect to MongoDB first, to fail early if DB is not reachable
await connectDB(); 

// Create the Express app
const app = createApp();

const port = config.port || 4000; // Use port from config or default to 4000

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);  // Show server URL
});

// Export app for testing
export default app;
