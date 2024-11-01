import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

export default function AddExperiment() {
  const location = useLocation();
  const labId = location.state?.labId; // Get labId from location state
  const navigate = useNavigate();

  // State for form inputs
  const [experimentData, setExperimentData] = useState({
    name: "",
    problemStatement: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setExperimentData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Send data to the backend
      await axios.post(`http://localhost:8080/api/experiments`, {
        ...experimentData,
        labId // Include labId in the request body
      });
      alert("Experiment added successfully!");
      navigate('/experiments',{state:{labId}}); // Navigate back to the previous page
    } catch (err) {
      console.error("Error adding experiment:", err);
      alert("Failed to add experiment. Please try again.");
    }
  };

  return (
    <div>
      <h2>Add New Experiment</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="name">Experiment Name</label>
        <input
          type="text"
          name="name"
          placeholder="Enter Experiment name"
          value={experimentData.name}
          onChange={handleChange}
          required
        />
        <br />

        <label htmlFor="problemStatement">Problem Statement</label>
        <input
          type="text"
          name="problemStatement"
          placeholder="Enter Problem Statement"
          value={experimentData.problemStatement}
          onChange={handleChange}
          required
        />
        <br />

        <button type="submit">Add Experiment</button>
      </form>
    </div>
  );
}
