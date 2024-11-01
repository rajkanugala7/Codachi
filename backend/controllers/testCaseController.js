const TestCase = require('../models/TestCase');
const Experiment = require('../models/Experiment');

// Create Test Case
// Create Test Case
const createTestCase = async (req, res) => {
    const { input, expectedOutput, experimentId } = req.body;
    const newTestCase = new TestCase({ input, output: expectedOutput });
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


const deleteTestCasesByExperimentId = async (req, res) => {
    const { experimentId } = req.params;

    try {
        // Find the experiment by ID and populate test cases
        const experiment = await Experiment.findById(experimentId).populate('testCases');
        console.log(experiment)
        if (!experiment) {
            return res.status(404).send("Experiment not found");
        }

        // If the experiment has test cases, delete them
        if (experiment.testCases && experiment.testCases.length > 0) {
            // Delete test cases by their IDs
            await TestCase.deleteMany({ _id: { $in: experiment.testCases } });
            // Clear the test cases array in the experiment
            experiment.testCases = []; // Make sure to set it to an empty array
            await experiment.save(); // Save the changes to the experiment
        }

        res.send(experiment);
    } catch (err) {
        res.status(400).send(err);
    }
};




module.exports = {
    createTestCase,
    getAllTestCases,
    updateTestCase,
    deleteTestCase,
    deleteTestCasesByExperimentId
};
