const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TestSchema = new Schema({
    testName: {
        type: String,
        required: true
    },
    activeStatus: {
        type: Boolean,
        default: true // By default, the test is active
    },
    sets: [{
        type: Schema.Types.ObjectId,
        ref: 'Set', // This will reference a Set model
        default: []
    }],
    testExpireTime: {
        type: Date,
        required: true
    },
    startTime: {
        type: Date,
        required: true
    },
    timeLimit: {
        type: Number, // Time limit in minutes for all sets in this test
        required: true
    },
    testSubmissions: [{
        studentId: {
            type: Schema.Types.ObjectId,
            ref: 'Student', // Reference to the student who submitted
            required: true
        },
        setId: {
            type: Schema.Types.ObjectId,
            ref: 'Set', // Reference to the set for which the submission was made
            required: true
        },
        codes: [{
            experimentId: {
                type: Schema.Types.ObjectId,
                ref: 'Experiment', // Reference to the Experiment model
                required: true
            },
            codeWritten: {
                type: String,
                required: true
            }
        }]
    }]
    
    
});

const Test = mongoose.model('Test', TestSchema);

module.exports = Test;
