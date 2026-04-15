// study-planner-client/src/components/AddCourseModal.jsx
// Modal component for adding a new course by calling parent (Courses.jsx) onAddCourse() with form data to create course in database

import { useEffect, useState } from "react"; // hooks to manage component state & side effects
import { Modal, Form, Button, Alert } from "react-bootstrap"; // For styling

// Modal component for adding a new course
export default function AddCourseModal(props) {

    // Read properties passed down from parent component (Courses.jsx)
    const show = props.show; // State - Controls modal open/close
    const onClose = props.onClose; // Function - Closes modal
    const onAddCourse = props.onAddCourse; // Function - Create course


    // States - Form inputs
    const [courseCode, setCourseCode] = useState("");
    const [courseName, setCourseName] = useState("");
    const [semester, setSemester] = useState("");

    // State - Error message
    const [error, setError] = useState("");

    // When modal opens reset form & clear old errors
    useEffect(() => {
        if (show) {
            resetForm();
            setError("");
        }
    }, [show]);

    // Clear form inputs
    function resetForm() {
        setCourseCode("");
        setCourseName("");
        setSemester("");
    }

    // Close modal and clear local state
    function handleClose() {
        resetForm();
        setError("");
        onClose();
    }

    // Submits form to parent component (Courses.jsx)
    async function handleSubmit(e) {
        e.preventDefault(); // Stop page from refreshing on form submission
        setError("");

        // Validate required fields
        if (!courseCode || !courseName || !semester) {
            setError("Please fill in Course Code, Course Name, and Semester.");
            return;
        }

        // Build course body to send to parent
        const body = {
            courseCode: courseCode,
            courseName: courseName,
            semester: semester,
        };

        // Call parent add function & pass course body, wait for response to see if it was successful
        const createdSuccessfully = await onAddCourse(body);

        // If created successfully, close & reset modal
        if (createdSuccessfully) {
            handleClose();
        } else {
            // If parent failed, show error
            setError("Failed to create course.");
        }
    }

    // Render Add Course modal
    return (
        <Modal show={show} onHide={handleClose} centered contentClassName="sp-modal">
            <Modal.Header closeButton>
                <Modal.Title>Add Course</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                {/* show modal error message */}
                {error && <Alert variant="danger">{error}</Alert>}

                <Form onSubmit={handleSubmit}>
                    {/* Course Code */}
                    <Form.Group className="mb-3">
                        <Form.Label>Course Code *</Form.Label>
                        <Form.Control
                            type="text"
                            value={courseCode}
                            onChange={(e) => { setCourseCode(e.target.value); }} // Call setCourseCode to update courseCode state when user types course code
                            placeholder="e.g., COMP123"
                        />
                    </Form.Group>
                    

                    {/* Course Name */}
                    <Form.Group className="mb-3">
                        <Form.Label>Course Name *</Form.Label>
                        <Form.Control
                            type="text"
                            value={courseName}
                            onChange={(e) => { setCourseName(e.target.value); }} // Call setCourseName to update courseName state when user types course name
                            placeholder="e.g., Software Engineering Fundamentals"
                        />
                    </Form.Group>

                    {/* Semester*/}
                    <Form.Group>
                        <Form.Label>Semester *</Form.Label>
                        <Form.Control
                            type="text"
                            value={semester}
                            onChange={(e) => { setSemester(e.target.value); }} // Call setSemester to update semester state when user types semester
                            placeholder="e.g., Winter 2026"
                        />
                    </Form.Group>

                    {/* Cancel & Add buttons */}
                    <div className="modal-buttons">
                        <Button variant="secondary" type="button" onClick={handleClose}>
                            Cancel
                        </Button>

                        <Button type="submit" variant="success" className="primary-btn">
                            <i className="bi bi-plus-lg me-2"></i>
                            Add Course
                        </Button>
                    </div>
                </Form>
            </Modal.Body>
        </Modal>
    );
}