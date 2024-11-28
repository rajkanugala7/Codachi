import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function EditClassroomForm() {
  const location = useLocation();
  const user = location?.state?.user;
  const role = location?.state?.role;
  const classroomId = location?.state?.classroomId;
  const navigate = useNavigate();

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
      navigate('/teacher', { state: { user, role } }); // Redirect after update
    } catch (err) {
      console.error('Error updating classroom:', err);
      alert('Failed to update classroom. Please try again.');
    }
  };

  if (loading) return <div>Loading classroom data...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>Edit your classroom</h1>
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
        <button type="submit">Update Classroom</button>
      </form>
    </div>
  );
}
