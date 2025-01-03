const Set = require('../models/Set');
const Experiment = require('../models/Experiment');

// Create a new set
exports.createSet = async (req, res) => {
    try {
        const {  questions } = req.body;

        const newSet = new Set({
           
            questions
        });

        const savedSet = await newSet.save();
        res.status(201).json(savedSet);
    } catch (error) {
        res.status(500).json({ message: 'Failed to create set', error });
    }
};

// Get all sets
exports.getAllSets = async (req, res) => {
    try {
        const sets = await Set.find().populate('questions');
        res.status(200).json(sets);
    } catch (error) {
        res.status(500).json({ message: 'Failed to get sets', error });
    }
};

// Get a specific set by ID
exports.getSetById = async (req, res) => {
    try {
        const set = await Set.findById(req.params.id).populate('questions');
        if (!set) return res.status(404).json({ message: 'Set not found' });
        res.status(200).json(set);
    } catch (error) {
        res.status(500).json({ message: 'Failed to get set', error });
    }
};

// Update a set by ID
exports.updateSet = async (req, res) => {
    try {
        const { setName, questions } = req.body;
        const updatedSet = await Set.findByIdAndUpdate(
            req.params.id,
            { setName, questions },
            { new: true }
        );

        if (!updatedSet) return res.status(404).json({ message: 'Set not found' });

        res.status(200).json(updatedSet);
    } catch (error) {
        res.status(500).json({ message: 'Failed to update set', error });
    }
};

// Delete a set by ID
exports.deleteSet = async (req, res) => {
    try {
        const deletedSet = await Set.findByIdAndDelete(req.params.id);
        if (!deletedSet) return res.status(404).json({ message: 'Set not found' });
        res.status(200).json({ message: 'Set deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete set', error });
    }
};
