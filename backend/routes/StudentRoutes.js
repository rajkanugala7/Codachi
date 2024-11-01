const express = require('express');
const router = express.Router();
const {
    createStudent,
    updateStudent,
    deleteStudent,
    getAllStudents,
    bulkCreateStudents,
    getStudent
} = require('../controllers/studentController');

// Create Student
router.post('/', createStudent);
// Update Student
router.put('/:id', updateStudent);

// Delete Student
router.delete('/:id', deleteStudent);
router.get('/student/:id', getStudent);
// Get all Students of a Classroom
router.get('/:classroomId', getAllStudents);
router.post("/bulk-create", bulkCreateStudents);

module.exports = router;
