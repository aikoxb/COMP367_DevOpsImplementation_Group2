// study-planner-client/src/pages/Register.jsx
// Displays registration form, collects user input in local state
// Then sends it to the backend via POST /auth/register, and redirects to Login on success

import { useState } from 'react'; // hook to manage form state and control loading/error/success states
import { useNavigate } from 'react-router-dom'; // hook to go to login page
import api from '../api/client'; // API client to make requests to the server

// For styling
import Select from "react-select"; // For dropdown
import { Container, Card, Form, Button, Alert, Spinner, Row, Col } from 'react-bootstrap';


// Register component that renders a registration form and handles user registration
export default function Register() {
    
    // Create navigate function to redirect after registration
    const navigate = useNavigate(); 

    // States - Form inputs
    const [username, setUsername] = useState(""); 
    const [password, setPassword] = useState(""); 
    const [firstName, setFirstName] = useState(""); 
    const [lastName, setLastName] = useState(""); 
    const [program, setProgram] = useState(""); 
    const [studyLevel, setStudyLevel] = useState("Advanced Diploma");
    const [preferredStudyTime, setPreferredStudyTime] = useState(""); 

    // States - Control loading & show error/success messages
    const [loading, setLoading] = useState(false); // disables form while request is running
    const [error, setError] = useState(null); 
    const [success, setSuccess] = useState(null); 

    // Runs when the user submits the registration form
    function handleSubmit(e) {
        e.preventDefault(); // Stop page from refreshing on form submission
        setError(null); // Clear previous error messages
        setSuccess(null); // Clear previous success messages

        if (!username || !password) {
            setError('Please fill in username and password.');
            return;
        }

        setLoading(true); // Disable inputs & show spinner while registration request is in progress

        // Send POST request to server with registration information
        api.post('/auth/register', { 
            username: username,
            password: password,
            firstName: firstName,
            lastName: lastName,
            program: program,
            studyLevel: studyLevel,
            preferredStudyTime: preferredStudyTime,
        })
        .then((res) => {
            // If registration is successful, show success message, clear form, then redirect to Login
            setSuccess("Registration successful! You can now log in.");

            setUsername("");
            setPassword("");
            setFirstName("");
            setLastName("");
            setProgram("");
            setStudyLevel("Advanced Diploma");
            setPreferredStudyTime("");

            // Go to login after some time so user can see success message
            setTimeout(() => {
                navigate("/login");
            }, 800);
        })
        .catch((err) => {
            console.error("Register failed:", err); // Log error for debugging purposes

            // Set specific error message returned from server if available, otherwise show generic error message
            let message = "Registration failed. Please try again.";
            if (err.response && err.response.data && err.response.data.error) {
                message = err.response.data.error;
            }
            setError(message); // Show error message to user
        })
        .finally(() => {
            setLoading(false); // Stop loading
        });
    }

    // Helper - Study level options to populate drop down
    const studyLevelOptions = [
        { value: "Diploma", label: "Diploma" },
        { value: "Advanced Diploma", label: "Advanced Diploma" },
        { value: "Bachelor", label: "Bachelor" },
        { value: "Master", label: "Master" },
        { value: "PhD", label: "PhD" },
    ];

    // Render registration form
    return (
        <Container className="d-flex justify-content-center mt-5 page-content">
            <Card className="sp-form" style={{ width: "50rem" }}>
                <Card.Body>
                    <Card.Title className="text-center mb-4">Create Account</Card.Title>

                    {/* Show success message */}
                    {success && <Alert variant="success">{success}</Alert>}

                    {/* Show error message */}
                    {error && <Alert variant="danger">{error}</Alert>}

                    {/* Form submits info when user presses Enter or clicks the button */}
                    <Form onSubmit={handleSubmit}>
                        {/* username & password */}
                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                <Form.Label>Username *</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Enter username"
                                    value={username}
                                    disabled={loading}
                                    onChange={(e) => setUsername(e.target.value)} // Call setUsername to update username state when user types input
                                />
                                </Form.Group>
                            </Col>

                            <Col md={6}>
                                <Form.Group className="mb-3">
                                <Form.Label>Password *</Form.Label>
                                <Form.Control
                                    type="password"
                                    placeholder="Enter password"
                                    value={password}
                                    disabled={loading}
                                    onChange={(e) => setPassword(e.target.value)} // Call setPassword to update password state when user types input
                                />
                                </Form.Group>
                            </Col>
                        </Row>

                        {/* first name & last name */}
                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                <Form.Label>First Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Enter first name"
                                    value={firstName}
                                    disabled={loading}
                                    onChange={(e) => setFirstName(e.target.value)} // Call setFirstName to update firstName state when user types input
                                />
                                </Form.Group>
                            </Col>

                            <Col md={6}>
                                <Form.Group className="mb-3">
                                <Form.Label>Last Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Enter last name"
                                    value={lastName}
                                    disabled={loading}
                                    onChange={(e) => setLastName(e.target.value)} // Call setLastName to update lastName state when user types input
                                />
                                </Form.Group>
                            </Col>
                        </Row>

                        {/*program & study level */}
                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                <Form.Label>Program</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="e.g., Software Engineering Technology"
                                    value={program}
                                    disabled={loading}
                                    onChange={(e) => setProgram(e.target.value)} // Call setProgram to update program state when user types input
                                />
                                </Form.Group>
                            </Col>

                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Study Level</Form.Label>
                                    <Select
                                        classNamePrefix="sp-select"
                                        options={studyLevelOptions}
                                        value={
                                        studyLevelOptions.find(function (o) {return o.value === studyLevel;}) || null}
                                        onChange={function (option) { // Call setStudyLevel to update studyLevel state when user selects option
                                            if (option) {
                                                setStudyLevel(option.value);
                                            }
                                        }}
                                        placeholder="Select study level..."
                                    />
                                </Form.Group>
                            </Col>
                        </Row>

                        {/* preferredStudyTime */}
                        <Form.Group className="mb-3">
                            <Form.Label>Preferred Study Time</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder='e.g., "Evenings", "Weekends", "Morning 9-11am"'
                                value={preferredStudyTime}
                                disabled={loading}
                                onChange={(e) => setPreferredStudyTime(e.target.value)} // Call setPreferredStudyTime to update preferredStudyTime state when user types input
                            />
                        </Form.Group>

                        <div className="d-flex justify-content-center mt-5">
                            {/* Submit button */}
                            <Button
                                variant="success"
                                type="submit"
                                className="primary-btn primary-form-btn"
                                disabled={loading}
                            >
                            {loading ? (
                                <>
                                <Spinner as="span" animation="border" size="sm" role="status" className="me-2"/>
                                Creating account...
                                </>
                            ) : (
                                "Register"
                            )}
                            </Button>
                        </div>

                        {/* Show user login link if they already have an account */}
                        <div className="text-center mt-3">
                            Already have an account?{" "}
                            <Button
                                variant="link"
                                className="p-0"
                                disabled={loading} //disable button while loading to prevent multiple submissions
                                onClick={() => navigate("/login")}
                            >
                                Sign in
                            </Button>
                        </div>
                    </Form>
                </Card.Body>
            </Card>
        </Container>
    );
}