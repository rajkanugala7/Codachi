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
    const images = [
        "https://cdn.vectorstock.com/i/2000v/67/59/female-character-work-as-technical-support-vector-39826759.avif",
        "https://cdn.vectorstock.com/i/2000v/25/57/web-designer-services-concept-vector-29592557.avif",
        "https://cdn.vectorstock.com/i/2000v/55/65/programming-concept-in-modern-flat-design-for-web-vector-53765565.avif",
        "https://cdn.vectorstock.com/i/2000v/11/42/web-search-engine-concept-flat-vector-42241142.avif",
        "https://cdn.vectorstock.com/i/2000v/76/43/low-code-development-platform-vector-54257643.avif",
        "https://cdn.vectorstock.com/i/2000v/44/66/software-app-and-web-development-concept-vector-46694466.avif",
        "https://cdn.vectorstock.com/i/2000v/44/71/programmer-team-working-on-the-progect-vector-46694471.avif",
      ];
    

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
        navigate('/experiments', { state: { labId: id , role:"student",classroomId:classroomId,studentId:studentId} });
    };

    if (loading) {
        return <div>Loading...</div>; // Loading state
    }

    if (error) {
        return <div>Error: {error}</div>; // Error handling
    }

    return (
        <div className="dashboard-container">
            <p style={{fontSize:"1.8rem", backgroundColor:"#D3EC79" , height:"10vh", borderRadius:"1rem",padding:"1rem" , fontWeight:"600" , color:"white"}}>Lab Dashboard  </p>

            {/* Labs Section */}
            {labs.length > 0 ? (
                <ul className="cards">
                    {labs.map((lab,index) => (
                        <li key={lab._id} className="lab-card" onClick={() => handleLab(lab._id)}>
                             <img
                src={images[index % images.length]}
                alt={`Lab ${index + 1}`}
                className="card-img-top"
              />
                            <div  style={{ cursor: 'pointer', fontWeight:"350", fontSize:"1.8rem"}} className="card-body">
                                {lab.title || lab.labName || lab._id}
                            </div>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No labs found.</p>
            )}
        </div>
    );
}
