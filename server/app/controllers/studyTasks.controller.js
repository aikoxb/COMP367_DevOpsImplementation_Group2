// server/app/controllers/studyTasks.controller.js
// Handles StudyTask CRUD logic and ensures tasks belong to the authenticated user
// Receives data from routes, interacts with MongoDB models, and sends JSON responses back to React

import StudyTask from '../models/studyTask.model.js'; // StudyTask model
import Course from "../models/course.model.js"; // Course model (to verify ownership)
import { errorResponse } from '../utils/error.js';  // Error response helper

// Create a new study task
export const createStudyTask = async (req, res) => {
    
    try {
        // Make sure the course belongs to this user
        const course = await Course.findById(req.body.course); // Find the course by ID
        if (!course) { 
            return errorResponse(res, 404, "Course not found"); // If course doesn't exist, return 404 error
        }
        if (course.user.toString() !== req.userId) {
            return errorResponse(res, 403, "Not authorized to add tasks to this course"); // If course doesn't belong to user, return 403 error
        }

        // Create a new study task with ownership
        const studyTask = await StudyTask.create({
            title: req.body.title,
            description: req.body.description,
            priority: req.body.priority,
            dueDate: req.body.dueDate,
            completed: req.body.completed,
            course: req.body.course,
            user: req.userId    // Link study task to the logged-in user
        });
        return res.status(201).json(studyTask);
    } catch (err) {
        return errorResponse(res, 400, err.message);
    }
};

// List only the logged-in user's study tasks
export async function listStudyTasks(req, res) {
    try {
        // Fetch all study tasks for the logged-in user
        const studyTasks = await StudyTask.find({ user: req.userId }) // Only return user’s study tasks
            .sort({ createdAt: -1 }) // Sort by creation date (newest first)
            .populate("course", "courseCode courseName semester"); // Include course fields

        // Return the list of study tasks for the logged-in user
        return res.json(studyTasks);
    } catch (err) {
        return errorResponse(res, 500, err.message); // Return server error
    }
}

// Get one study task by id (only if it belongs to the logged-in user)
export async function getStudyTaskById(req, res) {
    try {
        // Find the study task by ID
        const studyTask = await StudyTask.findById(req.params.id)
            .populate("course", "courseCode courseName semester"); // Include course fields

        // Check if study task exists
        if (!studyTask) {
            return errorResponse(res, 404, 'Study Task not found');
        }

        // Check if the authenticated user is the owner of the study task        
        if (studyTask.user.toString() !== req.userId) {
            return errorResponse(res, 403, 'Not authorized to view this study task');
        }

        return res.json(studyTask);  // Return the found study task
    } catch (err) {
        return errorResponse(res, 400, err.message); // Return bad id error
    }
}

// Update a study task (only if it belongs to the logged-in user)
export async function updateStudyTask(req, res) {
  try {
        // Find the study task by ID
        const studyTask = await StudyTask.findById(req.params.id);

        // Check if study task exists
        if (!studyTask) {
            return errorResponse(res, 404, 'Study Task not found');
        }

        // Check if the authenticated user is the owner of the study task
        if (studyTask.user.toString() !== req.userId) {
            return errorResponse(res, 403, 'Not authorized to edit this study task');
        }

        // If course is being changed, verify it belongs to user
        if (req.body.course) {
            const course = await Course.findById(req.body.course);
            if (!course) {
                return errorResponse(res, 404, "Course not found");
            }
            if (course.user.toString() !== req.userId) {
                return errorResponse(res, 403, "Not authorized to move task to this course");
        }
            studyTask.course = req.body.course; // Update Course
        }

        // Update fields
        studyTask.title = req.body.title;
        studyTask.description = req.body.description;
        studyTask.priority = req.body.priority;
        studyTask.dueDate = req.body.dueDate;
        studyTask.completed = req.body.completed;

        await studyTask.save(); // Save updated study task
        return res.json(studyTask);    // Return updated study task
    } catch (err) {
        return errorResponse(res, 400, err.message);
    }
}

// Delete a study task
export async function deleteStudyTask(req, res) {
    try {
        // Find the study task by ID
        const studyTask = await StudyTask.findById(req.params.id);

        // Check if study task exists
        if (!studyTask) {
            return errorResponse(res, 404, 'Study Task not found');
        }

        // Check if the authenticated user is the owner of the study task
        if (studyTask.user.toString() !== req.userId) {
            return errorResponse(res, 403, 'Not authorized to delete this study task');
        }

        // Delete the study task
        await studyTask.deleteOne();
        return res.json({ message: 'Study Task deleted successfully' });
    } catch (err) {
            return errorResponse(res, 400, err.message);
    }
}

