const express = require('express');
const router = express.Router();
const {
    createTeacher,
    updateTeacher,
    deleteTeacher,
} = require('../controllers/teacherController');

// Create Teacher
router.post('/', createTeacher);

// Update Teacher
router.put('/:id', updateTeacher);

// Delete Teacher
router.delete('/:id', deleteTeacher);

module.exports = router;
