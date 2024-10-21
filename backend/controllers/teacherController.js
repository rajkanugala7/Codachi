const Teacher = require('../models/Teacher');
const Classroom = require('../models/Classroom');

// Create Teacher
const createTeacher = async (req, res) => {
    const { name, email, password, classroomId } = req.body;
    try {
        const classroom = await Classroom.findById(classroomId);
        if (!classroom) {
            return res.status(404).json({ message: "Classroom not found" });
        }
        let existingTeacher = await Teacher.findOne({ email });
        if (existingTeacher) {
            const updatedClassroom = await Classroom.findByIdAndUpdate(classroomId, { $addToSet: { teachers: existingTeacher._id } }, { new: true });
            return res.json({ message: "Teacher already exists and added to classroom", updatedClassroom });
        }
        const newTeacher = new Teacher({ name, email, password });
        await newTeacher.save();
        const updatedClassroom = await Classroom.findByIdAndUpdate(classroomId, { $addToSet: { teachers: newTeacher._id } }, { new: true });
        res.json({ message: "New teacher created and added to classroom", newTeacher, updatedClassroom });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Update Teacher
const updateTeacher = async (req, res) => {
    const { id } = req.params;
    const { name, email, password } = req.body;
    try {
        const updatedTeacher = await Teacher.findByIdAndUpdate(id, { name, email, password }, { new: true });
        res.json(updatedTeacher);
    } catch (err) {
        res.status(400).send(err);
    }
};

// Delete Teacher
const deleteTeacher = async (req, res) => {
    const { id } = req.params;
    try {
        await Teacher.findByIdAndDelete(id);
        res.send("Teacher deleted successfully");
    } catch (err) {
        res.status(400).send(err);
    }
};

module.exports = {
    createTeacher,
    updateTeacher,
    deleteTeacher
};
