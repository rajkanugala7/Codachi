import axios from "axios";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function StudentLabDashboard() {
    const location = useLocation();
    const { classroomId , studentId} = location?.state || {}; // Safe access with fallback
    const [labs, setLabs] = useState([]); // State to store labs
    const [loading, setLoading] = useState(true); // Loading state
    const [error, setError] = useState(null); // Error state
    const navigate = useNavigate();

    useEffect(() => {
        const fetchLabs = async () => {
            try {
                console.log("Fetching labs for Classroom:", classroomId); // Logging classroomId
                const labsResponse = await axios.get(`https://codachi-1.onrender.com/api/labs/${classroomId}`);
                setLabs(labsResponse.data); // Assuming labs response data is an array
            } catch (err) {
                console.error('Error fetching labs:', err);
                setError(err.response?.data?.message || 'Failed to fetch labs');
            } finally {
                setLoading(false);
            }
        };

        if (classroomId) {
            fetchLabs(); // Call the async function
        }
    }, [classroomId]); // Only classroomId as dependency

    const handleLab = (id) => {
        navigate('/experiments', { state: { labId: id , role:"Student",classroomId:classroomId,studentId:studentId} });
    };

    if (loading) {
        return <div>Loading...</div>; // Loading state
    }

    if (error) {
        return <div>Error: {error}</div>; // Error handling
    }

    return (
        <div className="dashboard-container">
            <h1>Student Lab Dashboard of class {classroomId} -- {studentId }</h1>

            {/* Labs Section */}
            <h2>Labs:</h2>
            {labs.length > 0 ? (
                <ul>
                    {labs.map((lab) => (
                        <li key={lab._id}>
                            <span onClick={() => handleLab(lab._id)} style={{ cursor: 'pointer', color: 'blue' }}>
                                {lab.title || lab.labName || lab._id}
                            </span>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No labs found.</p>
            )}
        </div>
    );
}
