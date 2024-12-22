import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/navbar/Navbar';
import { AiOutlinePlus } from 'react-icons/ai';

// Array of image links
const imageLinks = [
  'https://img.freepik.com/free-vector/group-people-business-training_23-2148934440.jpg',
  'https://img.freepik.com/free-vector/abstract-plagiarism-concept-with-thief_52683-48588.jpg',
  'https://img.freepik.com/premium-vector/team-male-coworkers-discuss-graph-company-bankruptcy-vector-flat-illustration-man-boss-shouting-phone-motivated-employees-isolated-white-profit-drop-financial-crisis-collapse_198278-11260.jpg',
  'https://img.freepik.com/free-vector/business-people-illustration-collection_23-2148459258.jpg',
  'https://img.freepik.com/free-vector/flat-working-day-scene-with-different-business-people_23-2148946792.jpg',
  'https://img.freepik.com/free-vector/children-presenting-cyborg-robotics-class_74855-5457.jpg',
  'https://img.freepik.com/free-vector/young-operators-working-call-center-isolated-flat-vector-illustration-cartoon-administrator-holding-clipboard-checking-work-office_74855-8732.jpg',
  'https://img.freepik.com/free-vector/group-therapy-support-concept_74855-6487.jpg',
  'https://img.freepik.com/free-vector/customer-support-representatives-working-call-center_74855-6340.jpg',
  'https://img.freepik.com/free-vector/young-people-standing-near-cashier-grocery-store-counter-payment-buyer-flat-vector-illustration-food-meal-products_74855-8742.jpg',
];

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
          const response = await axios.get(`https://codachi-1.onrender.com/api/teachers/${user?._id}`);
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

  const showClassroom = (classroomId,className,randomImage) => {
    navigate('/classroom', { state: { classroomId, teacherId: user?._id ,user,role,className,randomImage} });
  };

  const handleClassroom = () => {
    navigate('/createnewclass', { state: { user, role } });
  };

  const handleEditClassroom = (classroomId) => {
    navigate('/editclassroom', { state: { classroomId, teacherId: user?._id, user, role } });
  };

  const handleDeleteClassroom = async (classroomId) => {
    if (window.confirm('Are you sure you want to delete this classroom?')) {
      try {
        await axios.delete(`https://codachi-1.onrender.com/api/classrooms/${classroomId}`);
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
      

      {classrooms.length > 0 ? (
        <div>
          <ul className="cards">
            {classrooms.map((classroom) => {
              const randomImage =
                classroom.image || imageLinks[Math.floor(Math.random() * imageLinks.length)];
              return (
                <li
                key={classroom._id}
                className="card"
                style={{ width: '18rem', borderRadius: '12px', cursor: 'pointer' }}
                onClick={() => showClassroom(classroom._id,classroom.className,randomImage)} // Click anywhere on the card
              >
                <img
                  src={randomImage}
                  className="card-img-top"
                  alt={`${classroom.className || 'Classroom'} Thumbnail`}
                  style={{ maxHeight: '200px', objectFit: 'cover' }}
                />
                <div className="card-body">
                  <h5 className="card-title">
                    <span>{classroom.className}</span>
                  </h5>
                </div>
              </li>
                            );
            })}
            <li>
              <button
                onClick={handleClassroom}
                className=" plus"
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: '100px',
                  width: '100px',
                  borderRadius: '50%',
                  backgroundColor: '#28a745',
                  color: '#fff',
                  fontSize: '24px',
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                <AiOutlinePlus />

              </button>
              
            </li>
          </ul>
        </div>
      ) : (
        <p>No classrooms found.</p>
      )}
    </div>
  );
};

export default Dashboard;
