const Lab = require('../models/Lab');
const Classroom = require('../models/Classroom');

// Create Lab
const createLab = async (req, res) => {
    const { labName, classroomId } = req.body;
    const newLab = new Lab({ labName, classroom: classroomId });
    try {
        await newLab.save();
        await Classroom.findByIdAndUpdate(classroomId, { $push: { labs: newLab._id } });
        res.send("Lab created and added to classroom");
    } catch (err) {
        res.status(400).send(err);
    }
};

// Update Lab
const updateLab = async (req, res) => {
    const { id } = req.params;
    const { labName } = req.body;
    try {
        const updatedLab = await Lab.findByIdAndUpdate(id, { labName }, { new: true });
        res.json(updatedLab);
    } catch (err) {
        res.status(400).send(err);
    }
};

// Delete Lab
const deleteLab = async (req, res) => {
    const { id } = req.params;
    try {
        const lab = await Lab.findById(id);
        if (lab) {
            await Classroom.findByIdAndUpdate(lab.classroom, { $pull: { labs: id } });
        }
        await Lab.findByIdAndDelete(id);
        res.send("Lab deleted successfully");
    } catch (err) {
        res.status(400).send(err);
    }
};

// Get all labs of a classroom
const getAllLabs = async (req, res) => {
    const { classroomId } = req.params;
    try {
        const classroom = await Classroom.findById(classroomId).populate('labs');
        res.json(classroom.labs);
    } catch (err) {
        res.status(400).send(err);
    }
};

module.exports = {
    createLab,
    updateLab,
    deleteLab,
    getAllLabs
};
