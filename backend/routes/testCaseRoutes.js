const express = require('express');
const router = express.Router();
const {
    createTestCase,
    updateTestCase,
    deleteTestCase,
    getAllTestCases,
} = require('../controllers/testCaseController');

// Create Test Case
router.post('/', createTestCase);

// Update Test Case
router.put('/:id', updateTestCase);

// Delete Test Case
router.delete('/:id', deleteTestCase);

// Get all Test Cases of an Experiment
router.get('/:experimentId', getAllTestCases);

module.exports = router;
