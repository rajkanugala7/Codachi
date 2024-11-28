import axios from "axios";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function CreateLab() {
    const location = useLocation();
    const navigate = useNavigate();
    const classroomId = location?.state?.classroomId;
    const teacherId = location?.state?.teacherId;
    const className = location?.state?.className;
    const randomImage = location?.state?.randomImage;

    console.log("classroomId:", classroomId);
    console.log("teacherId:", teacherId);

    const [labName, setLabName] = useState("");

    const handleSubmit = async (event) => {
        event.preventDefault(); // Prevent default form submission
        try {
            const payload = {
                labName,
                classroomId,
                teacherId,
            };

            const response = await axios.post(`http://localhost:8080/api/labs/`, payload);
            console.log("Response:", response.data);

            // Navigate back to the Classroom Dashboard
            navigate("/classroom", { state: { classroomId, teacherId ,randomImage,className} });
        } catch (error) {
            console.error("Error submitting data:", error);
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <label htmlFor="Labname">Lab Name: </label>
                <input 
                    type="text" 
                    name="labName" 
                    id="labName" 
                    placeholder="Enter Lab Name" 
                    onChange={(e) => setLabName(e.target.value)} 
                />
                <button className="btn" type="submit">Create new Lab</button>
            </form>
        </div>
    );
}
