// server/app/models/studyTask.model.js
// Defines StudyTask schema linking tasks to a Course and User
// Stores task data in MongoDB and supports relationships using ObjectId references

import mongoose from 'mongoose'; // to define schema and model

const { Schema } = mongoose;

/**
Create StudyTask schema for:
•	title (string)
•	description (string)
•	priority (Low | Medium | High)
•	dueDate (date)
•	completed (boolean)
•	course (ObjectId → Course)
•	user (ObjectId → User)

**/

const StudyTaskSchema = new Schema(
    {
        title: {
            type: String,
            required: true
        },
        description: {
            type: String,
            default: ""
        },
        priority: {
            type: String,
            enum: ['Low', 'Medium', 'High'],
            default: 'Medium'
        },
        dueDate: {
            type: Date,
            required: true
        },
        completed: {
            type: Boolean,
            default: false
        },
        // Each study task belongs to one course
        course: {
            type: Schema.Types.ObjectId,    // Course link is an ObjectId
            ref: 'Course',      // It references the Course model
            required: true      // Every task must belong to a course
        },
        // Each study task belongs to one user
        user: {
            type: Schema.Types.ObjectId,    // User link is an ObjectId
            ref: 'User',    // It references the User model
            required: true  // Every task must belong to a user
        }
    },
    {
        timestamps: true
    }
);

// Create and export StudyTask model
export default mongoose.model('StudyTask', StudyTaskSchema);
