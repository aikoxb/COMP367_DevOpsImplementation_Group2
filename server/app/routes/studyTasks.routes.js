// server/app/routes/studyTasks.routes.js
// Defines protected API routes for StudyTask CRUD operations
// Receives requests from React and forwards them to studyTasks.controller.js after authentication

import express from 'express'; // to create a router

// Import controller functions for studyTasks operations
import {
    createStudyTask,
    listStudyTasks,
    getStudyTaskById,
    updateStudyTask,
    deleteStudyTask
} from '../controllers/studyTasks.controller.js';

// Import authentication middleware to protect routes
import { requireAuth} from '../middleware/auth.middleware.js';

// Create a router
const router = express.Router();

// Protected Routes for Read operations (only accessible to logged-in users)
router.get('/', requireAuth, listStudyTasks);
router.get('/:id', requireAuth, getStudyTaskById);

// Protected Routes for Create, Update, Delete operations (only accessible to logged-in users)
router.post('/', requireAuth, createStudyTask);
router.put('/:id', requireAuth, updateStudyTask);
router.delete('/:id', requireAuth, deleteStudyTask);

// Export the router
export default router;