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
      const response = await axios.post("https://codachi-1.onrender.com/api/classrooms", {
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
    <div style={{ backgroundColor: "", width: "100vw",height:"100vh"}}>
      <h3 style={{textAlign:"center" }}>Creating new Classroom</h3>
    <div style={{backgroundColor:"#9D9DCC" , width:"70vw" ,height:"70vh", borderRadius:"2rem" , padding:"2rem", marginLeft:"15vw", display:"flex" }} >
      <form onSubmit={handleSubmit} >
        <label htmlFor="classroomName">Class Name:</label> &nbsp;&nbsp;
        <input
          type="text"
          placeholder="Enter classroom name"
          name="classroomName"
          value={classroomName}
          onChange={(e) => setClassroomName(e.target.value)}
          required
        />
        <button type="submit" className="btn" style={{backgroundColor:"#090933", color:"#D8D8D8"}}>Create</button>
      </form>
        {createError && <p style={{ color: "red" }}>{createError}</p>}
        <img src="./workroom.png" alt="" />

      </div>
      </div>

  );
}
