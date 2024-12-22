import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

export default function EditExperiment() {
  const location = useLocation();
  const navigate = useNavigate();
  const experiment = location.state?.experiment;

  const [testCases, setTestCases] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTestCases = async () => {
      try {
        const response = await axios.get(`https://codachi-1.onrender.com/api/testcases/${experiment._id}`);
        setTestCases(response.data);
      } catch (err) {
        console.error("Error fetching test cases:", err);
        setError("Failed to load test cases. Please try again.");
      }
    };
    fetchTestCases();
  }, [experiment._id]);

  const handleAddTestCase = () => {
    setTestCases([...testCases, { input: "", output: "" }]);
  };

  const handleChange = (index, field, value) => {
    const updatedTestCases = [...testCases];
    updatedTestCases[index][field] = value;
    setTestCases(updatedTestCases);
  };

  const handleDeleteTestCase = async (index) => {
    const testCaseId = testCases[index]._id;
    try {
      await axios.delete(`http://localhost:8080/api/testcases/${testCaseId}`);
      setTestCases(testCases.filter((_, i) => i !== index));
      alert("Test case deleted successfully!");
    } catch (err) {
      console.error("Error deleting test case:", err);
      setError("Failed to delete test case. Please try again.");
    }
  };

  const handleSubmitTestCases = async (e) => {
    e.preventDefault();

    try {
      await axios.delete(`http://localhost:8080/api/testcases/experiment/${experiment._id}`);
      const testCasePromises = testCases.map((testCase) =>
        axios.post("http://localhost:8080/api/testcases", {
          input: testCase.input,
          expectedOutput: testCase.output,
          experimentId: experiment._id,
        })
      );

      await Promise.all(testCasePromises);
      alert("Test cases updated successfully!");
      navigate(-1);
    } catch (err) {
      console.error("Error updating test cases:", err);
      setError("Failed to update test cases. Please try again.");
    }
  };

  return (
    <div>
       <video autoPlay muted loop id="bg-video">
                    <source src="./bgvideo.mp4" type="video/mp4" />
                    Your browser does not support the video tag.
                </video>
    <div className="edit-experiment-container">
      <p style={{ textAlign: "center" }}>Test Cases for {experiment.name }</p>
      {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}
      <form onSubmit={handleSubmitTestCases}>
        {testCases.map((testCase, index) => (
          <div className="test-case-row" key={index}>
            <div className="test-case-number">
              <h6>Test Case {index + 1}</h6>
              <button
                type="button"
                className="delete-btn"
                onClick={() => handleDeleteTestCase(index)}
              >
                Delete
              </button>
            </div>
            <div className="test-case-fields">
              <label>
                Input (space-separated):
                <input
                  type="text"
                  value={testCase.input}
                  onChange={(e) => handleChange(index, "input", e.target.value)}
                  required
                />
              </label>
              <label>
                Output (space-separated):
                <input
                  type="text"
                  value={testCase.output}
                  onChange={(e) => handleChange(index, "output", e.target.value)}
                  required
                />
              </label>
            </div>
          </div>
        ))}
        <div className="actions">
          <button type="button" onClick={handleAddTestCase}>
            Add More Test Cases
          </button>
          <button type="submit">Submit Test Cases</button>
        </div>
      </form>
      </div>
      </div>
  );
}
