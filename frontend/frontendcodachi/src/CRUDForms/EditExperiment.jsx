import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

export default function EditExperiment() {
  const location = useLocation();
  const navigate = useNavigate();
  const experiment = location.state?.experiment; // Assuming the experiment object is passed in state

  const [testCases, setTestCases] = useState([]);
  const [error, setError] = useState('');

  // Fetch existing test cases when the component mounts
  useEffect(() => {
    const fetchTestCases = async () => {
      try {
          const response = await axios.get(`http://localhost:8080/api/testcases/${experiment._id}`);
          console.log("testcases", response.data);
        setTestCases(response.data);
      } catch (err) {
        console.error("Error fetching test cases:", err);
        setError("Failed to load test cases. Please try again.");
      }
    };

    fetchTestCases();
  }, [experiment._id]); // Run when experiment ID changes

  const handleAddTestCase = () => {
    setTestCases([...testCases, { input: "", output: "" }]); // Add a new empty test case
  };

  const handleChange = (index, field, value) => {
    const updatedTestCases = [...testCases];
    updatedTestCases[index][field] = value; // Update input or output
    setTestCases(updatedTestCases);
  };

  const handleDeleteTestCase = async (index) => {
    const testCaseId = testCases[index]._id; // Get the ID of the test case to delete
    try {
      await axios.delete(`http://localhost:8080/api/testcases/${testCaseId}`); // Delete the test case
      setTestCases(testCases.filter((_, i) => i !== index)); // Update state to remove deleted test case
      alert("Test case deleted successfully!");
    } catch (err) {
      console.error("Error deleting test case:", err);
      setError("Failed to delete test case. Please try again.");
    }
  };

  const handleSubmitTestCases = async (e) => {
    e.preventDefault();

    try {
        // Clear existing test cases associated with the experiment
        await axios.delete(`http://localhost:8080/api/testcases/experiment/${experiment._id}`);
          
        // Create new test cases linked to the experiment
        console.log(testCases);
        const testCasePromises = testCases.map((testCase) =>
            axios.post('http://localhost:8080/api/testcases', {
                input: testCase.input,
                expectedOutput: testCase.output,
                experimentId: experiment._id, // Pass the experiment ID
            })
        );

        await Promise.all(testCasePromises); // Wait for all test cases to be created

        alert("Test cases updated successfully!");
        navigate(-1); // Navigate back after successful submission
    } catch (err) {
        console.error("Error updating test cases:", err);
        setError("Failed to update test cases. Please try again."); // Set error message
    }
};


  return (
    <div>
      <h1>Edit Experiment: {experiment.name}</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>} {/* Display error message */}
      <form onSubmit={handleSubmitTestCases}>
        {testCases.map((testCase, index) => (
          <div key={index}>
            <h3>
              Test Case {index + 1}
              <button type="button" onClick={() => handleDeleteTestCase(index)} style={{ marginLeft: '10px', color: 'red' }}>
                Delete
              </button>
            </h3>
            <label>
              Input (space-separated):
              <input
                type="text"
                value={testCase.input}
                onChange={(e) => handleChange(index, "input", e.target.value)}
                required
              />
            </label>
            <br />
            <label>
              Output (space-separated):
              <input
                type="text"
                value={testCase.output}
                onChange={(e) => handleChange(index, "output", e.target.value)}
                required
              />
            </label>
            <br />
          </div>
        ))}
        <button type="button" onClick={handleAddTestCase}>
          Add More Test Cases
        </button>
        <br />
        <button type="submit">Submit Test Cases</button>
      </form>
    </div>
  );
}
