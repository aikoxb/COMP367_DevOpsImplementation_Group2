// study-planner-client/src/components/AddTaskModal.jsx
// Modal component for adding a new study task by calling parent (StudyTasks.jsx) onAddTask() with form data to create task in database


import { useEffect, useState } from "react"; // hooks to manage component state & side effects


// For styling
import { Modal, Form, Button, Row, Col, Alert } from "react-bootstrap";
import Select from "react-select";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

// Modal component to add a new study task
export default function AddTaskModal(props) {

    // Read properties passed down from parent component (StudyTasks.jsx)
    const show = props.show; // State - Modal visibility
    const onClose = props.onClose; // Function - Close modal
    const courses = props.courses; // Array - List of courses for dropdown
    const onAddTask = props.onAddTask; // Function - Add task in parent component (StudyTasks.jsx)

    // Modal form state
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [priority, setPriority] = useState("Medium");
    const [dueDate, setDueDate] = useState("");
    const [courseId, setCourseId] = useState("");

    // State - Error message
    const [error, setError] = useState("");

    // When the modal opens, set default course
    useEffect(() => {
        if (show) {
            if (courses.length > 0) {
                setCourseId(courses[0]._id);
            } else {
                setCourseId("");
            }
        }
    }, [show, courses]);

    // Clear form inputs
    function resetForm() {
        setTitle("");
        setDescription("");
        setPriority("Medium");
        setDueDate("");

        if (courses.length > 0) {
            setCourseId(courses[0]._id);
        } else {
            setCourseId("");
        }
    }

    // Reset form and clears error when closing
    function handleClose() {
        resetForm();
        setError("");
        onClose();
    }

    // Submits form to parent component (StudyTasks.jsx)
    async function handleSubmit(e) {
        e.preventDefault();
        setError("");

        // Validate required fields
        if (!title || !dueDate || !priority || !courseId) {
            setError("Please fill in Title, Due Date, Priority, and Course.");
            return;
        }

        // Build task body to send to parent
        const body = {
            title: title,
            description: description,
            priority: priority,
            dueDate: dueDate,
            completed: false,
            course: courseId,
        };

        const createdSuccessfully = await onAddTask(body);

        // If created successfully, close &reset modal
        if (createdSuccessfully) {
            handleClose();
        } else {
            // If parent failed, show error
            setError("Failed to create task.");
        }
    }

    // Helper function to map course code with its course name, used to populate course options
    const courseOptions = courses.map(function (c) {
        return { value: c._id, label: c.courseCode + " - " + c.courseName };
    });

    // Helper - priority options of  a task
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

    // Render Add Task modal
    return (
        <Modal show={show} onHide={handleClose} centered contentClassName="sp-modal">
            <Modal.Header closeButton>
                <Modal.Title>Add Study Task</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                {/* show modal error message */}
                {error && <Alert variant="danger">{error}</Alert>}

                {courses.length === 0 ? (
                    <Alert variant="warning" className="mb-0">
                        You need to create at least one course before adding study tasks.
                    </Alert>
                ) : (
                    <Form onSubmit={handleSubmit}>
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
                                <Form.Group className="mb-3">
                                    <Form.Label>Priority *</Form.Label>
                                    <Select
                                        classNamePrefix="sp-select"
                                        options={priorityOptions}
                                        value={priorityOptions.find((option) => option.value === priority) || null}
                                        onChange={function (option) { 
                                            if (option) {
                                                setPriority(option.value); // Call setPriority to update priority state when user selects option
                                            } else {
                                                setPriority("Medium");
                                            }
                                        }}
                                        placeholder="Select priority..."
                                    />
                                </Form.Group>
                            </Col>

                            <Col md={6} className="mb-3">
                                <Form.Label>Due Date *</Form.Label>
                                <DatePicker
                                    selected={dueDate ? new Date(dueDate) : null}
                                    onChange={function (date) { 
                                        if (!date) {
                                            setDueDate(""); 
                                            return;
                                        }

                                        // store date as YYYY-MM-DD
                                        setDueDate(toYYYYMMDD(date)); // Call setDueDate to update dueDate state when user selects option
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
                                type="text"
                                value={description}
                                onChange={function (e) {
                                    setDescription(e.target.value);
                                }}
                                placeholder="Optional"
                            />
                        </Form.Group>
                        
                        <div className="modal-buttons">
                            <Button variant="secondary" type="button" onClick={handleClose}>
                                Cancel
                            </Button>
                            <Button variant="success" type="submit" className="primary-btn" >
                                <i className="bi bi-plus-lg me-2"></i>
                                Add Task
                            </Button>
                        </div>
                    </Form>
                )}
            </Modal.Body>
        </Modal>
    );
}