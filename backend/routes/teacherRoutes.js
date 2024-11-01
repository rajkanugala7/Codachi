const express = require('express');
const router = express.Router();
const {
    createTeacher,
    updateTeacher,
    deleteTeacher,
    getTeacherClassrooms,
} = require('../controllers/teacherController');

// Create Teacher
router.post('/', createTeacher);

// Update Teacher
router.put('/:id', updateTeacher);

// Delete Teacher
router.delete('/:id', deleteTeacher);


router.get("/:id", getTeacherClassrooms);

module.exports = router;
