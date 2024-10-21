const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Import the TestCase model
const TestCase = require('./TestCase'); // Adjust the path if needed

// Experiment schema
const ExperimentSchema = new Schema({
    name: { type: String, required: true },
    problemStatement: { type: String, required: true },
    testCases: [{ 
        type: Schema.Types.ObjectId, 
        ref: 'TestCase',
        default: [] // Default to an empty array
    }], 
    completedBy: [{
        student: { type: Schema.Types.ObjectId, ref: 'Student' },
        completedAt: { type: Date, default: Date.now }
    }],
    default: [] // Default to an empty array for completedBy
});

// Model for Experiment
const Experiment = mongoose.model('Experiment', ExperimentSchema);
module.exports = Experiment;
