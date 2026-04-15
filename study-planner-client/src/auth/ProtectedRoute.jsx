// study-planner-client/src/auth/ProtectedRoute.jsx
// Component that restricts access to protected routes and redirects unauthenticated users to /login

import { Navigate } from "react-router-dom"; // component to redirect to login

// Component to protect routes that require authentication
export default function ProtectedRoute({ user, loading, children }) {
    // While checking the cookie, show a simple loading message
    if (loading) {
        return <p>Loading...</p>;
    }

    // If the user is not authenticated (user is null), redirect to the login page
    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // Returns the child components (the protected content) to be rendered if the user is authenticated
    return children; 
}