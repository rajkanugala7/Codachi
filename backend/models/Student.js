const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Schema = mongoose.Schema;

const StudentSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    classroom: {
        type: Schema.Types.ObjectId,
        ref: 'Classroom',  // Reference to the Classroom the student belongs to
        required: true
    },
    completedExperiments: [{
        type: Schema.Types.ObjectId,
        ref: 'Experiment',  // List of completed experiments
        default: []
    }]
});

StudentSchema.pre('save', async function(next) {
    if (this.isModified('password') || this.isNew) {
        try {
            const salt = await bcrypt.genSalt(10);
            this.password = await bcrypt.hash(this.password, salt);
            next();
        } catch (err) {
            next(err);
        }
    } else {
        next();
    }
});

const Student = mongoose.model('Student', StudentSchema);

module.exports = Student;
