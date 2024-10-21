const Classroom = require('../models/Classroom');

// Create Classroom
const createClassroom = async (req, res) => {
    const { className } = req.body;
    try {
        const newClassroom = new Classroom({ className });
        await newClassroom.save();
        res.send("Classroom created successfully");
    } catch (err) {
        res.status(400).send(err);
    }
};

// Update Classroom
const updateClassroom = async (req, res) => {
    const { id } = req.params;
    const { className } = req.body;
    try {
        const updatedClassroom = await Classroom.findByIdAndUpdate(id, { className }, { new: true });
        res.json(updatedClassroom);
    } catch (err) {
        res.status(400).send(err);
    }
};

// Delete Classroom
const deleteClassroom = async (req, res) => {
    const { id } = req.params;
    try {
        await Classroom.findByIdAndDelete(id);
        res.send("Classroom deleted successfully");
    } catch (err) {
        res.status(400).send(err);
    }
};

// Get all classrooms
const getAllClassrooms = async (req, res) => {
    const classrooms = await Classroom.find().populate('students');
    res.json(classrooms);
};

module.exports = {
    createClassroom,
    updateClassroom,
    deleteClassroom,
    getAllClassrooms
};
