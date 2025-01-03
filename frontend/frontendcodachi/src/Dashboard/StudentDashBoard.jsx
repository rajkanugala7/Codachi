import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Footer from '../components/footer/Footer';

const StudentDashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const user = location.state?.user;
  const role = location.state?.role;
  const classroomId = user?.classroom; // Assuming classroom ID is available in user data

  // Handlers for navigation
  const handleProgrammingLabsClick = () => {
    navigate(`/labs`, { state: { classroomId:classroomId, studentId:user._id , role:role} }); // Pass classroomId to /labs
  };

  const handleCoursesClick = () => {
    // Add navigation if needed
    console.log('Courses Clicked');
  };

  const handleTestsClick = () => {
    // Add navigation if needed
    
   navigate('/tests', {state:{classroomId:classroomId,role:"Student",studentId:user._id}})
  };

  return (
    <div>
      
     
      <p style={{ fontSize: "1.8rem", backgroundColor: "#575799", height: "13vh", borderRadius: "1rem", padding: "1rem", fontWeight: "600", color: "white", margin:"1rem", alignItems:"center"}}>Welcome , {user?.name }  </p>


      <div className="homecards-container">
        <div className="card" onClick={handleProgrammingLabsClick}>
          <img src="./script.png" alt="" className='card-img-top' />
          <p>Access labs and experiments in your classroom.</p>
          <div className="card-body">
            Programming Labs
            </div>
        </div>

        <div className="card" onClick={handleCoursesClick}>
        <img src="./online-education.png" alt="" className='card-img-top' />
          <p>Explore various courses and <br />
            materials for your studies.</p>
          <div  className='card-body'>Courses</div>
        </div>

        <div className="card" onClick={handleTestsClick}>
        <img src="./target.png" alt="" className='card-img-top' />
          <p>Attempt your test</p>
          <div  className='card-body'>Tests</div>
        </div>
        <div className="card" >
        <img src="./promotion.png" alt="" className="card-img-top"  />
          <p>Contact us for any queries</p>
          <div  className='card-body'>Contact us</div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
