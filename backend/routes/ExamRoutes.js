const express = require('express');
const router = express.Router();

const {
    createTest,
    getAllTests,
    getTestById,
    updateTest,
    deleteTest,
} = require('../controllers/TestController');

const {
    createSet,
    getAllSets,
    getSetById,
    updateSet,
    deleteSet,
} = require('../controllers/SetController');

// Test routes
router.post('/test', createTest);
router.get('/test', getAllTests);
router.get('/test/:id', getTestById);
router.put('/test/:id', updateTest);
router.delete('/test/:id', deleteTest);

// Set routes
router.post('/set', createSet);
router.get('/set', getAllSets);
router.get('/set/:id', getSetById);
router.put('/set/:id', updateSet);
router.delete('/set/:id', deleteSet);

module.exports = router;
