import axios from "axios";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function EditStudent() {
    const location = useLocation();
    const navigate = useNavigate();
    const { studentId, classroomId ,className,randomImage} = location.state || {}; // Get the student ID from the state
    const [student, setStudent] = useState(null); // State to store student details
    const [loading, setLoading] = useState(true); // Loading state
    const [error, setError] = useState(null); // Error state
    const [name, setName] = useState(""); // State for the name input
    const [email, setEmail] = useState(""); // State for the email input

    useEffect(() => {
        const fetchStudent = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/api/students/student/${studentId}`);
                setStudent(response.data);
                setName(response.data.name); // Assuming student has a 'name' property
                setEmail(response.data.email); // Assuming student has an 'email' property
            } catch (err) {
                console.error('Error fetching student:', err);
                setError(err.response?.data?.message || 'Failed to fetch student details');
            } finally {
                setLoading(false);
            }
        };

        if (studentId) {
            fetchStudent(); // Fetch student details if ID is available
        }
    }, [studentId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`https://codachi-1.onrender.com/api/students/${studentId}`, { name, email }); // Update student name and email
            navigate("/classroom", { state: { classroomId, className, randomImage } });
        } catch (err) {
            console.error('Error updating student:', err);
            setError(err.response?.data?.message || 'Failed to update student');
        }
    };

    if (loading) {
        return <div>Loading...</div>; // Loading state
    }

    if (error) {
        return <div>Error: {error}</div>; // Error handling
    }

    return (
        <div>
            <h1>Edit this Student</h1>
            <form onSubmit={handleSubmit}>
                <label>
                    Name:
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)} // Update name state on input change
                        required
                    />
                </label>
                <br />
                <label>
                    Email:
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)} // Update email state on input change
                        required
                    />
                </label>
                <br />
                <button type="submit">Update Student</button>
            </form>
        </div>
    );
}
