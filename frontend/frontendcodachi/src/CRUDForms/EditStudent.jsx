import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button, CircularProgress } from "@chakra-ui/react"; // Chakra UI Button and CircularProgress
import axios from "axios";

export default function EditStudent() {
    const location = useLocation();
    const navigate = useNavigate();

    const { row, className, randomImage, teacherId } = location.state;
    const studentId = row?._id; // Ensure safe access
    const classroomId = row?.classroom;

    // State variables
    const [student, setStudent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [loadingUpdate, setLoadingUpdate] = useState(false); // Loading state for updating
    const [error, setError] = useState(null);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");

    // Fetch student details
    useEffect(() => {
        const fetchStudent = async () => {
            if (!studentId) return; // Exit if studentId is undefined
            try {
                const response = await axios.get(`https://codachi-1.onrender.com/api/students/student/${studentId}`);
                const fetchedStudent = response.data;
                setStudent(fetchedStudent);
                setName(fetchedStudent.name || ""); // Fallback to empty string
                setEmail(fetchedStudent.email || ""); // Fallback to empty string
            } catch (err) {
                console.error("Error fetching student:", err);
                setError(err.response?.data?.message || "Failed to fetch student details");
            } finally {
                setLoading(false);
            }
        };

        fetchStudent();
    }, [studentId]);

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoadingUpdate(true); // Start loading for update
        try {
            await axios.put(`https://codachi-1.onrender.com/api/students/${studentId}`, { name, email });

            const response = await axios.get(`https://codachi-1.onrender.com/api/students/${classroomId}`);
            const updatedStudents = response.data;

            navigate("/students", { state: { classroomId, className, randomImage, teacherId, students: updatedStudents } });
        } catch (err) {
            console.error("Error updating student:", err);
            setError(err.response?.data?.message || "Failed to update student");
        } finally {
            setLoadingUpdate(false); // Stop loading for update
        }
    };

    // Render loading state
    if (loading) {
        return <div>Loading student details...</div>;
    }

    // Render error state
    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div>
            <p style={{textAlign:"center",position:"absolute",top:"16vh",left:"46vw"}}>Update Student details</p>

            <div className="editpage">
          <form onSubmit={handleSubmit}>
                <label>
                    Name:
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        disabled={loadingUpdate} // Disable input during update
                    />
                </label>
                <br />
                <label>
                    Email:
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        disabled={loadingUpdate} // Disable input during update
                    />
                </label>
                <br />
                <Button
                    type="submit"
                    variant="outline"
                    colorScheme="green"
                    isLoading={loadingUpdate} // Display loading spinner
                    loadingText="Updating..." // Text to show when loading
                    mt={2}
                    disabled={loadingUpdate} // Disable button during update
                    width={"8rem"}
                >
                    Update Student
                </Button>
                </form>
                <img src="https://cdn.vectorstock.com/i/2000v/96/64/idea-bulb-woman-work-solution-vector-44569664.avif" alt="" />
           
                </div>
        </div>
    );
}
