// study-planner-client/src/components/TaskFilterControl.jsx
// Component for the filter control panel to filter tasks in the StudyTasks component (StudyTasks.jsx)

import { useState } from "react"; // React hooks for managing component state and side effects

// For styling
import { Dropdown, Form, Button } from "react-bootstrap";
import "./TaskFilterControl.css"; 
import Select from "react-select";

// Component for the filter control dropdown in the StudyTasks component
export default function TaskFilterControl(props) {

    // Read courses list passed down from parent component (StudyTasks.jsx)
    const courses = props.courses;

    // Read properties for enabled checkboxes from parent component (StudyTasks.jsx)
    const useCourseFilter = props.useCourseFilter;
    const usePriorityFilter = props.usePriorityFilter;
    const useCompletionFilter = props.useCompletionFilter;

    // Read properties for applied filter values from parent component (StudyTasks.jsx)
    const filterCourseId = props.filterCourseId;
    const filterPriority = props.filterPriority;
    const filterCompletion = props.filterCompletion;

    // Trigger from parent component (StudyTasks.jsx) to apply filters
    const onApplyFilters = props.onApplyFilters;

    // States - Unconfirmed filters and Filter Values
    const [pendingUseCourseFilter, setPendingUseCourseFilter] = useState(false);
    const [pendingUsePriorityFilter, setPendingUsePriorityFilter] = useState(false);
    const [pendingUseCompletionFilter, setPendingUseCompletionFilter] = useState(false);
    const [pendingCourseId, setPendingCourseId] = useState("All"); 
    const [pendingPriority, setPendingPriority] = useState("All"); 
    const [pendingCompletion, setPendingCompletion] = useState("All");


    // ============================
    // FILTER CONTROL HELPERS
    // ============================

    // When opening the filter panel, copy the applied filter values into the pending UI state 
    // so that the dropdowns show the current filters as selected
    function openFilterPanel() {
        setPendingUseCourseFilter(useCourseFilter);
        setPendingUsePriorityFilter(usePriorityFilter);
        setPendingUseCompletionFilter(useCompletionFilter);

        setPendingCourseId(filterCourseId);
        setPendingPriority(filterPriority);
        setPendingCompletion(filterCompletion);
    }

    // Select All checkbox helper (based on pending checkboxes)
    function allSelected() {
        return pendingUseCourseFilter && pendingUsePriorityFilter && pendingUseCompletionFilter;
    }

    // Enable all 3 pending checkboxes
    function toggleSelectAll(checked) {
        setPendingUseCourseFilter(checked);
        setPendingUsePriorityFilter(checked);
        setPendingUseCompletionFilter(checked);
    }

    // For the apply button - send pending filter values to parent component (StudyTasks.jsx) to apply filters
    function applyAllFilters() {
        onApplyFilters({
            useCourseFilter: pendingUseCourseFilter,
            usePriorityFilter: pendingUsePriorityFilter,
            useCompletionFilter: pendingUseCompletionFilter,
            courseId: pendingCourseId,
            priority: pendingPriority,
            completion: pendingCompletion,
        });
    }

    // ==============================
    // Helpers - React-select options
    // ==============================

    // Helper - Options for course dropdown based on courses list from parent component (StudyTasks.jsx)
    const courseOptions = [{ value: "All", label: "All" }].concat(
        courses.map(function (course) {
            return { value: course._id, label: course.courseCode + " - " + course.courseName };
        })
    );

    // Helper - Options for priority dropdown
    const priorityOptions = [
        { value: "All", label: "All" },
        { value: "Low", label: "Low" },
        { value: "Medium", label: "Medium" },
        { value: "High", label: "High" },
    ];

    // Helper - Options for completion dropdown
    const completionOptions = [
        { value: "All", label: "All" },
        { value: "Completed", label: "Completed" },
        { value: "Not Completed", label: "Not Completed" },
    ];

    // Helper function - find the option object based on value, to set the value of react-select dropdowns
    function findOption(options, value) {
        const match = options.find(function (option) {
            return option.value === value;
        });

        return match || null;
    }

    // Render filter control panel
    return (
        <Dropdown
        align="end"
        onToggle={(isOpen) => {
            if (isOpen) {
                openFilterPanel();
            }
        }}
        >
            {/* Filter button */}
            <Dropdown.Toggle variant="light" className="filter-btn" aria-label="Open filters">
                <i className="bi bi-funnel-fill" aria-hidden="true"></i>
            </Dropdown.Toggle>

            {/* Filter Panel */}
            <Dropdown.Menu className="filter-menu sp-panel">
                <div className="fw-semibold mb-2">Filters</div>

                {/* Select All */}
                <div className="mb-4">
                    <Form.Check
                        type="checkbox"
                        label="Select All"
                        checked={allSelected()}
                        onChange={(e) => toggleSelectAll(e.target.checked)} // Toggle all checkboxes when Select All is clicked
                        onClick={(e) => e.stopPropagation()} // Prevent dropdown from closing when clicking on the checkbox
                    />
                </div>

                <hr className="my-3" />

                {/* Course */}
                <div className="mb-4">
                    <Form.Check
                        type="checkbox"
                        label="Course"
                        checked={pendingUseCourseFilter}
                        onChange={(e) => setPendingUseCourseFilter(e.target.checked)} // Call setPendingUseCourseFilter to update pendingUseCourseFilter state when checkbox clicked
                        onClick={(e) => e.stopPropagation()} // Prevent dropdown from closing when clicking on the checkbox
                    />

                    <Select
                        className="mt-3"
                        classNamePrefix="sp-select"
                        options={courseOptions}
                        value={findOption(courseOptions, pendingCourseId)}
                        onChange={function (option) {
                            if (option) {
                                setPendingCourseId(option.value); // Call setPendingCourseId to update pendingCourseId state when user selects option
                            }
                        }}
                        isDisabled={!pendingUseCourseFilter}
                        placeholder="All" 
                        menuPlacement="auto" // Open direction of dropdown based on available space
                        
                    />
                </div>

                {/* Priority */}
                <div className="mb-4">
                    <Form.Check
                        type="checkbox"
                        label="Priority"
                        checked={pendingUsePriorityFilter}
                        onChange={(e) => setPendingUsePriorityFilter(e.target.checked)} // Call setPendingUsePriorityFilter to update pendingUsePriorityFilter state when checkbox is clicked
                        onClick={(e) => e.stopPropagation()} // Prevent dropdown from closing when clicking on the checkbox
                    />

                    <Select
                        className="mt-3"
                        classNamePrefix="sp-select"
                        options={priorityOptions}
                        value={findOption(priorityOptions, pendingPriority)}
                        onChange={function (option) {
                            if (option) {
                                setPendingPriority(option.value); // Call setPendingPriority to update pendingPriority state when user selects option
                            }
                        }}
                        isDisabled={!pendingUsePriorityFilter}
                        placeholder="All"
                        menuPlacement="auto" // Open direction of dropdown based on available space
                    />
                </div>

                {/* Completion */}
                <div className="mb-3">
                    <Form.Check
                        className="mt-3"
                        type="checkbox"
                        label="Completion"
                        checked={pendingUseCompletionFilter}
                        onChange={(e) => setPendingUseCompletionFilter(e.target.checked)} // Call setPendingUseCompletionFilter to update pendingUseCompletionFilter state when checkbox is clicked
                        onClick={(e) => e.stopPropagation()} // Prevent dropdown from closing when clicking on the checkbox
                    />

                    <div className="mt-3 mb-4">
                        <Select
                            classNamePrefix="sp-select"
                            options={completionOptions}
                            value={findOption(completionOptions, pendingCompletion)}
                            onChange={function (option) {
                                if (option) {
                                    setPendingCompletion(option.value); // Call setPendingCompletion to update pendingCompletion state when user selects option
                                }
                            }}
                            isDisabled={!pendingUseCompletionFilter}
                            placeholder="All"
                            menuPlacement="auto" // Open direction of dropdown based on available space
                        />
                    </div>
                </div>

                {/* Apply button*/}
                <div className="d-flex justify-content-end">
                    <Button
                        className="apply-btn mt-3"
                        onClick={(e) => applyAllFilters() }// Apply filters when button is clicked
                    >
                        Apply
                    </Button>
                </div>
            </Dropdown.Menu>
        </Dropdown>
    );
}