const Lab = require('../models/Lab');
const Classroom = require('../models/Classroom');

// Create Lab
const createLab = async (req, res) => {
    const { labName, classroomId, teacherId } = req.body;

    // Include teacherId if provided, otherwise create lab without it
    const newLab = new Lab({ 
        labName, 
        classroom: classroomId,
        ...(teacherId && { teacher: teacherId }) // Only add teacher if provided
    });

    try {
        // Save the new lab
        await newLab.save();

        // Add the lab ID to the classroom's labs array
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
    const { classroomId, teacherId } = req.params; // Expecting both classroomId and teacherId from the request parameters
    try {
        // Find the classroom and populate its labs
        const classroom = await Classroom.findById(classroomId).populate({
            path: 'labs',
            match: { teacher: teacherId } // Filter labs by the teacherId
        });

        // Check if the classroom was found
        if (!classroom) {
            return res.status(404).json({ message: "Classroom not found" });
        }
        console.log(classroom)
        // Return the filtered labs or an empty array if none match
        res.json(classroom.labs || []);
    } catch (err) {
        res.status(400).send(err);
    }
};

// Get all labs of a classroom for students
const getLabsOfClassroom = async (req, res) => {
    const {id } = req.params; // Expecting only classroomId from the request parameters
  
    try {
        // Find the classroom and populate its labs
        const classroom = await Classroom.findById(id).populate('labs'); // Populate labs without teacher filter
        console.log(id)
        console.log(classroom);
        // Check if the classroom was found
        if (!classroom) {
            return res.status(404).json({ message: "Classroom not found" });
        }

        // Return the labs or an empty array if none exist
        res.json(classroom.labs || []);
    } catch (err) {
        res.status(400).send(err);
    }
};

module.exports = {
    createLab,
    updateLab,
    deleteLab,
    getAllLabs,
    getLabsOfClassroom // Export the new method
};
