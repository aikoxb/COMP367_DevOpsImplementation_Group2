// study-planner-client/src/pages/Login.jsx
// Displays login form, stores username/password in component state
// Then sends credentials to backend (POST /auth/signin), saves the returned user into App.jsx state via setUser, then redirects to Home (/)

import { useState } from 'react'; // hook from React to manage form state
import api from '../api/client'; // API client to make requests to the server
import { useNavigate } from 'react-router-dom'; // hook from to go to home page

// For styling
import { Container, Card, Form, Button, Alert, Spinner } from 'react-bootstrap';


// Login component that renders a login form and handles user authentication
export default function Login({ setUser }) {
    
    // Create navigate function to redirect after login
    const navigate = useNavigate(); 

    // States - Form inputs
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    // States - Control loading & show error messages
    const [loading, setLoading] = useState(false); // disables form while request is running
    const [error, setError] = useState(null);

    // Runs when the user submits login form
    function handleSubmit(e) {
        e.preventDefault(); // Stop page from refreshing on form submission
        setError(null); // Clear previous error messages

        if (!username || !password) {
            setError('Please enter username and password.');
            return;
        }

        setLoading(true); // Disable inputs & show spinner while login request is in progress

        // Send a POST request to server with user credentials (in request body)
        // Server sets a JWT in an HTTP-only cookie if login is successful
        api.post('/auth/signin', { auth: { username, password }})
        .then((res) => {
            // Update user state in the parent component (App.jsx) with user's information returned from the server
            setUser(res.data.user); 

            // Redirect to home page after successful login
            navigate("/");
        })
        .catch((err) => {
            console.error("Login Failed:", err); // Log error for debugging purposes
            let message = "Invalid username or password.";

            // Set specific error message returned from server if available, otherwise show generic error message
            if (err.response && err.response.data && err.response.data.error) {
                message = err.response.data.error;
            } 
            setError(message); // Show error message to user

            // Clear existing user state when login fails & reset password field
            setUser(null); 
            setPassword("");
        })
        .finally(() => {
            setLoading(false); // Stop loading
        });
    }

    // Render login form
    return (
        <Container className="d-flex justify-content-center mt-5 page-content">
            <Card className="sp-form" style={{ width: "30rem" }}>
                <Card.Body>
                    <Card.Title className="text-center mb-4">Sign In</Card.Title>

                    {/* Show error message */}
                    {error && <Alert variant="danger">{error}</Alert>}

                    {/* Form submits info when user presses Enter or clicks the button */}
                    <Form onSubmit={handleSubmit}>
                        {/* Username */}
                        <Form.Group className="mb-3">
                            <Form.Label>Username</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter username"
                                value={username}
                                disabled={loading}
                                autoFocus
                                onChange={(e) => setUsername(e.target.value)} // Call setUsername to update username state when user types input
                            />
                        </Form.Group>

                        {/* Password */}
                        <Form.Group className="mb-3">
                            <Form.Label>Password</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="Enter password"
                                value={password}
                                disabled={loading}
                                onChange={(e) => setPassword(e.target.value)} // Call setPassword to update password state when user types input
                            />
                        </Form.Group>

                        <div className="d-flex justify-content-center mt-5">
                        {/* Submit button */}
                            <Button
                                className="primary-btn primary-form-btn"
                                type="submit" 
                                disabled={loading} //disable button while loading to prevent multiple submissions
                            >
                                {loading ? (
                                    <>
                                        <Spinner as="span" animation="border" size="sm" role="status" className="me-2"/>
                                        Signing in...
                                    </>
                                ) : (
                                    "Login"
                                )}
                            </Button>
                        </div>
                    </Form>
                </Card.Body>
            </Card>
        </Container>
    );
}