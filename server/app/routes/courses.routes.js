// server/app/routes/courses.routes.js
// Defines protected API routes for Course CRUD operations
// Receives requests from React and forwards them to courses.controller.js after authentication

import express from 'express';  // to create a router

// Import controller functions for courses operations
import {
    createCourse,
    listCourses,
    getCourseById,
    updateCourse,
    deleteCourse
} from '../controllers/courses.controller.js';

// Import authentication middleware to protect routes
import { requireAuth } from '../middleware/auth.middleware.js';

// Create a router
const router = express.Router();

// Protected Routes for Read operations (only accessible to logged-in users)
router.get('/', requireAuth, listCourses);
router.get('/:id', requireAuth, getCourseById);

// Protected Routes for Create, Update, Delete operations (only accessible to logged-in users)
router.post('/', requireAuth, createCourse);
router.put('/:id', requireAuth, updateCourse);
router.delete('/:id', requireAuth, deleteCourse);

// Export the router
export default router;