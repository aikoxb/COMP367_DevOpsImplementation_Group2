// server/app/models/user.model.js
// Defines User schema and model for MongoDB, including password hashing logic
// Stores user profile data and verifies passwords for authentication

import mongoose from "mongoose"; // to define schema and model
import bcrypt from "bcrypt"; // to hash passwords before saving

/**
Create User schema for:
•	password (string, required)
•	firstName (string)
•	lastName (string)
•	program (string)
•	studyLevel (string: e.g., Diploma, Advanced Diploma)
•	preferredStudyTime (string – custom field)
•	createdAt (date)
**/

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    firstName: {
        type: String
    },
    lastName: {
        type: String
    },
    program: {   
        type: String
    },
    studyLevel: {
        type: String,
        enum: ['Diploma', 'Advanced Diploma', 'Bachelor', 'Master', 'PhD']
    },
    preferredStudyTime: {
        type: String
    }
}, { timestamps: true }); // Automatically adds createdAt (and updatedAt) fields

// Save password as hashed before saving user document
userSchema.pre('save', async function () {
    // Only hash the password if it was modified (or is new)
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 10);
    }
});

// Compare entered password with stored hashed password
userSchema.methods.verifyPassword = function (password) {
    return bcrypt.compare(password, this.password);
};

// Create and export User model
export default mongoose.model('User', userSchema);