// study-planner-client/src/components/StudyTasks.jsx
// Component to view/add/edit/delete study tasks, with filtering options
// Gets courses and tasks from backend (GET /courses, GET /tasks) and sends changes to backend (POST /tasks, PUT /tasks/:id, DELETE /tasks/:id)

import { useEffect, useState } from "react"; // React hooks for managing component state and side effects
import api from "../api/client"; // API client to make requests to the server
import TaskFilterControl from "./TaskFilterControl"; // Filter panel component
import AddTaskModal from "./AddTaskModal"; // Modal component for adding a new task
import EditTaskModal from "./EditTaskModal"; // Modal component for editing a task

// For styling
import { Container, Card, Form, Button, Spinner, Badge, Alert } from "react-bootstrap";
import "./StudyTasks.css";


// Component for managing study tasks
export default function StudyTasks() {

    // States - for courses and tasks
    const [courses, setCourses] = useState([]); 
    const [tasks, setTasks] = useState([]); 

    // States - for loading and error handling
    const [loading, setLoading] = useState(true);
    const [pageError, setPageError] = useState(""); 

    // States - Modal visibility
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);

    // State - Which task is currently being edited
    const [selectedTask, setSelectedTask] = useState(null);

    // States - Applied filters
    const [filterCourseId, setFilterCourseId] = useState("All"); 
    const [filterPriority, setFilterPriority] = useState("All"); 
    const [filterCompletion, setFilterCompletion] = useState("All");

    // States - Filter checkboxes
    const [useCourseFilter, setUseCourseFilter] = useState(false); 
    const [usePriorityFilter, setUsePriorityFilter] = useState(false); 
    const [useCompletionFilter, setUseCompletionFilter] = useState(false);

    // ==============================
    // LOAD COURSES & TASKS
    // ==============================
    // Load courses and tasks when component mounts
    useEffect(() => {
            loadCoursesAndTasks();
    }, []);

    // Loads courses and tasks from the server
    async function loadCoursesAndTasks() {
        try {
            setLoading(true); 
            setPageError("");

            // Send GET requests to fetch courses and tasks
            const coursesResponse = await api.get("/courses");
            const tasksResponse = await api.get("/tasks");

            // Update courses and tasks states with response data
            setCourses(coursesResponse.data);
            setTasks(tasksResponse.data);

        } catch (error) {
            console.error(error);
            setPageError("Failed to load courses or tasks.");
        } finally {
            setLoading(false);
        }
    }

    // =====================================
    // CREATE TASK (called by AddTaskModal)
    // ======================================

    // Adds a new task by sending a POST request to the server
    async function addTask(body) {

        try {
            // Send POST request to server to create a new task
            const response = await api.post("/tasks", body);

            // Add new task to the top of the list
            setTasks(function (prevTasks) {
                return [response.data, ...prevTasks];
            });

            return true; // Pass true to modal so it closes
        } catch (error) {
            console.error(error);
            return false; // Pass false to modal so it stays open & shows modal error message
        }
    }

    // ======================================
    // UPDATE TASK (called by EditTaskModal)
    // ======================================

    // Updates an existing task by sending a PUT request to the server
    async function updateTask(taskId, body) {
        try {
            // Send PUT request to server to update the task with the edited values from EditTaskModal
            const response = await api.put("/tasks/" + taskId, body);

            // Update the task in the tasks list with the updated task returned from the server
            const updatedList = tasks.map(function (originalTask) {
                if (originalTask._id === taskId) {
                    return response.data; // Replace the old task with the updated task
                }
                return originalTask; // Keep task unchanged
            });

            setTasks(updatedList); // Update tasks state with the updated task list
            return true; // Pass true to modal so it closes
        } catch (error) {
            console.error(error);
            return false; // Pass false to modal so it stays open & shows modal error message
        }
    }

    // ============================
    // DELETE TASK
    // ============================

    async function deleteTask(taskId) {
        setPageError("");
        const confirmDelete = window.confirm("Delete this study task?");

        // If user cancels, exit function
        if (!confirmDelete) {
            return;
        }

        try {
            // Send DELETE request to server to delete the task with given id
            await api.delete("/tasks/" + taskId);

            // Remove the deleted task from the UI list by filtering it out based on its id
            const updatedList = tasks.filter(function (t) {
                return t._id !== taskId;
            });

            // Update the tasks state with the updated tasks list
            setTasks(updatedList);
        } catch (error) {
            console.error(error);
            setPageError("Failed to delete task.");
        }
    }

    // ============================
    // TOGGLE COMPLETE
    // ============================

    async function toggleComplete(task) {
        setPageError("");

        try {
            let taskCourseId = "";

            // Check if task.course is populated as an object or just an id
            // To make sure only course id is sent in request body
            if (task.course && task.course._id) {
                taskCourseId = task.course._id;
            } else {
                taskCourseId = task.course;
            }

            // Build request body
            const body = {
                title: task.title,
                description: task.description,
                priority: task.priority,
                dueDate: task.dueDate,
                completed: !task.completed,
                course: taskCourseId // only course id to refer to course
            };

            // Send PUT request to server to update the task's completion status
            const response = await api.put("/tasks/" + task._id, body);

            // Update task in the tasks list with the updated task returned from the server
            const updatedList = tasks.map(function (t) {
                if (t._id === task._id) {
                    return response.data;
                }
                return t;
            });

            // Update tasks state to update completion status
            setTasks(updatedList); 
        } catch (error) {
            console.error(error);
            setPageError("Failed to update completion status.");        
        }
    }

    // ============================
    // DISPLAY HELPERS
    // ============================

    // Get Course label for a task
    function getCourseLabel(task) {
        // If task.course has course details, return the course code and name for the label
        if (task.course && task.course.courseCode) {
            return task.course.courseCode + " - " + task.course.courseName;
        }

        // If task.course is doesn't have detail (has only id)
        // find the course based on course id & return the course code and name for the label
        const match = courses.find(function (c) {
            return c._id === task.course;
        });

        // If a matching course is found, return the course code and name for the label
        if (match) {
            return match.courseCode + " - " + match.courseName;
        }

        return "Unknown Course"; // If course details is not found for the task
    }

    // Get priority badge for a task based on its priority value
    function getPriorityBadge(priorityValue) {
        if (priorityValue === "High") {
            return <Badge className="high-priority">Urgent</Badge>;
        }

        if (priorityValue === "Medium") {
            return <Badge className="med-priority">Medium Importance</Badge>;
        }

        return <Badge className="low-priority">Optional</Badge>;
    }

    // ===========================================
    // APPLY FILTERS (called by TaskFilterControl)
    // ===========================================
    function onApplyFilters(filterState) {
        // Update applied checkbox states
        setUseCourseFilter(filterState.useCourseFilter);
        setUsePriorityFilter(filterState.usePriorityFilter);
        setUseCompletionFilter(filterState.useCompletionFilter);

        // Update applied filter values
        setFilterCourseId(filterState.courseId);
        setFilterPriority(filterState.priority);
        setFilterCompletion(filterState.completion);
    }

    // =========================================
    // FILTER TASKS (according to checkboxes)
    // =========================================

    function passesCourseFilter(task) {
        // If course filter not on at all or if "All" is selected
        if (!useCourseFilter || filterCourseId === "All") {
            return true; // Include task in list
        }

        // If task.course is an object with details
        if (task.course && task.course._id) {
            return task.course._id === filterCourseId; // If task has matching course id, include task in list
        }

        // Occurs if task.course has no details & is just an id
        // Match task course id with filter course id
        return task.course === filterCourseId; // If course match is true, include task in list
    }

    function passesPriorityFilter(task) {
        // If priority filter is not on at all or if "All" is selected
        if (!usePriorityFilter || filterPriority === "All") {
            return true; // Include task in list
        }

        // Otherwise, match task priority with filter priority
        return task.priority === filterPriority; // If priority match is true, include task in list
    }

    function passesCompletionFilter(task) {
        // If completion filter is not on at all or if "All" is selected
        if (!useCompletionFilter || filterCompletion === "All") {
            return true; // Include task in list
        }

        // If "Completed" is selected
        if (filterCompletion === "Completed") {
            return task.completed === true; // Check if task is completed, if true include task in list
        }

        // If "Not Completed" is selected
        if (filterCompletion === "Not Completed") {
            return task.completed === false; // Check if task is not completed, if true include task in list
        }

        return true; // Default to true if none of the above conditions match
    }

    // Stores filtered list of tasks
    const filteredTasks = tasks.filter(function (task) {
        // If task doesn't pass the course filter, exclude it
        if (!passesCourseFilter(task)) {
            return false; 
        }

        // If task doesn't pass the priority filter, exclude it
        if (!passesPriorityFilter(task)) {
            return false;
        }

        // If task doesn't pass the completion filter, exclude it
        if (!passesCompletionFilter(task)) {
            return false;
        }

        return true; // If the task passes all active filters, include it in the filtered list
    });
    
    // Render Study Task Component
    return (
        <Container fluid className="py-4 task-list">
            <Card className="shadow-sm task-list-card">
                <Card.Body>
                    <div className="d-flex align-items-center justify-content-between mt-4">
                        <h3 className="mb-0 text-start">Your Study Tasks</h3>
                        
                        <div className="d-flex align-items-center gap-2">
                            {/* Add Task Button */}
                            <Button
                                variant="success"
                                className="primary-btn"
                                onClick={() => {setShowAddModal(true);}} // Open Add Task modal
                            >
                                <i className="bi bi-plus-lg me-2"></i>
                                Add Task
                            </Button>

                            {/* Filter Control */}
                            <TaskFilterControl
                                courses={courses} // Pass courses list to panel

                                // Pass states and values to panel
                                filterCourseId={filterCourseId}
                                filterPriority={filterPriority}
                                filterCompletion={filterCompletion}
                                useCourseFilter={useCourseFilter}
                                usePriorityFilter={usePriorityFilter}
                                useCompletionFilter={useCompletionFilter}

                                // Pass function to apply filters when user clicks "Apply" in the panel
                                onApplyFilters={onApplyFilters}
                            />
                        </div>
                    </div>

                    {/* Study Task Instruction Card */}
                    <Card className="border-0 task-instruction">
                        <Card.Body className="task-instruction-body">
                            <img src="/task-instruction.png" alt="Cartoon checklist character" className="task-image"/>

                            <p className="task-instruction-text">
                            Below is a list of your study tasks. You can add new tasks using the form, edit
                            existing tasks by clicking the "Edit" button, or delete tasks by clicking
                            the "Delete" button.
                            </p>
                        </Card.Body>
                    </Card>

                    {/* Show error message */}
                    {pageError && <Alert variant="danger" className="mt-3">{pageError}</Alert>}

                    {/* Study Task List */}
                    {loading ? (
                        <div>
                            <Spinner animation="border" size="sm" />
                            <span className="ms-2">Loading tasks...</span>
                        </div>
                    ) : filteredTasks.length === 0 ? (
                        <p className="mb-0 text-center">No tasks available. Try adjusting your filters.</p>
                    ) : (
                        <div className="task-list mt-3">
                            {filteredTasks.map(function (task) {
                                return (
                                    <Card className="card-list-item shadow-sm" key={task._id}>
                                        <Card.Body>
                                            <div className="list-row">

                                                {/* Left side of task card*/}
                                                <div className="list-item-maininfo-col">
                                                    <div className="task-top">

                                                        {/* Checkbox circle*/}
                                                        <div className="task-check">
                                                            <Form.Check
                                                                type="checkbox"
                                                                className="circle-checkbox"
                                                                checked={task.completed === true}
                                                                onChange={() => { toggleComplete(task); }} // Update completion status when checkbox is clicked
                                                                aria-label={task.completed ? "Mark as not completed" : "Mark as completed"}
                                                            />
                                                        </div>

                                                        {/* Title, Description, Badge */}
                                                        <div className="task-text">
                                                            <div className="task-title-row">
                                                                <span className={task.completed ? "task-title task-done" : "task-title"}>
                                                                    {task.title}
                                                                </span>

                                                                <span className="task-priority">
                                                                    {getPriorityBadge(task.priority)}
                                                                </span>
                                                            </div>

                                                            
                                                            {task.description ? (
                                                                <div className={task.completed ? "task-desc task-done" : "task-desc"}>
                                                                    {task.description}
                                                                </div>
                                                            ) : null}
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Right side of task card*/}
                                                <div className="task-right-col">

                                                    {/* Course & Due Date*/}
                                                    <div className="task-meta-col">
                                                        <div className="course-info">{getCourseLabel(task)}</div>

                                                        <div className="list-item-label-value">
                                                            {/* Show due date  formatted as "Weekday, Month Day, Year" */}
                                                            <span className="list-item-label">Due</span>{" "}
                                                            {task.dueDate
                                                                ? new Date(task.dueDate).toLocaleDateString("en-US", {
                                                                    weekday: "long",
                                                                    year: "numeric",
                                                                    month: "long",
                                                                    day: "numeric",
                                                                })
                                                                : ""}
                                                        </div>
                                                    </div>

                                                    {/* Edit & Delete buttons*/}
                                                    <div className="task-actions-col">
                                                        <Button
                                                            size="sm"
                                                            variant="primary"
                                                            className="task-btn edit-btn"
                                                            onClick={() => { setSelectedTask(task); setShowEditModal(true); }} // Open edit modal and set the selected task to be edited 
                                                        >
                                                            <i className="bi bi-pencil me-2"></i>
                                                            Edit
                                                        </Button>

                                                        <Button
                                                            size="sm"
                                                            className="task-btn delete-btn"
                                                            onClick={() => { deleteTask(task._id); }} // Call deleteTask function with the task id to delete the task
                                                        >
                                                            <i className="bi bi-trash me-2"></i>
                                                            Delete
                                                        </Button>
                                                    </div>
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

            {/* Add Task Modal Component */}
            <AddTaskModal
                show={showAddModal}
                onClose={() => {setShowAddModal(false);}}
                courses={courses} // Pass courses list for dropdown
                onAddTask={addTask} // Pass addTask function
            />

            {/* Edit Task Modal Component*/}
            <EditTaskModal
                show={showEditModal}
                onClose={() => {setShowEditModal(false); setSelectedTask(null);}}
                courses={courses} // Pass courses list for dropdown
                task={selectedTask}
                onSave={updateTask} // Pass updateTask function
            />

        </Container>
    );
}