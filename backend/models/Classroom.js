const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ClassroomSchema = new Schema({
    className: {
        type: String,
        required: true,
        unique: true
    },
    students: [{
        type: Schema.Types.ObjectId,
        ref: 'Student',
        default: []  // Start with an empty array for students
    }],
    teachers: [{
        type: Schema.Types.ObjectId,
        ref: 'Teacher',
        default: []  // List of Teachers associated with the classroom
    }],
    labs: [{
        type: Schema.Types.ObjectId,
        ref: 'Lab',
        default: []  // Start with an empty array for labs
    }]
});

const Classroom = mongoose.model('Classroom', ClassroomSchema);

module.exports = Classroom;
