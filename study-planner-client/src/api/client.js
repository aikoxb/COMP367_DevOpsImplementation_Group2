// study-planner-client/src/api/client.js
import axios from "axios";

const api = axios.create({
    baseURL: "/api", // Base URL for all API requests (matches the proxy configuration in vite.config.js)
    withCredentials: true, // sends cookie with every request
});

export default api;