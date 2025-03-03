const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Schema = mongoose.Schema;

const TeacherSchema = new Schema({
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
    classrooms: [{
        type: Schema.Types.ObjectId,
        ref: 'Classroom',  // Reference to the Classroom model
        default: []        // Start with an empty array
    }]
});

TeacherSchema.pre('save', async function(next) {
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

const Teacher = mongoose.model('Teacher', TeacherSchema);

module.exports = Teacher;
