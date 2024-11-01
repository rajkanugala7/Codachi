const Teacher = require('../models/Teacher');
const Classroom = require('../models/Classroom');
const Lab = require('../models/Lab');

// Create Teacher
const createTeacher = async (req, res) => {
    const { name, email, password, classroomId, labId } = req.body;

    try {
        const classroom = await Classroom.findById(classroomId);
        if (!classroom) {
            return res.status(404).json({ message: "Classroom not found" });
        }

        let existingTeacher = await Teacher.findOne({ email });
        if (existingTeacher) {
            const updatedClassroom = await Classroom.findByIdAndUpdate(
                classroomId,
                { $addToSet: { teachers: existingTeacher._id } },
                { new: true }
            );

            if (labId) {
                const updatedLab = await Lab.findByIdAndUpdate(
                    labId,
                    { teacher: existingTeacher._id },
                    { new: true }
                );
                return res.json({ message: "Teacher already exists and added to classroom and lab", updatedClassroom, updatedLab });
            }

            return res.json({ message: "Teacher already exists and added to classroom", updatedClassroom });
        }

        const newTeacher = new Teacher({ name, email, password });
        await newTeacher.save();

        const updatedClassroom = await Classroom.findByIdAndUpdate(
            classroomId,
            { $addToSet: { teachers: newTeacher._id } },
            { new: true }
        );

        let updatedLab;
        if (labId) {
            updatedLab = await Lab.findByIdAndUpdate(
                labId,
                { teacher: newTeacher._id },
                { new: true }
            );
        }

        res.json({ message: "New teacher created and added to classroom and lab", newTeacher, updatedClassroom, updatedLab });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Add Teacher to Lab
const addTeacherToLab = async (req, res) => {
    const { teacherId, labId } = req.body;

    try {
        const teacher = await Teacher.findById(teacherId);
        if (!teacher) {
            return res.status(404).json({ message: "Teacher not found" });
        }

        const updatedLab = await Lab.findByIdAndUpdate(
            labId,
            { teacher: teacherId },
            { new: true }
        );

        if (!updatedLab) {
            return res.status(404).json({ message: "Lab not found" });
        }

        res.json({ message: "Teacher added to lab successfully", updatedLab });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Update Teacher and Reflect Changes in Labs
const updateTeacher = async (req, res) => {
    const { id } = req.params;
    const { name, email, password } = req.body;

    try {
        const updatedTeacher = await Teacher.findByIdAndUpdate(
            id,
            { name, email, password },
            { new: true }
        );

        if (!updatedTeacher) {
            return res.status(404).json({ message: "Teacher not found" });
        }

        // Update teacher details in associated labs
        await Lab.updateMany(
            { teacher: id },
            { $set: { "teacherName": name, "teacherEmail": email } } // Adjust fields if needed
        );

        res.json({ message: "Teacher updated successfully", updatedTeacher });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Delete Teacher and Reflect Changes in Labs
const deleteTeacher = async (req, res) => {
    const { id } = req.params;

    try {
        const teacher = await Teacher.findById(id);
        if (!teacher) {
            return res.status(404).json({ message: "Teacher not found" });
        }

        await Classroom.updateMany({ teachers: id }, { $pull: { teachers: id } });
        
        // Remove teacher from labs where referenced
        await Lab.updateMany({ teacher: id }, { $unset: { teacher: "" } });

        await teacher.remove();

        res.json({ message: "Teacher deleted successfully" });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Get Classrooms for a specific Teacher
const getTeacherClassrooms = async (req, res) => {
    const { id } = req.params;

    try {
        const classrooms = await Classroom.find({ teachers: id });

        if (!classrooms.length) {
            return res.status(404).json({ message: "No classrooms found for this teacher" });
        }

        res.json({ message: "Classrooms retrieved successfully", classrooms });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

module.exports = {
    createTeacher,
    updateTeacher,
    deleteTeacher,
    getTeacherClassrooms,
    addTeacherToLab
};
