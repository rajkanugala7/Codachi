const TestCase = require('../models/TestCase');
const Experiment = require('../models/Experiment');

// Create Test Case
const createTestCase = async (req, res) => {
    const { input, expectedOutput, experimentId } = req.body;
    const newTestCase = new TestCase({ input, expectedOutput, experiment: experimentId });
    try {
        await newTestCase.save();
        await Experiment.findByIdAndUpdate(experimentId, { $push: { testCases: newTestCase._id } });
        res.json(newTestCase);
    } catch (err) {
        res.status(400).send(err);
    }
};
const updateTestCase = async (req, res) => {
    const { id } = req.params;
    const { input, expectedOutput } = req.body;
    try {
        const updatedTestCase = await TestCase.findByIdAndUpdate(id, { input, expectedOutput }, { new: true });
        res.json(updatedTestCase);
    } catch (err) {
        res.status(400).send(err);
    }
};

// Get all Test Cases for an Experiment
const getAllTestCases = async (req, res) => {
    const { experimentId } = req.params;
    try {
        const experiment = await Experiment.findById(experimentId).populate('testCases');
        res.json(experiment.testCases);
    } catch (err) {
        res.status(400).send(err);
    }
};
const deleteTestCase = async (req, res) => {
    const { id } = req.params;
    try {
        await TestCase.findByIdAndDelete(id);
        res.send("Test case deleted successfully");
    } catch (err) {
        res.status(400).send(err);
    }
};

module.exports = {
    createTestCase,
    getAllTestCases,
    updateTestCase,
    deleteTestCase
};
