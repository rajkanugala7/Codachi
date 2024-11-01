import axios from "axios";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function AddStudents() {
    const location = useLocation();
    const { classroomId } = location.state || {};
    const [studentInput, setStudentInput] = useState(""); // For bulk input via textarea
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const defaultPassword = "defaultPassword123";

    // Handle textarea input change
    const handleTextareaChange = (e) => {
        setStudentInput(e.target.value);
    };

    // Submit students
    const handleCreateStudents = async () => {
        try {
            // Parse student input
            
            const students = studentInput.trim().split("\n").map((line) => {
                const [name, email] = line.split(",").map((item) => item.trim());
                return { name, email, password: defaultPassword };
            });
            console.log("Students : ",students)
            // Make sure data is valid
            if (!students.every(student => student.name && student.email)) {
                setError("Each line must contain a name and an email separated by a comma.");
                return;
            }

            // Send request to create students
            await axios.post("http://localhost:8080/api/students/bulk-create", {
                classroomId,
                students,
            });

            navigate(-1); // Go back to the ClassroomDashboard
        } catch (err) {
            console.error("Error creating students:", err);
            setError(err.response?.data?.message || "Failed to create students");
        }
    };

    return (
        <div>
            <h2>Create Students</h2>
            {error && <p style={{ color: "red" }}>Error: {error}</p>}
            <textarea
                rows="10"
                cols="50"
                placeholder="Enter each student on a new line as: Name, Email"
                value={studentInput}
                onChange={handleTextareaChange}
            ></textarea>
            <br />
            <button onClick={handleCreateStudents}>Create Students</button>
        </div>
    );
}
