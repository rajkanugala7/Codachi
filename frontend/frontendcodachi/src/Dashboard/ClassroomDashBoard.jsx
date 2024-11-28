import axios from "axios";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../components/navbar/Navbar";

export default function ClassroomDashBoard() {
    const location = useLocation();
    const navigate = useNavigate();

    // Fallback values for className and randomImage
    const {
        classroomId,
        teacherId,
        user,
        role,
        className: initialClassName = "Classroom Name",
        randomImage: initialRandomImage = "default_image_url.jpg",
    } = location?.state || {};

    const [className, setClassName] = useState(initialClassName);
    const [randomImage, setRandomImage] = useState(initialRandomImage);
    const [labs, setLabs] = useState([]);
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [view, setView] = useState("main"); // "main", "labs", or "students"

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                const [labsResponse, studentsResponse, classDetailsResponse] = await Promise.all([
                    axios.get(`https://codachi-1.onrender.com/api/labs/${classroomId}/${teacherId}`),
                    axios.get(`https://codachi-1.onrender.com/api/students/${classroomId}`),
                    axios.get(`https://codachi-1.onrender.com/api/classrooms/${classroomId}`), // For class details
                ]);

                setLabs(labsResponse.data || []);
                setStudents(studentsResponse.data || []);

                // Update className and randomImage from API if missing
                const classDetails = classDetailsResponse.data;
                setClassName(classDetails?.name || initialClassName);
                setRandomImage(classDetails?.image || initialRandomImage);
            } catch (err) {
                setError(err.response?.data?.message || "Failed to fetch classroom details.");
            } finally {
                setLoading(false);
            }
        };

        if (classroomId && teacherId) fetchDetails();
    }, [classroomId, teacherId, initialClassName, initialRandomImage]);

    const handleLabClick = (labId) => {
        navigate("/experiments", { state: { labId, role: "Teacher" } });
    };

    

    const handleCreateLab = () => {
        navigate("/createlab", {
            state: { classroomId, teacherId, className, randomImage,teacherId },
        });
    };
    
    const handleAddStudent = () => {
        navigate("/createstudent", {
            state: { classroomId, className, randomImage },
        });
    };




    const handleEditStudent = (studentId) => {
        navigate(`/editstudent/${studentId}`, { state: { classroomId ,className,randomImage} });
    };

    const handleDeleteStudent = async (studentId) => {
        try {
            await axios.delete(`https://codachi-1.onrender.com/api/students/${studentId}`);
            setStudents((prev) => prev.filter((student) => student._id !== studentId));
        } catch (err) {
            alert("Failed to delete student: " + (err.response?.data?.message || "Unknown error"));
        }
    };

    const renderMainCards = () => (
        <div className="cards-container">
            <div className="card" onClick={() => setView("labs")}>
                <div className="card-img-top">
                    <img src="https://img.freepik.com/free-vector/programming-concept-illustration_114360-27522.jpg" alt="" />
                </div>
                <div className="card-body">
                <h2>Labs</h2>
                    <p>{labs.length} Labs</p>
                    </div>
            </div>
            <div className="card" onClick={() => setView("students")}>
                <div className="card-img-top">
                    <img src="https://png.pngtree.com/png-clipart/20230928/original/pngtree-kids-coding-class-png-image_13006519.png" alt="" />
                </div>
                <div className="card-body">
                <h2>Students</h2>
                    <p>{students.length} Students</p>
                    </div>
            </div>
        </div>
    );

    const renderLabs = () => (
        <div>
            <button onClick={() => setView("main")}>Back</button>
            <h2>Labs</h2>
            {labs.length > 0 ? (
                <div className="labs-container">
                    {labs.map((lab) => (
                        <div key={lab._id} className="lab-card">
                            <h3
                                onClick={() => handleLabClick(lab._id)}
                                style={{ cursor: "pointer", color: "blue" }}
                            >
                                {lab.title || lab.labName || "Unnamed Lab"}
                            </h3>
                        </div>
                    ))}
                </div>
            ) : (
                <p>No labs found.</p>
            )}
            <button onClick={handleCreateLab}>Create New Lab</button>
        </div>
    );

    const renderStudents = () => (
        <div>
            <button onClick={() => setView("main")}>Back</button>
            <h2>Students</h2>
            {students.length > 0 ? (
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

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div>
            <Navbar />
            <div className="dashboard-container">
                <div className="classNameDiv">
                    <h1>{className}</h1>
                    <img src={randomImage} alt="Classroom" className="classroomImage" />
                </div>
                {view === "main" && renderMainCards()}
                {view === "labs" && renderLabs()}
                {view === "students" && renderStudents()}
            </div>
        </div>
    );
}
