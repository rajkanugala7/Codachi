const Classroom = require('../models/Classroom');

// Create Classroom
const createClassroom = async (req, res) => {
    const { className, teacherId } = req.body;

    if (!className || !teacherId) {
        return res.status(400).json({ message: "Class name and teacher ID are required." });
    }

    try {
        const newClassroom = new Classroom({ 
            className, 
            teachers: [teacherId] 
        });

        await newClassroom.save();
        res.status(201).json({ message: "Classroom created successfully", classroom: newClassroom });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to create classroom", error: err.message });
    }
};

// Update Classroom
const updateClassroom = async (req, res) => {
    const { id } = req.params;
    const { className } = req.body;

    if (!className) {
        return res.status(400).json({ message: "Class name is required." });
    }

    try {
        const updatedClassroom = await Classroom.findByIdAndUpdate(id, { className }, { new: true });

        if (!updatedClassroom) {
            return res.status(404).json({ message: "Classroom not found." });
        }

        res.status(200).json(updatedClassroom);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to update classroom", error: err.message });
    }
};

// Delete Classroom
const deleteClassroom = async (req, res) => {
    const { id } = req.params;

    try {
        const deletedClassroom = await Classroom.findByIdAndDelete(id);

        if (!deletedClassroom) {
            return res.status(404).json({ message: "Classroom not found." });
        }

        res.status(200).json({ message: "Classroom deleted successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to delete classroom", error: err.message });
    }
};

// Get all classrooms
const getAllClassrooms = async (req, res) => {
    try {
        const classrooms = await Classroom.find().populate('students');
        res.status(200).json(classrooms);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to fetch classrooms", error: err.message });
    }
};

// Get Classroom by ID
const getClassroomById = async (req, res) => {
    const { id } = req.params;

    try {
        const classroom = await Classroom.findById(id).populate('students');
        
        if (!classroom) {
            return res.status(404).json({ message: "Classroom not found." });
        }

        res.status(200).json(classroom);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to fetch classroom", error: err.message });
    }
};

module.exports = {
    createClassroom,
    updateClassroom,
    deleteClassroom,
    getAllClassrooms,
    getClassroomById
};
