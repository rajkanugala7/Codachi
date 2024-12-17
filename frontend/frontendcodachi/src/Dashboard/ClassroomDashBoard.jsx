import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../components/navbar/Navbar";
import axios from "axios";

export default function ClassroomDashboard() {
    const location = useLocation();
    const navigate = useNavigate();

    const {
        classroomId,
        teacherId,
        className: initialClassName = "Classroom Name",
        randomImage: initialRandomImage = "default_image_url.jpg",
    } = location?.state || {};

    const [className, setClassName] = useState(initialClassName);
    const [randomImage, setRandomImage] = useState(initialRandomImage);
    const [labs, setLabs] = useState([]);
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                const [labsResponse, studentsResponse, classDetailsResponse] = await Promise.all([
                    axios.get(`https://codachi-1.onrender.com/api/labs/${classroomId}/${teacherId}`),
                    axios.get(`https://codachi-1.onrender.com/api/students/${classroomId}`),
                    axios.get(`https://codachi-1.onrender.com/api/classrooms/${classroomId}`),
                ]);

                setLabs(labsResponse.data || []);
                setStudents(studentsResponse.data || []);

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

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div>
            <Navbar />
            <div className="dashboard-container">
                <video autoPlay muted loop id="bg-video">
                    <source src="./bgvideo.mp4" type="video/mp4" />
                    Your browser does not support the video tag.
                </video>
                <div className="classNameDiv">
                    <h1>{className}</h1>
                </div>
                <div className="cards-container">
                    <div className="card" onClick={() => navigate("/labsDashboard", { state: { labs, classroomId, teacherId, className:className } })}>
                        <div className="card-img-top">
                            <img
                                src="https://img.freepik.com/free-vector/programming-concept-illustration_114360-27522.jpg"
                                alt="Labs"
                            />
                        </div>
                        <div className="card-body">
                            <h2>Labs</h2>
                            <p>{labs.length} Labs</p>
                        </div>
                    </div>
                    <div className="card" onClick={() => navigate("/students", { state: { students: students, classroomId } })}>
                        <div className="card-img-top">
                            <img
                                src="https://png.pngtree.com/png-clipart/20230928/original/pngtree-kids-coding-class-png-image_13006519.png"
                                alt="Students"
                            />
                        </div>
                        <div className="card-body">
                            <h2>Students</h2>
                            <p>{students.length} Students</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
