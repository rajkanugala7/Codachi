const Experiment = require('../models/Experiment');
const Lab = require('../models/Lab');
const Classroom=require('../models/Classroom')

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

const addStudenttoExp = async (req, res) => {
    const { id } = req.params; // The experiment ID
    const { classroomId, studentId } = req.body; // Classroom ID and Student ID from the request body

    try {
        // Check if the classroom exists
        const classroom = await Classroom.findById(classroomId);
        if (!classroom) {
            return res.status(404).json({ message: 'Classroom not found' });
        }

        // Find the experiment by ID
        const experiment = await Experiment.findById(id);
        if (!experiment) {
            return res.status(404).json({ message: 'Experiment not found' });
        }

        // Get the classroom progress for the given classroomId (initialize to an empty array if not present)
        console.log(experiment.classroomProgress[classroomId])
        const classroomProgress = experiment.classroomProgress.get(classroomId) || [];
        // Log the current classroomProgress for debugging
        console.log('Current classroom progress:', classroomProgress);

        // Initialize a flag for checking if the student exists
        let studentAlreadyExists = false;


        for (let i = 0; i < classroomProgress.length; i++) {
            // Ensure both studentId and classroomProgress[i].studentId are strings
            const currentStudentId = classroomProgress[i].studentId.toString();
            const targetStudentId = studentId.toString();
        
            console.log(`Comparing studentId: ${currentStudentId} with targetStudentId: ${targetStudentId}`);
            
            if (currentStudentId === targetStudentId) {
                studentAlreadyExists = true;
                break; // Exit loop if found
            }
        }
        
        if (studentAlreadyExists) {
            console.log("Student already exists in the classroom progress.");
        } else {
            console.log("Student doesn't exist, proceed with adding.");
        }
        
        // Log the check for duplication
        console.log('Checking if student exists:', studentAlreadyExists);

        if (studentAlreadyExists) {
            return res.status(200).json({ message: 'Student already exists in the classroom progress' });
        }

        // Create the new completion entry
        const newCompletion = {
            studentId,
            completedAt: new Date() // Set the current date and time
        };

        // Log the new completion for debugging
        console.log('New completion entry:', newCompletion);

        // Use findByIdAndUpdate to add the new student to the classroomProgress array
        const updatedExperiment = await Experiment.findByIdAndUpdate(
            id, // The experiment ID
            {
                $addToSet: { // Use $addToSet to avoid duplicates
                    [`classroomProgress.${classroomId}`]: newCompletion
                }
            },
            { new: true } // Return the updated document
        );

        if (!updatedExperiment) {
            return res.status(404).json({ message: 'Experiment not found' });
        }

        // Respond with success
        res.status(200).json({
            message: 'Student added to the experiment progress successfully',
            experiment: updatedExperiment,
            newCompletion: newCompletion
        });
    } catch (err) {
        console.error('Error adding student to experiment:', err);
        res.status(500).json({ error: 'Failed to add student to experiment' });
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

const getExperimentById = async (req, res) => {
    const { id } = req.params; // The experiment ID from the URL parameters

    try {
        // Find the experiment by its ID
        const experiment = await Experiment.findById(id); // Optional: populate lab if there's a reference

        // Check if the experiment exists
        if (!experiment) {
            return res.status(404).json({ message: 'Experiment not found' });
        }

        // Respond with the experiment details
        res.status(200).json(experiment);
    } catch (err) {
        console.error('Error retrieving experiment:', err);
        res.status(500).json({ error: 'Failed to retrieve experiment' });
    }
};

module.exports = {
    createExperiment,
    updateExperiment,
    deleteExperiment,
    getAllExperiments,
    addStudenttoExp,
    getExperimentById, // Add the new method here
};
