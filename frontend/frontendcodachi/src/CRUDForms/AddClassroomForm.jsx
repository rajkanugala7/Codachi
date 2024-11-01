import axios from "axios";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function AddClassroomForm() {
  const [classroomName, setClassroomName] = useState("");
  const [createError, setCreateError] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const user = location?.state?.user; // Get user directly from location state
  const role = location?.state?.role;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:8080/api/classrooms", {
        className: classroomName,
        teacherId: user?._id, // Use user._id directly
      });
     
      navigate("/teacher", { state: { user, role } });
    } catch (error) {
      console.error("Error creating classroom:", error);
      setCreateError("Failed to create classroom. Please try again.");
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label htmlFor="classroomName">Class Name:</label> &nbsp;&nbsp;
        <input
          type="text"
          placeholder="Enter classroom name"
          name="classroomName"
          value={classroomName}
          onChange={(e) => setClassroomName(e.target.value)}
          required
        />
        <button type="submit">Create</button>
      </form>
      {createError && <p style={{ color: "red" }}>{createError}</p>}
    </div>
  );
}
