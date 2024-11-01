const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const LabSchema = new Schema({
    labName: {
        type: String,
        required: true
    },
    experiments: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Experiment' // Array of experiment references
        }
    ],
    teacher: {
        type: Schema.Types.ObjectId,
        ref: 'Teacher', // Reference to a single teacher
        required: true
    }
});

const Lab = mongoose.model('Lab', LabSchema);

module.exports = Lab;
