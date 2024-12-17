import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { useState } from "react";

export default function Students() {
    const location = useLocation();
    const navigate = useNavigate();

    const { students: initialStudents, classroomId } = location?.state || {};
    const [students, setStudents] = useState(initialStudents || []);

    const handleAddStudent = () => {
        navigate("/createstudent", {
            state: { classroomId },
        });
    };

    const handleEditStudent = (studentId) => {
        navigate("/editstudent", { state: { classroomId, studentId } });
    };

    const handleDeleteStudent = async (studentId) => {
        try {
            await axios.delete(`https://codachi-1.onrender.com/api/students/${studentId}`);
            setStudents((prev) => prev.filter((student) => student._id !== studentId));
        } catch (err) {
            alert("Failed to delete student: " + (err.response?.data?.message || "Unknown error"));
        }
    };

    return (
        <div>
            <button onClick={() => navigate(-1)}>Back</button>
            <h2>Students</h2>
            {students && students.length > 0 ? (
                <table className="students-table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {students.map((student) => (
                            <tr key={student._id}>
                                <td>{student.name || "Unnamed Student"}</td>
                                <td>
                                    <button onClick={() => handleEditStudent(student._id)}>Edit</button>
                                    <button onClick={() => handleDeleteStudent(student._id)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>No students found.</p>
            )}
            <button onClick={handleAddStudent}>Add Student</button>
        </div>
    );
}
