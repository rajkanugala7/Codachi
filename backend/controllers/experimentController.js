const Experiment = require('../models/Experiment');
const Lab = require('../models/Lab');


const createExperiment = async (req, res) => {
    const { labId, name, problemStatement } = req.body;

    try {
        // Create the new experiment
        const newExperiment = new Experiment({ name, problemStatement });
        await newExperiment.save();

        // Find the lab by labId and add the new experiment to its experiments array
        const updatedLab = await Lab.findByIdAndUpdate(
            labId,
            { $push: { experiments: newExperiment._id } },
            { new: true }
        );

        if (!updatedLab) {
            return res.status(404).json({ message: 'Lab not found' });
        }

        res.status(201).json({
            message: 'Experiment created and added to lab successfully',
            experiment: newExperiment,
            lab: updatedLab
        });
    } catch (err) {
        console.error('Error creating experiment:', err);
        res.status(400).json({ error: 'Failed to create experiment' });
    }
};


const getAllExperiments = async (req, res) => {
    const { labId } = req.params;
    try {
        // First, find the lab and populate its experiments
        const lab = await Lab.findById(labId).populate('experiments'); // Assuming 'experiments' is the field name in the Lab model
        
        // Check if the lab exists
        if (!lab) {
            return res.status(404).json({ message: 'Lab not found' });
        }
        console.log(lab);
        // Return the experiments from the lab
        res.json(lab.experiments);
    } catch (err) {
        res.status(400).send(err);
    }
};


// Update Experiment
const updateExperiment = async (req, res) => {
    const { id } = req.params;
    const { name, problemStatement } = req.body;
    try {
        const updatedExperiment = await Experiment.findByIdAndUpdate(id, { name, problemStatement }, { new: true });
        if (!updatedExperiment) {
            return res.status(404).send("Experiment not found");
        }
        res.json(updatedExperiment);
    } catch (err) {
        res.status(400).send(err);
    }
};

// Delete Experiment
const deleteExperiment = async (req, res) => {
    const { id } = req.params;
    try {
        const experiment = await Experiment.findById(id);
        if (!experiment) {
            return res.status(404).send("Experiment not found");
        }
        await Experiment.findByIdAndDelete(id);
        res.send("Experiment deleted successfully");
    } catch (err) {
        res.status(400).send(err);
    }
};

module.exports = {
    createExperiment,
    updateExperiment,
    deleteExperiment,
    getAllExperiments
};
