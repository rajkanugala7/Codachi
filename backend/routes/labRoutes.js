const express = require('express');
const router = express.Router();
const {
    createLab,
    updateLab,
    deleteLab,
    getAllLabs,
    getLabsOfClassroom,
} = require('../controllers/labController');

// Create Lab
router.post('/', createLab);

// Update Lab
router.put('/:id', updateLab);

// Delete Lab
router.delete('/:id', deleteLab);

// Get all Labs of a Classroom
router.get('/:classroomId/:teacherId', getAllLabs);
router.get('/:id', getLabsOfClassroom);

module.exports = router;
