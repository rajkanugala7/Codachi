const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Experiment schema
const ExperimentSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    problemStatement: {
        type: String,
    },
    testCases: [{
        type: Schema.Types.ObjectId,
        ref: 'TestCase', // Reference to the TestCase model
        default: [] // Default to an empty array
    }],
    classroomProgress: {
        type: Map, // Map for classroom-specific progress
        of: [{
            studentId: {
                type: Schema.Types.ObjectId,
                ref: 'Student', // Reference to the Student model
                required: true
            },
            completedAt: {
                type: Date,
                default: Date.now // Automatically store completion timestamp
            }
        }],
        default: {} // Initialize the map as an empty object
    }
});

// Model for Experiment
const Experiment = mongoose.model('Experiment', ExperimentSchema);

module.exports = Experiment;
