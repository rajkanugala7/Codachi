import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function LabsDashboard() {
  const location = useLocation();
  const navigate = useNavigate();

  // Extract state from navigation
  const { labs = [], classroomId, teacherId, className,studentCount,students } = location.state || {};

  // Find the specific lab based on classroomId
  const specificLab = labs.find((lab) => lab.classroomId === classroomId);

  // Sample images array
  const images = [
    "https://cdn.vectorstock.com/i/2000v/67/59/female-character-work-as-technical-support-vector-39826759.avif",
    "https://cdn.vectorstock.com/i/2000v/25/57/web-designer-services-concept-vector-29592557.avif",
    "https://cdn.vectorstock.com/i/2000v/55/65/programming-concept-in-modern-flat-design-for-web-vector-53765565.avif",
    "https://cdn.vectorstock.com/i/2000v/11/42/web-search-engine-concept-flat-vector-42241142.avif",
    "https://cdn.vectorstock.com/i/2000v/76/43/low-code-development-platform-vector-54257643.avif",
    "https://cdn.vectorstock.com/i/2000v/44/66/software-app-and-web-development-concept-vector-46694466.avif",
    "https://cdn.vectorstock.com/i/2000v/44/71/programmer-team-working-on-the-progect-vector-46694471.avif",
  ];

  // Function to handle lab click
  const handleLabClick = (labId) => {
    navigate("/experiments", { state: { labId, role: "Teacher",studentCount:studentCount ,classroomId:classroomId , className:className,students} });
  };
  console.log(studentCount,"llabs")
  return (
      <div>
           <img src="./airplane.jpg" alt="" id="airplane-bg" />
      <div className="classNameDiv">
        <h1>{className}</h1>
      </div>

      {/* Display specific lab or a fallback message */}
     

      <h3>All Labs</h3>
      <div className="cards">
        {labs.length > 0 ? (
          labs.map((lab, index) => (
            <div key={lab._id || index} className="lab-card" onClick={() => handleLabClick(lab._id)}>
              <img
                src={images[index % images.length]}
                alt={`Lab ${index + 1}`}
                className="card-img-top"
              />
              <h3
                
                className="card-body"
              >
                {lab.title || lab.labName || "Unnamed Lab"}
              </h3>
            </div>
          ))
        ) : (
          <p>No labs available.</p>
        )}
      </div>
    </div>
  );
}
