// study-planner-client/src/pages/Courses.jsx
// Protected courses page to view/add/edit/delete courses
// Gets courses from backend (GET /courses) and sends changes to backend (POST /courses, PUT /courses/:id, DELETE /courses/:id)

import { useEffect, useState } from "react"; // React hooks for managing component state and side effects
import api from "../api/client"; // API client to make requests to the server
import AddCourseModal from "../components/AddCourseModal"; // Modal component for adding a new course
import EditCourseModal from "../components/EditCourseModal"; // Modal component for editing a course

// For styling
import { Container, Card, Button,  Row, Col, Spinner, Alert} from "react-bootstrap";
import "./Courses.css"; 

// Courses page component (protected) for courses management
export default function Courses() {
    // State - Store list of courses
    const [courses, setCourses] = useState([]);

    // States - Modal visibility
    const [showAddModal, setShowAddModal] = useState(false); // Add modal
    const [showEditModal, setShowEditModal] = useState(false); // Edit modal

    // State - Which course is currently being edited
    const [selectedCourse, setSelectedCourse] = useState(null);

    // States - Control loading & show error messages
    const [loading, setLoading] = useState(true);

    // State - Error message
    const [pageError, setPageError] = useState("");
    
    // ============================
    // SHOW COURSES
    // ============================

    // Fetch courses list when page loads
    useEffect(() => {
        showCourses();
    }, []);

    // Fetches courses list from server & updates the courses state to display them on the page
    async function showCourses() {
        try {
            setLoading(true); // Disable inputs & show spinner
            setPageError(""); // Clear previous error messages

            // Send a GET request to fetch courses
            const response = await api.get("/courses"); 

            // Update the courses state with response data
            setCourses(response.data);
        }
        catch (error) {
            console.error(error);
            setPageError("Failed to load courses");
        }
        finally {
            setLoading(false); // Stop loading
        }
    }

    // ============================
    // CREATE COURSE
    // ============================

    // Adds a new course by sending a POST request to the server
    async function addCourse(body) {
        try {
            // Send a POST request to the server with the new course data to create a new course
            const response = await api.post("/courses", body);

            // Add new course to the top of the list with the course data
            setCourses(function (prevCourses) {
                return [response.data, ...prevCourses];
            });

            return true; // Pass true to modal so it closes
        } catch (error) {
            console.error(error);
            return false; // Pass false to modal so it stays open & shows modal error message
        }
    }

    // ============================
    // UPDATE COURSE
    // ============================

    // Updates an existing course by sending a PUT request to the server
    async function updateCourse(courseId, body) {
        try {
            // Send a PUT request to the server with the updated course data to update the course 
            const response = await api.put("/courses/" + courseId, body);

            // Update the course in the local state with the updated course data returned from the server
            const updatedList = courses.map(function (originalCourse) {
                if (originalCourse._id === courseId) {
                    return response.data;
                }
                return originalCourse; // Keep course unchanged if it's not the one that was updated
            });

            setCourses(updatedList); // Update the courses state with the updated course list
            return true; // Pass true to modal so it closes
        } catch (error) {
            console.error(error);
            return false; // Pass false to modal so it stays open & shows modal error message
        }
    }

    // ============================
    // DELETE COURSE
    // ============================

    // Deletes a course by sending a DELETE request to the server
    async function deleteCourse(courseId) {
        setPageError(""); // Clear previous error messages

        const confirmDelete = window.confirm("Are you sure you want to delete this course? This will also delete all linked study tasks.");

        // If user cancels the deletion, exit the function 
        if (!confirmDelete) {
            return; 
        }

        try {
            // Send DELETE request to the server to delete the course with course ID
            await api.delete("/courses/" + courseId); 

            // Remove the deleted course from the UI list by filtering it out based on its id
            const updatedList = courses.filter(function (course) {
                return course._id !== courseId;
            });

            // Update the courses state with the updated course list
            setCourses(updatedList); 
        } catch (error) {
            console.error(error);
            setPageError("Failed to delete course.");
        }
    }

    // ============================
    // OPEN/CLOSE EDIT MODAL
    // ============================

    // Opens the edit course modal and populate the form inputs with the existing course data
    function openEditModal(course) {
        setSelectedCourse(course); // Save which course is being edited
        setShowEditModal(true); // Open modal
    }

    function closeEditModal() {
        setShowEditModal(false); // Close modal
        setSelectedCourse(null); // Clear selected course
    }
    
    // Render Courses page
    return (
        <Container fluid className="page-content">
            <Card className="shadow-sm courses-banner-card ">
                <Card.Body>
                    <Row className="align-items-center">
                        <Col md={8} >
                            <h1 className="mb-1 text-center" style={{marginLeft: "10rem"}}>Courses</h1>
                        </Col>
                        <Col md={4} className="mt-3 mt-md-0">
                            <Card className="border-0 banner-info-card-courses">
                                <Card.Body>
                                    <p style={{color:"white"}}> 
                                        Below is a list of your courses. You can add new courses using the form, edit existing courses 
                                        by clicking the "Edit" button, or delete courses by clicking the "Delete" button.
                                    </p>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>

            {/* Course List Container */}
            <Card className="shadow-sm course-list-card mt-5 ">
                <Card.Body>
                    <div className="d-flex align-items-center justify-content-between mt-4">
                        <h3 className="mb-0 text-start">Your Courses</h3>

                        {/* Add Course Button */}
                        <div className="d-flex align-items-center gap-2">
                            <Button variant="success" className="primary-btn" onClick={() => setShowAddModal(true)}>
                                <i className="bi bi-plus-lg me-2"></i>
                                Add Course
                            </Button>
                        </div>
                    </div>

                    {/* Show error message */}
                    {pageError && <Alert variant="danger" className="mt-3">{pageError}</Alert>}

                    {loading ? (
                        <div className="mt-3">
                            <Spinner animation="border" size="sm" />
                            <span className="ms-2">Loading courses...</span>
                        </div>
                    ) : courses.length === 0 ? (
                        <p className="mb-0 text-center mt-3">No courses yet.</p>
                    ) : (
                        <div className="courses-grid mt-3">
                            {courses.map(function (course) {
                                return (
                                    <Card className="card-list-item shadow-sm" key={course._id}>
                                        <Card.Body>
                                            <div className="list-row">
                                                {/* Left side of course item card */}
                                                <div className="course-left">
                                                    <img src="/courses-book.png"alt="Course Book"className="course-image"/>

                                                    <div className="course-text">
                                                        <div className="course-info">
                                                            {course.courseCode} - {course.courseName}
                                                        </div>

                                                        <div className="list-item-label-value">
                                                            <span className="list-item-label">Semester</span>{" "}
                                                            {course.semester}
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Right side course item card */}
                                                <div className="task-actions-col">
                                                    <Button
                                                        size="sm"
                                                        className="task-btn edit-btn"
                                                        onClick={() => openEditModal(course)} // Open edit modal and pass the course data to populate the form inputs
                                                    >
                                                        <i className="bi bi-pencil me-2"></i>
                                                        Edit
                                                    </Button>

                                                    <Button
                                                        size="sm"
                                                        className="task-btn delete-btn"
                                                        onClick={() => deleteCourse(course._id)} // Call deleteCourse function and pass the course ID to delete the course 
                                                        >
                                                            <i className="bi bi-trash me-2"></i>
                                                            Delete
                                                    </Button>
                                                </div>
                                            </div>
                                        </Card.Body>
                                    </Card>
                                );
                            })}
                        </div>
                    )}
                </Card.Body>
            </Card>

            {/* Add Course Modal Component */}
            <AddCourseModal
                show={showAddModal} // Open modal
                onClose={() => setShowAddModal(false)} // Close modal when user cancels or clicks X
                onAddCourse={addCourse} // Pass addCourse function to handle adding a new course when the form in the modal is submitted
            />

            {/* Edit Course Modal Component */}
            <EditCourseModal
                show={showEditModal} // Controls if modal is visible
                onClose={closeEditModal} // Close modal when user cancels or clicks X
                course={selectedCourse} // Pass the selected course data to populate the form inputs in the edit modal
                onSave={updateCourse} // Save changes by calling updateCourse function
            />
        </Container>
    );
}