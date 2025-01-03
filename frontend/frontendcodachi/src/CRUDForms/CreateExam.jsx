import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { Button, Select, MenuItem, TextField, Typography } from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import axios from "axios";

const theme = createTheme();

export default function CreateExam() {
    const location = useLocation();
    const { experiments = [], classroomId } = location?.state || {};

    const [sets, setSets] = useState([{ id: 1, questions: [] }]);
    const [selectedExperiments, setSelectedExperiments] = useState({});
    const [testDetails, setTestDetails] = useState({
        testName: "",
        startTime: "",
        expireTime: "",
        timeLimit: "",
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const addSet = () => {
        setSets([...sets, { id: sets.length + 1, questions: [] }]);
    };

    const handleSelectChange = (setId, experimentId) => {
        setSelectedExperiments({
            ...selectedExperiments,
            [setId]: experimentId,
        });
    };

    const addQuestionToSet = (setId) => {
        const selectedExperiment = selectedExperiments[setId];
        if (selectedExperiment) {
            setSets(
                sets.map((set) =>
                    set.id === setId
                        ? { ...set, questions: [...set.questions, selectedExperiment] }
                        : set
                )
            );
            setSelectedExperiments({
                ...selectedExperiments,
                [setId]: "",
            });
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setTestDetails({
            ...testDetails,
            [name]: value,
        });
    };

    const createTest = async () => {
        setIsSubmitting(true);
        try {
            // Create sets one by one
            const setIds = [];
            for (const set of sets) {
                const response = await axios.post("http://localhost:8080/api/exam/set", {
                    classroomId,
                    setName:"",
                    questions: set.questions,
                });
                setIds.push(response.data._id);
            }

            // Create the test
            const testData = {
                classroomId,
                sets: setIds, // Pass all created set IDs
                testName: testDetails.testName,
                activeStatus: true,
                startTime: new Date(testDetails.startTime),
                testExpireTime: new Date(testDetails.expireTime),
                timeLimit: parseInt(testDetails.timeLimit, 10), // Convert to seconds
            };

            const testResponse = await axios.post("http://localhost:8080/api/exam/test", testData);
            console.log("Test created successfully:", testResponse.data);
        } catch (error) {
            console.error("Error creating test:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <ThemeProvider theme={theme}>
            <div>
                <Typography variant="h4">Create New Test</Typography>
                <Typography variant="body1">Classroom ID: {classroomId}</Typography>

                <TextField
                    label="Test Name"
                    name="testName"
                    value={testDetails.testName}
                    onChange={handleInputChange}
                    fullWidth
                    margin="normal"
                />
                <TextField
                    label="Start Time"
                    name="startTime"
                    type="datetime-local"
                    value={testDetails.startTime}
                    onChange={handleInputChange}
                    fullWidth
                    margin="normal"
                    InputLabelProps={{ shrink: true }}
                />
                <TextField
                    label="Expire Time"
                    name="expireTime"
                    type="datetime-local"
                    value={testDetails.expireTime}
                    onChange={handleInputChange}
                    fullWidth
                    margin="normal"
                    InputLabelProps={{ shrink: true }}
                />
                <TextField
                    label="Time Limit (seconds)"
                    name="timeLimit"
                    type="number"
                    value={testDetails.timeLimit}
                    onChange={handleInputChange}
                    fullWidth
                    margin="normal"
                />

                {sets.map((set, setIndex) => (
                    <div
                        key={set.id}
                        style={{
                            marginBottom: "20px",
                            border: "1px solid #ccc",
                            padding: "10px",
                        }}
                    >
                        <Typography variant="h6">Set {setIndex + 1}</Typography>
                        <ul>
                            {set.questions.map((questionId, questionIndex) => (
                                <li key={experiments.find((exp) => exp._id === questionId)?._id || questionIndex}>
                                    {experiments.find((exp) => exp._id === questionId)?.name || "Unknown Experiment"}
                                </li>
                            ))}
                        </ul>
                        <Select
                            style={{ width: "200px", marginRight: "10px" }}
                            value={selectedExperiments[set.id] || ""}
                            onChange={(e) =>
                                handleSelectChange(set.id, e.target.value)
                            }
                            displayEmpty
                        >
                            <MenuItem value="" disabled>
                                Select Experiment
                            </MenuItem>
                            {experiments?.map((experiment) => (
                                <MenuItem key={experiment._id} value={experiment._id}>
                                    {experiment.name}
                                </MenuItem>
                            ))}
                        </Select>
                        <Button
                            variant="contained"
                            color="primary"
                            startIcon={<AddCircleOutlineIcon />}
                            onClick={() => addQuestionToSet(set.id)}
                            disabled={!selectedExperiments[set.id]}
                        >
                            Add Question
                        </Button>
                    </div>
                ))}

                <Button
                    variant="contained"
                    color="secondary"
                    startIcon={<AddCircleOutlineIcon />}
                    onClick={addSet}
                >
                    Add New Set
                </Button>

                <br />
                <br />
                <Button
                    variant="contained"
                    color="primary"
                    onClick={createTest}
                    disabled={isSubmitting || !testDetails.testName || !testDetails.startTime || !testDetails.expireTime || !testDetails.timeLimit}
                >
                    {isSubmitting ? "Creating Test..." : "Create Test"}
                </Button>
            </div>
        </ThemeProvider>
    );
}
