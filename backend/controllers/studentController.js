const Student = require('../models/Student');
const Classroom = require('../models/Classroom');

// Create Student
const createStudent = async (req, res) => {
    const { name, email, password, classroomId } = req.body;
    const newStudent = new Student({ name, email, password, classroom: classroomId });
    try {
        await newStudent.save();
        await Classroom.findByIdAndUpdate(classroomId, { $push: { students: newStudent._id } });
        res.json(newStudent);
    } catch (err) {
        res.status(400).send(err);
    }
};

// Update Student
const updateStudent = async (req, res) => {
    const { id } = req.params;
    const { name, email, password, classroomId } = req.body;
    try {
        const updatedStudent = await Student.findByIdAndUpdate(id, { name, email, password, classroom: classroomId }, { new: true });
        res.json(updatedStudent);
    } catch (err) {
        res.status(400).send(err);
    }
};

// Delete Student
const deleteStudent = async (req, res) => {
    const { id } = req.params;
    try {
        await Student.findByIdAndDelete(id);
        res.send("Student deleted successfully");
    } catch (err) {
        res.status(400).send(err);
    }
};

// Get all students of a classroom
const getAllStudents = async (req, res) => {
    const { classroomId } = req.params;
    try {
        const classroom = await Classroom.findById(classroomId).populate('students');
        if (!classroom) {
            return res.status(404).send("Classroom not found");
        }
        res.json(classroom.students);
    } catch (err) {
        res.status(400).send("An error occurred while fetching students");
    }
};

module.exports = {
    createStudent,
    updateStudent,
    deleteStudent,
    getAllStudents
};
