require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

app.use(express.json());
app.use(cors());

// MongoDB connection
const PORT = process.env.PORT || 5000;
const url = process.env.MONGO_URL;

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("Database connected"))
    .catch((err) => console.log("Error connecting to database:", err));

// Import models
const Admin = require('./models/Admin');
const Classroom = require('./models/Classroom');
const Student = require('./models/Student');
const Teacher = require('./models/Teacher');
const Lab = require('./models/Lab');
const Experiment = require('./models/Experiment');
const TestCase = require('./models/TestCase');

// Routes

// Add Admin
app.post('/addAdmin', async (req, res) => {
    const { name, email, password } = req.body;
    const newAdmin = new Admin({ name, email, password });
    try {
        await newAdmin.save();
        res.send("Admin added");
    } catch (err) {
        res.status(400).send(err);
    }
});

// Create Classroom
app.post('/createClassroom', async (req, res) => {
    const { className } = req.body;
    try {
        const newClassroom = new Classroom({ className });
        await newClassroom.save();
        res.send("Classroom created successfully");
    } catch (err) {
        res.status(400).send(err);
    }
});

// Update Classroom
app.put('/updateClassroom/:id', async (req, res) => {
    const { id } = req.params;
    const { className } = req.body;
    try {
        const updatedClassroom = await Classroom.findByIdAndUpdate(id, { className }, { new: true });
        res.json(updatedClassroom);
    } catch (err) {
        res.status(400).send(err);
    }
});

// Delete Classroom
app.delete('/deleteClassroom/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await Classroom.findByIdAndDelete(id);
        res.send("Classroom deleted successfully");
    } catch (err) {
        res.status(400).send(err);
    }
});

// Get all classrooms
app.get('/getClassrooms', async (req, res) => {
    const classrooms = await Classroom.find().populate('students');
    res.json(classrooms);
});

// Create Student
app.post('/createStudent', async (req, res) => {
    const { name, email, password, classroomId } = req.body;
    const newStudent = new Student({ name, email, password, classroom: classroomId });
    try {
        await newStudent.save();
        await Classroom.findByIdAndUpdate(classroomId, { $push: { students: newStudent._id } });
        res.json(newStudent);
    } catch (err) {
        res.status(400).send(err);
    }
});

// Update Student
app.put('/updateStudent/:id', async (req, res) => {
    const { id } = req.params;
    const { name, email, password, classroomId } = req.body;
    try {
        const updatedStudent = await Student.findByIdAndUpdate(id, { name, email, password, classroom: classroomId }, { new: true });
        res.json(updatedStudent);
    } catch (err) {
        res.status(400).send(err);
    }
});

// Delete Student
app.delete('/deleteStudent/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await Student.findByIdAndDelete(id);
        res.send("Student deleted successfully");
    } catch (err) {
        res.status(400).send(err);
    }
});

// Get all students of a classroom
app.get('/getAllStudents/:classroomId', async (req, res) => {
    const { classroomId } = req.params;
    try {
        const classroom = await Classroom.findById(classroomId).populate('students');
        if (!classroom) {
            return res.status(404).send("Classroom not found");
        }
        res.json(classroom.students);
    } catch (err) {
        console.error(err);
        res.status(400).send("An error occurred while fetching students");
    }
});

// Create Teacher
app.post('/createTeacher', async (req, res) => {
    const { name, email, password } = req.body;
    const newTeacher = new Teacher({ name, email, password });
    try {
        await newTeacher.save();
        res.json(newTeacher);
    } catch (err) {
        res.status(400).send(err);
    }
});

// Update Teacher
app.put('/updateTeacher/:id', async (req, res) => {
    const { id } = req.params;
    const { name, email, password } = req.body;
    try {
        const updatedTeacher = await Teacher.findByIdAndUpdate(id, { name, email, password }, { new: true });
        res.json(updatedTeacher);
    } catch (err) {
        res.status(400).send(err);
    }
});

// Delete Teacher
app.delete('/deleteTeacher/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await Teacher.findByIdAndDelete(id);
        res.send("Teacher deleted successfully");
    } catch (err) {
        res.status(400).send(err);
    }
});

