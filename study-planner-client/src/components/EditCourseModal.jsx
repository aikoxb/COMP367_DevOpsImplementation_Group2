// study-planner-client/src/components/EditCourseModal.jsx
// Modal component for editing an existing course
// Loads selected course data into local state and calls parent (Courses.jsx) onSave() to update

import { useEffect, useState } from "react"; // hooks to manage component state & side effects
import { Modal, Button, Form, Alert } from "react-bootstrap"; // For styling

// Modal component to edit a course
export default function EditCourseModal(props) {

    // Read properties passed down from parent component (Courses.jsx)
    const show = props.show; // State - Modal visibility
    const onClose = props.onClose; // Function - Close modal
    const onSave = props.onSave; // Function - Update course in parent component
    const course = props.course; // Object - Course being edited

    // States - Form inputs
    const [courseCode, setCourseCode] = useState("");
    const [courseName, setCourseName] = useState("");
    const [semester, setSemester] = useState("");

    // State - Error message
    const [error, setError] = useState("");

    // When modal opens, load selected course into form inputs
    useEffect(() => {
        if (show && course) {
            setCourseCode(course.courseCode || "");
            setCourseName(course.courseName || "");
            setSemester(course.semester || "");
            setError("");
        }
    }, [show, course]);

    // Close modal and clear local state
    function handleClose() {
        setError("");
        onClose();
    }

    // Save changes
    async function handleSave(e) {
        e.preventDefault(); // Stop page from refreshing on form submission
        setError("");

        if (!course || !course._id) {
            setError("No course selected.");
            return;
        }

        // Validate required fields
        if (!courseCode || !courseName || !semester) {
            setError("Please fill in Course Code, Course Name, and Semester.");
            return;
        }

        // Build request body
        const body = {
            courseCode: courseCode,
            courseName: courseName,
            semester: semester,
        };

        // Call parent update function
        const updatedSuccessfully = await onSave(course._id, body);

        // Close modal if successful
        if (updatedSuccessfully) {
            handleClose();
        } else {
            setError("Failed to update course.");
        }
    }

    // Render Edit modal
    return (
        <Modal show={show} onHide={handleClose} centered contentClassName="sp-modal">
            <Modal.Header closeButton>
                <Modal.Title>Edit Course</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                {/* Show modal error message */}
                {error && <Alert variant="danger">{error}</Alert>}

                <Form onSubmit={handleSave}>
                    {/* Course Code */}
                    <Form.Group className="mb-3">
                        <Form.Label>Course Code *</Form.Label>
                        <Form.Control
                            type="text"
                            value={courseCode}
                            onChange={(e) => {setCourseCode(e.target.value);}} // Call setCourseCode to update courseCode state when user types input
                        />
                    </Form.Group>

                    {/* Course Name */}
                    <Form.Group className="mb-3">
                        <Form.Label>Course Name *</Form.Label>
                        <Form.Control
                            type="text"
                            value={courseName}
                            onChange={(e) => {setCourseName(e.target.value);}} // Call setCourseName to update courseName state when user types input
                        />
                    </Form.Group>

                    {/* Semester*/}
                    <Form.Group>
                        <Form.Label>Semester *</Form.Label>
                        <Form.Control
                            type="text"
                            value={semester}
                            onChange={(e) => {setSemester(e.target.value);}} // Call setSemester to update semester state when user types input
                        />
                    </Form.Group>

                    {/* Cancel & Save buttons */}
                    <div className="modal-buttons">
                        
                        <Button variant="secondary" onClick={handleClose}>
                            Cancel
                        </Button>

                        <Button variant="primary" className="primary-btn" type="submit">
                            <i className="bi bi-floppy me-2"></i>
                            Save Changes
                        </Button>
                    </div>
                </Form>
            </Modal.Body>
        </Modal>
    );
}