const express = require('express');
const router = express.Router();
const {
    createClassroom,
    updateClassroom,
    deleteClassroom,
    getAllClassrooms,
    getClassroomById,
} = require('../controllers/classroomController');

// Create Classroom
router.post('/', createClassroom);

// Update Classroom
router.put('/:id', updateClassroom);

// Delete Classroom
router.delete('/:id', deleteClassroom);

// Get all Classrooms
router.get('/', getAllClassrooms);

router.get('/:id',getClassroomById)
module.exports = router;
