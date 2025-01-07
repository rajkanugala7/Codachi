import { useLocation, useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";

export default function EditTest() {
    const location = useLocation();
    const navigate = useNavigate();
    const { test } = location?.state;

    const [testDetails, setTestDetails] = useState({
        testName: test?.testName || "",
        startTime: test?.startTime || "",
        expireTime: test?.expireTime || "",
        timeLimit: test?.timeLimit || "",
    });

    const [sets, setSets] = useState(test?.sets || []); // Adding sets here

    useEffect(() => {
        if (test) {
            setTestDetails({
                testName: test.testName,
                startTime: test.startTime ? new Date(test.startTime).toISOString().slice(0, 16) : "",
                expireTime: test.expireTime ? new Date(test.expireTime).toISOString().slice(0, 16) : "",
                timeLimit: test.timeLimit,
            });

            // Assuming the test object already contains sets. If not, fetch them here.
            setSets(test.sets);
        }
    }, [test]);

    const handleTestDetailChange = (e) => {
        const { name, value } = e.target;
        setTestDetails((prevDetails) => ({
            ...prevDetails,
            [name]: value,
        }));
    };

    const handleSetChange = (setId, questionId, newQuestionId) => {
        setSets((prevSets) =>
            prevSets.map((set) =>
                set.id === setId
                    ? {
                          ...set,
                          questions: set.questions.map((qid) =>
                              qid === questionId ? newQuestionId : qid
                          ),
                      }
                    : set
            )
        );
    };

    const handleAddQuestion = (setId, newQuestionId) => {
        setSets((prevSets) =>
            prevSets.map((set) =>
                set.id === setId
                    ? { ...set, questions: [...set.questions, newQuestionId] }
                    : set
            )
        );
    };

    const handleSubmit = async () => {
        // Here, you can add your logic to save the edited details, including sets, e.g., via an API call.
        console.log("Updated Test Details:", testDetails);
        console.log("Updated Sets:", sets);
        // After updating, navigate to another page or show a success message.
        navigate("/your-next-page"); // Adjust this as needed
    };

    return (
        <div>
            <h1>Edit Test: {testDetails.testName}</h1>

            {/* Test Details Form */}
            <div>
                <label>
                    Test Name:
                    <input
                        type="text"
                        name="testName"
                        value={testDetails.testName || ""}
                        onChange={handleTestDetailChange}
                    />
                </label>
            </div>

            <div>
                <label>
                    Start Time:
                    <input
                        type="datetime-local"
                        name="startTime"
                        value={testDetails.startTime || ""}
                        onChange={handleTestDetailChange}
                    />
                </label>
            </div>

            <div>
                <label>
                    Expire Time:
                    <input
                        type="datetime-local"
                        name="expireTime"
                        value={testDetails.expireTime || ""}
                        onChange={handleTestDetailChange}
                    />
                </label>
            </div>

            <div>
                <label>
                    Time Limit (seconds):
                    <input
                        type="number"
                        name="timeLimit"
                        value={testDetails.timeLimit || ""}
                        onChange={handleTestDetailChange}
                    />
                </label>
            </div>

            {/* Sets Section */}
            <h2>Sets</h2>
            {sets.map((set) => (
                <div key={set.id}>
                    <h3>Set {set.id}</h3>
                    <ul>
                        {set.questions.map((questionId, index) => (
                            <li key={`${set.id}-${questionId}-${index}`}> {/* Using set.id, questionId, and index */}
                                <label>
                                    Question ID:
                                    <input
                                        type="text"
                                        value={questionId || ""}
                                        onChange={(e) =>
                                            handleSetChange(set.id, questionId, e.target.value)
                                        }
                                    />
                                </label>
                            </li>
                        ))}
                    </ul>
                    <button
                        onClick={() => handleAddQuestion(set.id, prompt("Enter new Question ID"))}
                    >
                        Add Question
                    </button>
                </div>
            ))}

            <div>
                <button onClick={handleSubmit}>Save Changes</button>
            </div>
        </div>
    );
}
