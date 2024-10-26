const express = require('express');
const router = express.Router();
const {
    createStudent,
    updateStudent,
    deleteStudent,
    getAllStudents,
} = require('../controllers/studentController');

// Create Student
router.post('/', createStudent);
// Update Student
router.put('/:id', updateStudent);

// Delete Student
router.delete('/:id', deleteStudent);

// Get all Students of a Classroom
router.get('/:classroomId', getAllStudents);

module.exports = router;
