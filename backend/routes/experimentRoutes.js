const express = require('express');
const router = express.Router();
const {
    createExperiment,
    updateExperiment,
    deleteExperiment,
    getAllExperiments, // This should match the export in the controller
} = require('../controllers/experimentController'); // Check the path

// Define routes
router.post('/', createExperiment);
router.put('/:id', updateExperiment);
router.delete('/:id', deleteExperiment);
router.get('/:labId', getAllExperiments); // Ensure this is correct

module.exports = router;
