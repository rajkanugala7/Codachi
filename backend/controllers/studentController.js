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
    const { name, email, completedTestIds } = req.body; // Include completedTestIds in request body
    console.log("Came here")
    try {
        // Validate request body
        if (!name && !email && !completedTestIds) {
            return res.status(400).json({ error: "At least one of name, email, or completedTestIds must be provided." });
        }

        // Build update object dynamically
        const updateFields = {
            ...(name && { name }),
            ...(email && { email }),
            ...(completedTestIds && { completedTestIds }),
        };

        // Find and update the student by ID
        const student = await Student.findByIdAndUpdate(
            id,
            { $set: updateFields }, // Dynamically update provided fields
            { new: true, runValidators: true } // Return updated doc, apply schema validations
        );



       
        if (!student) {
            return res.status(404).json({ error: "Student not found." });
        }

        res.status(200).json({
            message: "Student updated successfully.",
            student,
        });
    } catch (err) {
        console.error("Error updating student:", err.message);
        res.status(500).json({ error: "An error occurred while updating the student." });
    }
};

// Delete Student
const deleteStudent = async (req, res) => {
    const { id } = req.params; // Student ID from the request parameters

    try {
        // Find the student to get the classroom ID
        const student = await Student.findById(id);
        if (!student) {
            return res.status(404).send("Student not found");
        }

        // Remove the student from the classroom's students array
        await Classroom.findByIdAndUpdate(student.classroomId, {
            $pull: { students: id } // Remove student ID from the classroom's students array
        });

        // Delete the student
        await Student.findByIdAndDelete(id);
        res.send("Student deleted successfully");
    } catch (err) {
        res.status(400).send(err.message || "Error deleting student");
    }
};
const getStudent = async (req, res) => {
    const { id } = req.params; // Extract student ID from request parameters
    try {
        const student = await Student.findById(id); // Find student by ID
        if (!student) {
            return res.status(404).send("Student not found"); // Handle case where student is not found
        }
        res.status(200).json(student); // Send the student data as a JSON response
    } catch (err) {
        res.status(400).send(err.message); // Handle any errors during the operation
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
const bulkCreateStudents = async (req, res) => {
    try {
        const { classroomId, students } = req.body;
        console.log(classroomId);
        // Find existing students by email
        const existingStudents = await Student.find({ email: { $in: students.map(s => s.email) } });

        // Prepare to return duplicate emails
        const existingEmails = existingStudents.map(student => student.email);

        // Filter out existing students
        const filteredStudents = students.filter(student => !existingEmails.includes(student.email));

        // Create new students
        const newStudents = await Promise.all(
            filteredStudents.map((student) => {
                return Student.create({
                    ...student,
                    classroom: classroomId,
                    // Password will be hashed automatically by the pre-save hook
                });
            })
        );

        // Extract the IDs of newly created students
        const studentIds = newStudents.map(student => student._id);

        // Update the Classroom by adding new students to its students array
        await Classroom.updateOne(
            { _id: classroomId },
            { $push: { students: { $each: studentIds } } } // Use $push with $each to add multiple IDs
        );

        // Send response
        if (existingEmails.length > 0) {
            return res.status(409).json({
                message: "Some students were not created due to duplicate emails.",
                duplicates: existingEmails,
                createdStudents: newStudents,
            });
        }

        res.status(201).json(newStudents);
    } catch (error) {
        console.error("Error creating students:", error);
        res.status(500).json({ message: "Failed to create students" });
    }
};



module.exports = {
    createStudent,
    updateStudent,
    deleteStudent,
    getAllStudents,
    bulkCreateStudents,
    getStudent
};
