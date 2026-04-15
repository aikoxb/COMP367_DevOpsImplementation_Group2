// study-planner-client/src/components/EditTaskModal.jsx
// Modal component for editing an existing study task
// Loads selected study task data into local state and calls parent (StudyTasks.jsx) onSave() to update

import { useEffect, useState } from "react"; // hooks to manage component state & side effects

// For styling
import { Modal, Form, Button, Row, Col, Alert } from "react-bootstrap"
import Select from "react-select";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

// Modal component for editing a study task
export default function EditTaskModal(props) {

    // Read properties passed down from parent component (StudyTasks.jsx)
    const show = props.show; // State - Modal visibility
    const onClose = props.onClose; // Function - Close modal
    const courses = props.courses; // Array - List of courses for dropdown
    const task = props.task; // Object - Task being edited
    const onSave = props.onSave; // Function - Update task in parent component

    // States - Form inputs
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [priority, setPriority] = useState("Medium");
    const [dueDate, setDueDate] = useState("");
    const [courseId, setCourseId] = useState("");
    const [completed, setCompleted] = useState(false);

    // State - Error message
    const [error, setError] = useState("");

    // When modal opens or task changes, load selected task into form
    useEffect(() => {
        if (show && task) {
            setError("");

            setTitle(task.title || "");
            setDescription(task.description || "");
            setPriority(task.priority || "Medium");

            // Convert date to yyyy-mm-dd format for datepicker input
            if (task.dueDate) {
                setDueDate(toYYYYMMDD(new Date (task.dueDate)));
            } else {
                setDueDate("");
            }

            // Set course id for dropdown
            if (task.course && task.course._id) {
                setCourseId(task.course._id); // If task.course is an object use its _id, 
            } else {
                setCourseId(task.course || ""); // Otherwise use the id string. or null if it's not set
            }

            setCompleted(task.completed === true);
        }
    }, [show, task]);

    // Close modal and clear local state
    function handleClose() {
        setError("");
        onClose();
    }

    async function handleSave(e) {
        e.preventDefault(); // Stop page from refreshing on form submission
        setError("");

        if (!task) {
            setError("No task selected.");
            return;
        }

        // Validate required fields
        if (!title || !dueDate || !priority || !courseId) {
            setError("Please fill in Title, Due Date, Priority, and Course.");
            return;
        }

        // Build request body
        const body = {
            title: title,
            description: description,
            priority: priority,
            dueDate: dueDate,
            completed: completed,
            course: courseId,
        };

        // Call parent update function
        const updatedSuccessfully = await onSave(task._id, body);

        // Close modal if successful
        if (updatedSuccessfully) {
            handleClose();
        }
    }

    // Helper function to map course code with its course name, used to populate course options
    const courseOptions = courses.map(function (c) {
        return { value: c._id, label: c.courseCode + " - " + c.courseName };
    });

    // Helper - priority options of a task
    const priorityOptions = [
        { value: "Low", label: "Low" },
        { value: "Medium", label: "Medium" },
        { value: "High", label: "High" },
    ];

    // Helper - convert to the correct Date format for storing it in backend
    function toYYYYMMDD(date) {
        const yyyy = date.getFullYear();
        const mm = String(date.getMonth() + 1).padStart(2, "0");
        const dd = String(date.getDate()).padStart(2, "0");
        return `${yyyy}-${mm}-${dd}`;
    }

    // Render Edit Task modal
    return (
        <Modal show={show} onHide={handleClose} centered contentClassName="sp-modal">
            <Modal.Header closeButton>
                <Modal.Title>Edit Study Task</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                {/* Show modal error message*/}
                {error && <Alert variant="danger">{error}</Alert>}

                <Form onSubmit={handleSave}>
                    {/* Title */}
                    <Form.Group className="mb-3">
                        <Form.Label>Title *</Form.Label>
                        <Form.Control
                            type="text"
                            value={title}
                            onChange={(e) => {setTitle(e.target.value);}} // Call setTitle to update title state when user types in the input field
                        />
                    </Form.Group>

                    {/* Course */}
                    <Form.Group className="mb-3">
                        <Form.Label>Course *</Form.Label>
                        <Select
                            classNamePrefix="sp-select"
                            options={courseOptions}
                            value={courseOptions.find((option) => option.value === courseId) || null}
                            onChange={function (option) { 
                                if (option) {
                                    setCourseId(option.value); // Call setCourseId to update courseId state when user selects option
                                } else {
                                    setCourseId("");
                                }
                            }}
                            placeholder="Select a course..."
                        />
                    </Form.Group>

                    {/* Priority & Due Date*/}
                    <Row>
                        <Col md={6} className="mb-3">
                            <Form.Label>Priority *</Form.Label>
                            <Select
                                classNamePrefix="sp-select"
                                options={priorityOptions}
                                value={
                                priorityOptions.find((option) => option.value === priority) || null}
                                onChange={function (option) { 
                                    if (option) {
                                        setPriority(option.value); // Call setPriority to update priority state when user selects option
                                    } else {
                                        setPriority("Medium");
                                    }
                                }}
                                placeholder="Select priority..."
                            />
                        </Col>

                        <Col md={6} className="mb-3">
                            <Form.Label>Due Date *</Form.Label>
                            <DatePicker
                                selected={dueDate ? new Date(dueDate) : null}
                                onChange={function (date) { // Update setDueDate state when user selects date
                                    if (!date) {
                                        setDueDate("");
                                        return;
                                    }

                                    // store date as YYYY-MM-DD
                                    setDueDate(toYYYYMMDD(date));
                                }}
                                dateFormat="yyyy-MM-dd"
                                placeholderText="yyyy-mm-dd"
                                className="form-control"
                                calendarClassName="sp-datepicker"
                                todayButton="Today"
                            />
                        </Col>
                    </Row>

                    <Form.Group className="mb-3">
                        <Form.Label>Description</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            value={description}
                            onChange={(e) => {setDescription(e.target.value);}} // Call setDescription to update description state when user types input
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Check
                            type="checkbox"
                            label="Completed"
                            checked={completed}
                            onChange={(e) => {setCompleted(e.target.checked);}} // Call setCompleted to update completed state when user toggles checkbox
                        />
                    </Form.Group>

                    <div className="modal-buttons">
                        <Button variant="secondary" onClick={handleClose}>
                            Cancel
                        </Button>
                        <Button variant="primary" className="primary-btn" type="submit" disabled={!task}>
                            <i className="bi bi-floppy me-2"></i>
                            Save Changes
                        </Button>
                    </div>
                </Form>
            </Modal.Body>
        </Modal>
    );
}