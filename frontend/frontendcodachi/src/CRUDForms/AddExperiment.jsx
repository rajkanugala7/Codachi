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
    problemStatement: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setExperimentData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Send data to the backend
      await axios.post(`https://codachi-1.onrender.com/api/experiments`, {
        ...experimentData,
        labId, // Include labId in the request body
      });
      alert("Experiment added successfully!");
      navigate("/experiments", { state: { labId ,role:"Teacher"} }); // Navigate back to the previous page
    } catch (err) {
      console.error("Error adding experiment:", err);
      alert("Failed to add experiment. Please try again.");
    }
  };

  return (
    <div>
      <video autoPlay muted loop id="bg-video">
                    <source src="./bgvideo.mp4" type="video/mp4" />
                    Your browser does not support the video tag.
                </video>
    <div className="edit-experiment-container">
      <h1 style={{ textAlign: "center", margin:"1rem" }}>Add New Experiment </h1>
      
      <form onSubmit={handleSubmit}>
        <div className="test-case-row">
          <label>
            Experiment Name
            <input
              type="text"
              name="name"
              placeholder="Enter Experiment name"
              value={experimentData.name}
              onChange={handleChange}
              required
            />
          </label>
        </div>
        <div className="test-case-row">
          <label>
            Problem Statement</label>
            <textarea
              name="problemStatement"
              placeholder="Enter Problem Statement"
              value={experimentData.problemStatement}
              onChange={handleChange}
              required
              rows="5"
              style={{ resize: "none" }}
            ></textarea>
        </div>
        <div className="actions">
          <button type="submit" style={{position:"relative" , bottom:"5vh"}}>Add Experiment</button>
        </div>
      </form>
      <img src="./idea1.png" alt="" className="headimg"/>
      </div>
      </div>
  );
}
