const Test = require('../models/Test');
const Set = require('../models/Set');
const Classroom = require('../models/Classroom');

// Create a new test
exports.createTest = async (req, res) => {
    try {
        const { testName, activeStatus, sets, testExpireTime, startTime, timeLimit, classroomId } = req.body;

        // Validate required fields
        if (!testName || !sets || !testExpireTime || !startTime || !timeLimit || !classroomId) {
            return res.status(400).json({ message: "All required fields must be provided." });
        }

        // Check if the classroom exists
        const classroom = await Classroom.findById(classroomId);
        if (!classroom) {
            return res.status(404).json({ message: "Classroom not found." });
        }

        // Create and save the new test
        const newTest = new Test({
            testName,
            activeStatus: activeStatus ?? true, // Default to true if not provided
            sets,
            testExpireTime: new Date(testExpireTime),
            startTime: new Date(startTime),
            timeLimit,
        });

        const savedTest = await newTest.save();

        // Add the test ID to the classroom's testIds array
        classroom.testIds = classroom.testIds || [];
        classroom.testIds.push(savedTest._id);

        console.log(classroom);
        // Save the updated classroom
        await classroom.save();

        res.status(201).json({
            message: "Test created successfully and added to the classroom.",
            test: savedTest,
        });
    } catch (error) {
        console.error("Error creating test:", error);
        res.status(500).json({ message: "Failed to create test.", error });
    }
};


// Get all tests
exports.getAllTests = async (req, res) => {
    try {
        const tests = await Test.find().populate('sets');
        res.status(200).json(tests);
    } catch (error) {
        res.status(500).json({ message: 'Failed to get tests', error });
    }
};

// Get a specific test by ID
exports.getTestById = async (req, res) => {
    try {
        const test = await Test.findById(req.params.id).populate('sets');
        if (!test) return res.status(404).json({ message: 'Test not found' });
        res.status(200).json(test);
    } catch (error) {
        res.status(500).json({ message: 'Failed to get test', error });
    }
};

exports.updateTest = async (req, res) => {
    try {
        const {
            testName,
            activeStatus,
            sets,
            testExpireTime,
            startTime,
            timeLimit,
            setId,
            studentId,
            experimentId,
            codeWritten,
            
        } = req.body;

        // Find the test by ID
        const test = await Test.findById(req.params.id);

        if (!test) {
            return res.status(404).json({ message: 'Test not found' });
        }

        // Update test fields if provided
        if (testName) test.testName = testName;
        if (activeStatus !== undefined) test.activeStatus = activeStatus;
        if (sets) test.sets = sets;
        if (testExpireTime) test.testExpireTime = testExpireTime;
        if (startTime) test.startTime = startTime;
        if (timeLimit) test.timeLimit = timeLimit;

        // If setId is not -1 and result is Accepted, update test submissions
        if (setId !== '-1') {
            const submission = test.testSubmissions.find(
                (sub) => sub.studentId.toString() === studentId && sub.setId.toString() === setId
            );

            if (submission) {
                // Check if the experiment already exists
                const experimentIndex = submission.codes.findIndex(
                    (code) => code.experimentId.toString() === experimentId
                );

                if (experimentIndex !== -1) {
                    // Update existing experiment's code
                    submission.codes[experimentIndex].codeWritten = codeWritten;
                } else {
                    // Add new experiment with code
                    submission.codes.push({ experimentId, codeWritten });
                }
            } else {
                // Add new test submission if it doesn't exist
                test.testSubmissions.push({
                    studentId,
                    setId,
                    codes: [{ experimentId, codeWritten }],
                });
            }
        }

        // Save updated test document
        const updatedTest = await test.save();

        res.status(200).json(updatedTest);
    } catch (error) {
        console.error('Error updating test:', error);
        res.status(500).json({ message: 'Failed to update test', error });
    }
};



// Delete a test by ID
exports.deleteTest = async (req, res) => {
    try {
        // Find and delete the test
        const deletedTest = await Test.findByIdAndDelete(req.params.id);
        if (!deletedTest) return res.status(404).json({ message: 'Test not found' });

        // Now, remove the testId from the corresponding classroom
        const classroom = await Classroom.findOneAndUpdate(
            { testIds: req.params.id },
            { $pull: { testIds: req.params.id } }, // Remove testId from the array
            { new: true } // Return the updated classroom
        );

        if (!classroom) {
            return res.status(404).json({ message: 'Classroom not found or testId not found in classroom' });
        }

        res.status(200).json({ message: 'Test deleted successfully and testId removed from classroom' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete test', error });
    }
};
