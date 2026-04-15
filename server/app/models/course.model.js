// server/app/models/course.model.js
// Defines Course schema linking each course to a User
// Stores course data in MongoDB and supports ownership-based access control

import mongoose from 'mongoose'; // to define schema and model

const { Schema } = mongoose;

/**
Create Course schema for:
•	courseCode (string)
•	courseName (string)
•	semester (string)
•	user (ObjectId → User)
**/

const CourseSchema = new Schema(
    {
        courseCode: {
            type: String,
            required: true
        },
        courseName: {
            type: String,
            required: true
        },
        semester: {
            type: String,
            required: true
        },
        // Each course belongs to one user
        user: {
            type: Schema.Types.ObjectId, // User link is an ObjectId
            ref: 'User',    // It references the User model
            required: true  // Every course must belong to a user
        }
    },
    {
        timestamps: true
    }
);

// Create and export Course model
export default mongoose.model('Course', CourseSchema);