// Create Lab
app.post('/createLab', async (req, res) => {
    const { labName, classroomId } = req.body;
    const newLab = new Lab({ labName, classroom: classroomId });
    try {
        await newLab.save();
        await Classroom.findByIdAndUpdate(classroomId, { $push: { labs: newLab._id } });
        res.send("Lab created and added to classroom");
    } catch (err) {
        res.status(400).send(err);
    }
});

// Update Lab
app.put('/updateLab/:id', async (req, res) => {
    const { id } = req.params;
    const { labName } = req.body;
    try {
        const updatedLab = await Lab.findByIdAndUpdate(id, { labName }, { new: true });
        res.json(updatedLab);
    } catch (err) {
        res.status(400).send(err);
    }
});

// Delete Lab
app.delete('/deleteLab/:id', async (req, res) => {
    const { id } = req.params;
    try {
        // Optionally remove lab reference from Classroom if needed
        const lab = await Lab.findById(id);
        if (lab) {
            await Classroom.findByIdAndUpdate(lab.classroom, { $pull: { labs: id } });
        }
        await Lab.findByIdAndDelete(id);
        res.send("Lab deleted successfully");
    } catch (err) {
        res.status(400).send(err);
    }
});

// Get all labs of a classroom
app.get('/getAllLabs/:classroomId', async (req, res) => {
    const { classroomId } = req.params;
    try {
        const classroom = await Classroom.findById(classroomId).populate('labs');
        res.json(classroom.labs);
    } catch (err) {
        res.status(400).send(err);
    }
});

// Create Experiment
app.post('/createExperiment/:labId', async (req, res) => {
    const { name, problemStatement } = req.body;
    const { labId } = req.params;

    try {
        // Create the new experiment
        const newExperiment = new Experiment({ name, problemStatement });
        await newExperiment.save();

        // Add the experiment to the corresponding lab
        await Lab.findByIdAndUpdate(labId, { $push: { experiments: newExperiment._id } });

        res.json({ message: "Experiment created and added to lab", newExperiment });
    } catch (err) {
        res.status(400).send(err);
    }
});

// Create Test Case
app.post('/createTestCase/:experimentId', async (req, res) => {
    const { input, output } = req.body;
    const { experimentId } = req.params;

    try {
        // Create the new test case
        const newTestCase = new TestCase({ input, output });
        await newTestCase.save();

        // Add the new test case to the experiment
        await Experiment.findByIdAndUpdate(experimentId, { $push: { testCases: newTestCase._id } });

        res.json({ message: "Test case created and added to experiment", newTestCase });
    } catch (err) {
        res.status(400).send(err);
    }
});

// Add Test Case to Experiment
app.put('/addTestCaseToExperiment/:experimentId', async (req, res) => {
    const { experimentId } = req.params;
    const { testCaseId } = req.body;
    try {
        await Experiment.findByIdAndUpdate(experimentId, { $push: { testCases: testCaseId } });
        res.send("Test case added to experiment");
    } catch (err) {
        res.status(400).send(err);
    }
});

// Update Experiment
app.put('/updateExperiment/:id', async (req, res) => {
    const { id } = req.params;
    const { name, problemStatement } = req.body;
    try {
        const updatedExperiment = await Experiment.findByIdAndUpdate(id, { name, problemStatement }, { new: true });
        res.json(updatedExperiment);
    } catch (err) {
        res.status(400).send(err);
    }
});

// Delete Experiment
app.delete('/deleteExperiment/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await Experiment.findByIdAndDelete(id);
        res.send("Experiment deleted successfully");
    } catch (err) {
        res.status(400).send(err);
    }
});

// Get all experiments of a lab
app.get('/getAllExperiments/:labId', async (req, res) => {
    const { labId } = req.params;
    try {
        const lab = await Lab.findById(labId).populate('experiments');
        if (!lab) {
            return res.status(404).send("Lab not found");
        }
        res.json(lab.experiments);
    } catch (err) {
        res.status(400).send(err);
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
