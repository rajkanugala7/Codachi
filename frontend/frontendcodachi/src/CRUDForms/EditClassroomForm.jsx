import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function EditClassroomForm() {
  const location = useLocation();
  const user = location?.state?.user;
  const role = location?.state?.role;
  const classroomId = location?.state?.classroomId;
  const teacherId = location?.state?.teacherId;
  const navigate = useNavigate();
  const name = location.state?.className;
  console.log(name+"name")

  const [classroomData, setClassroomData] = useState({
    className: '',
    // Add other classroom fields as necessary
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchClassroomData = async () => {
      try {
        const response = await axios.get(`https://codachi-1.onrender.com/api/classrooms/${classroomId}`);
        setClassroomData(response.data);
      } catch (err) {
        console.error('Error fetching classroom data:', err);
        setError(err.response?.data?.message || 'Failed to fetch classroom data');
      } finally {
        setLoading(false);
      }
    };

    if (classroomId) {
      fetchClassroomData();
    }
  }, [classroomId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setClassroomData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Update the classroom with correct data format
      await axios.put(`http://localhost:8080/api/classrooms/${classroomId}`, classroomData);
      alert('Classroom updated successfully!');
      console.log('Redirecting with state:', { user, role }); // Debugging log
      console.log(classroomId, "class");
      console.log(teacherId,"teacher")
     navigate("/classroom",{state:{classroomId:classroomId,teacherId:teacherId,className:classroomData.className}})
    } catch (err) {
      console.error('Error updating classroom:', err);
      alert('Failed to update classroom. Please try again.');
    }
  };

  if (loading) return <div>Loading classroom data...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <p  style={{textAlign:"center",position:"relative",top:"10vh"}}>Edit  classroom Name</p>
      <div className="editpage">
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            Classroom Name:
            <input
              type="text"
              name="className"
              value={classroomData.className}
              onChange={handleChange}
              required
            />
          </label>
        </div>
        {/* Add more fields as necessary */}
        <button type="submit" className='btn btn-success' style={{width:"20vw"}}>Update Classroom</button>
      </form>
      <img src="./idea1.png" alt="" />
      </div>
      </div>
  );
}
