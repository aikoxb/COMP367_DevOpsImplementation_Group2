// server/app/controllers/courses.controller.js
// Handles Course CRUD logic and ensures courses belong to the authenticated user
// Receives data from routes, interacts with MongoDB models, and sends JSON responses back to React

import Course from '../models/course.model.js'; // Course model
import { errorResponse } from '../utils/error.js';  // Error response helper
import StudyTask from "../models/studyTask.model.js";

// Create a new course
export const createCourse = async (req, res) => {
    // Create a new course with ownership
    try {
        const course = await Course.create({
            courseCode: req.body.courseCode, // Save course code from the form
            courseName: req.body.courseName, // Save course name from the form
            semester: req.body.semester, // Save semester from the form
            user: req.userId, // Link course to the logged-in user
        });
        return res.status(201).json(course);
    } catch (err) {
        return errorResponse(res, 400, err.message); // Return validation error
    }
};

// List only the logged-in user's courses
export async function listCourses(req, res) {
    try {
        // Fetch all courses for the logged-in user
        const courses = await Course.find({ user: req.userId }) // Only return user’s courses
            .sort({ createdAt: -1 }) // Sort by creation date (newest first)

        // Return the list of courses
        return res.json(courses);   
    } catch (err) {
        return errorResponse(res, 500, err.message); // Return server error
    }
}

// Get one course by id (only if it belongs to the logged-in user)
export async function getCourseById(req, res) {
    try {
        const course = await Course.findById(req.params.id);

        // Check if course exists
        if (!course) {
            return errorResponse(res, 404, 'Course not found');
        }

        // Check if the authenticated user is the owner of the course        
        if (course.user.toString() !== req.userId) {
            return errorResponse(res, 403, 'Not authorized to view this course');
        }

        return res.json(course);  // Return the found course
    } catch (err) {
        return errorResponse(res, 400, err.message); // Return bad id error
    }
}

// Update a course (only if it belongs to the logged-in user)
export async function updateCourse(req, res) {
    try {
        // Find the course by ID
        const course = await Course.findById(req.params.id);

        // Check if course exists
        if (!course) {
            return errorResponse(res, 404, "Course not found");
        }

        // Check if the authenticated user is the owner of the course
        if (course.user.toString() !== req.userId) {
            return errorResponse(res, 403, 'Not authorized to edit this course');
        }

        // Update fields
        course.courseCode = req.body.courseCode; 
        course.courseName = req.body.courseName; 
        course.semester = req.body.semester; 

        await course.save(); // Save updated course
        return res.json(course);    // Return updated course
    } catch (err) {
        return errorResponse(res, 400, err.message);
    }
}

// Delete a course
export async function deleteCourse(req, res) {
    try {
        // Find the course by ID
        const course = await Course.findById(req.params.id);

        // Check if course exists
        if (!course) {
            return errorResponse(res, 404, 'Course not found');
        }

        // Check if the authenticated user is the owner of the course
        if (course.user.toString() !== req.userId) {
            return errorResponse(res, 403, 'Not authorized to delete this course');
        }

        // Delete tasks that are linked to this course ID
        await StudyTask.deleteMany({ course: course._id, user: req.userId });

        // Delete course
        await course.deleteOne();
        return res.json({ message: 'Course deleted successfully' });
    } catch (err) {
        return errorResponse(res, 400, err.message); // Return bad id error
    }
}

