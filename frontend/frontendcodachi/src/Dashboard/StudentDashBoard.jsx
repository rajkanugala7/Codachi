import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const StudentDashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const user = location.state?.user;
  const role = location.state?.role;
  const classroomId = user?.classroom; // Assuming classroom ID is available in user data

  // Handlers for navigation
  const handleProgrammingLabsClick = () => {
    navigate(`/labs`, { state: { classroomId } }); // Pass classroomId to /labs
  };

  const handleCoursesClick = () => {
    // Add navigation if needed
    console.log('Courses Clicked');
  };

  const handlePracticeClick = () => {
    // Add navigation if needed
    console.log('Practice Clicked');
  };

  return (
    <div>
      <div className='navbar bg-body-tertiary'>
            <h1>CODACHI</h1>
      </div>
      <h2>Welcome, {user?.name}!</h2>

      <div className="cards-container">
        <div className="card">
          <h3>Programming Labs</h3>
          <p>Access labs and experiments in your classroom.</p>
          <button onClick={handleProgrammingLabsClick}>Go to Labs</button>
        </div>

        <div className="card">
          <h3>Courses</h3>
          <p>Explore various courses and materials for your studies.</p>
          <button onClick={handleCoursesClick}>Go to Courses</button>
        </div>

        <div className="card">
          <h3>Practice</h3>
          <p>Practice problems to strengthen your understanding.</p>
          <button onClick={handlePracticeClick}>Start Practice</button>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
