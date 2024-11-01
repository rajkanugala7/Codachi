import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Dashboard = () => {
  const location = useLocation();
  const user = location.state?.user;
  const role = location.state?.role;
  const navigate = useNavigate();
  const [classrooms, setClassrooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchClassrooms = async () => {
      if (user && role === 'Teacher') {
        try {
          const response = await axios.get(`http://localhost:8080/api/teachers/${user?._id}`);
          setClassrooms(response.data.classrooms || []);
        } catch (err) {
          console.error('Error fetching classrooms:', err);
          setError(err.response?.data?.message || 'Failed to fetch classrooms');
        } finally {
          setLoading(false);
        }
      }
    };

    fetchClassrooms();
  }, [user, role]);

  const showClassroom = (classroomId) => {
    navigate('/classroom', { state: { classroomId, teacherId: user?._id } });
  };

  const handleClassroom = () => {
    navigate('/createnewclass', { state: { user, role } });
  };

  const handleEditClassroom = (classroomId) => {
    navigate('/editclassroom', { state: { classroomId, teacherId: user?._id, user ,role} });
  };

  const handleDeleteClassroom = async (classroomId) => {
    if (window.confirm('Are you sure you want to delete this classroom?')) {
      try {
        await axios.delete(`http://localhost:8080/api/classrooms/${classroomId}`);
        setClassrooms((prevClassrooms) =>
          prevClassrooms.filter((classroom) => classroom._id !== classroomId)
        );
        alert('Classroom deleted successfully!');
      } catch (error) {
        console.error('Error deleting classroom:', error);
        alert('Failed to delete classroom. Please try again.');
      }
    }
  };

  if (loading) return <div>Loading classrooms...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h2>Welcome, {user?.name}!</h2>
      <p>Role: {role}</p>
      <p>ID: {user?._id}</p>

      <h3>Your Classrooms:</h3>
      {classrooms.length > 0 ? (
        <div>
          <ul>
            {classrooms.map((classroom) => (
              <li key={classroom._id}>
                <span onClick={() => showClassroom(classroom._id)}>
                  {classroom.className}
                </span>
                <button onClick={() => handleEditClassroom(classroom._id)} style={{ marginLeft: '10px' }}>
                  Edit
                </button>
                <button onClick={() => handleDeleteClassroom(classroom._id)} style={{ marginLeft: '10px' }}>
                  Delete
                </button>
              </li>
            ))}
          </ul>
          <button onClick={handleClassroom}>Create new Classroom</button>
        </div>
      ) : (
        <p>No classrooms found.</p>
      )}
    </div>
  );
};

export default Dashboard;
