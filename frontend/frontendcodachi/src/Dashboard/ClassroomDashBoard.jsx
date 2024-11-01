import axios from "axios";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function ClassroomDashBoard() {
    const location = useLocation();
    const { classroomId, teacherId } = location?.state || {}; // Safe access with fallback
    const [labs, setLabs] = useState([]); // State to store labs
    const [students, setStudents] = useState([]); // State to store students
    const [loading, setLoading] = useState(true); // Loading state
    const [error, setError] = useState(null); // Error state
    const navigate = useNavigate();

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                console.log("Fetching labs and students for Classroom:", classroomId, "Teacher:", teacherId); // Logging IDs
                const labsResponse = await axios.get(`http://localhost:8080/api/labs/${classroomId}/${teacherId}`);
                const studentsResponse = await axios.get(`http://localhost:8080/api/students/${classroomId}`);
                
                setLabs(labsResponse.data); // Assuming labs response data is an array
                setStudents(studentsResponse.data); // Assuming students response data is an array
            } catch (err) {
                console.error('Error fetching details:', err);
                setError(err.response?.data?.message || 'Failed to fetch details');
            } finally {
                setLoading(false);
            }
        };

        if (classroomId && teacherId) {
            fetchDetails(); // Call the async function
        }
    }, [classroomId, teacherId]); // Dependency array

    const handleDeleteLab = async (labId) => {
        try {
            await axios.delete(`http://localhost:8080/api/labs/${labId}`);
            setLabs((prevLabs) => prevLabs.filter((lab) => lab._id !== labId)); // Update labs state by filtering out deleted lab
        } catch (err) {
            console.error('Error deleting lab:', err);
            setError(err.response?.data?.message || 'Failed to delete lab');
        }
    };

    const handleDeleteStudent = async (studentId) => {
        try {
            await axios.delete(`http://localhost:8080/api/students/${studentId}`);
            setStudents((prevStudents) => prevStudents.filter((student) => student._id !== studentId)); // Update students state by filtering out deleted student
        } catch (err) {
            console.error('Error deleting student:', err);
            setError(err.response?.data?.message || 'Failed to delete student');
        }
    };

    const handleEditStudent = (studentId) => {
        navigate('/editstudent', { state: { studentId, classroomId } }); // Assuming you have an edit route
    };

    const handleCreateLab = () => {
        navigate('/createlab', { state: { classroomId, teacherId } });
    };

    const handleAddStudent = () => {
        navigate('/createstudent', { state: { classroomId } });
    };

    const handleLab = async (id) => {
        try {
            navigate('/experiments', { state: { labId: id  ,role : "Teacher"} });
        } catch (error) {
            console.error('Error fetching lab details:', error);
            setError(error.response?.data?.message || 'Failed to fetch lab details');
        }
    };

    if (loading) {
        return <div>Loading...</div>; // Loading state
    }

    if (error) {
        return <div>Error: {error}</div>; // Error handling
    }

    return (
        <div className="dashboard-container">
            <h1>Classroom Dashboard</h1>

            {/* Labs Section */}
            <h2>Labs:</h2>
            {labs.length > 0 ? (
                <ul>
                    {labs.map((lab) => (
                        <li key={lab._id}>
                            <span onClick={() => handleLab(lab._id)} style={{ cursor: 'pointer', color: 'blue' }}>
                                {lab.title || lab.labName || lab._id}
                            </span>
                            &nbsp;&nbsp;&nbsp;&nbsp;
                            <button onClick={() => handleDeleteLab(lab._id)}>Delete Lab</button>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No labs found.</p>
            )}

            <p onClick={handleCreateLab} style={{ cursor: 'pointer', color: 'blue' }}>Create new Lab</p>

            {/* Students Section */}
            <h2>Students:</h2>
            {students.length > 0 ? (
                <ul>
                    {students.map((student) => (
                        <li key={student._id}>
                            {student.name || student._id}
                            &nbsp;&nbsp;
                            <button onClick={() => handleEditStudent(student._id)}>Edit</button>
                            &nbsp;&nbsp;
                            <button onClick={() => handleDeleteStudent(student._id)}>Delete</button>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No students found.</p>
            )}

            <p onClick={handleAddStudent} style={{ cursor: 'pointer', color: 'blue' }}>Add Student</p>
        </div>
    );
}
