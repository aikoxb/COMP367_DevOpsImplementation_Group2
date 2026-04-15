// study-planner-client/src/auth/useAuth.js
// Authentication hook that checks for an authenticated user by reading the JWT HTTP-only cookie from the server 
// and provides user state to the rest of the app

import api from '../api/client'; // API client to make requests to the server
import { useState, useEffect } from 'react'; // Hooks for managing state and side effects

// Hook to manage authentication state
export default function useAuth() {
    // States - Authenticated user's information & loading state
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Check for an existing authenticated session when component mounts
    useEffect(() => {

        // Send GET request to fetch valid JWT HTTP-only cookie
        api.get('/auth/read_cookie')
        .then(response => {

            if (response.data.authenticated) {
                setUser(response.data.user); // Update the user state with the user's information returned from the server
            } else {
                setUser(null); // set user state to null to indicate that no user is authenticated
            }

            setLoading(false);
        })
        .catch(() => {
            setUser(null);  // If there's an error, treat it as not logged in
            setLoading(false);
        });

    }, []); // empty dependency array so that this runs only once on mount

    // Return user object, function to update user state, and loading state to indicate if the authentication check is still in progress
    return { user, setUser, loading };
}
