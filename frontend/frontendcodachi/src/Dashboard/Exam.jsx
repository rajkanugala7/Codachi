import { useEffect, useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import ExamCompilerPage from "../components/ExamCompilerPage";

export default function Exam() {
    const location = useLocation();
    const { set, test, classroomId, studentId, setId } = location?.state || {};
    const [experiments, setExperiments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [timeLeft, setTimeLeft] = useState(3600); // 1 hour
    const [isExamCompleted, setIsExamCompleted] = useState(false);
    const [isExamStarted, setIsExamStarted] = useState(false);
    const [tabSwitchCount, setTabSwitchCount] = useState(0);
    const [selectedExperiment, setSelectedExperiment] = useState(null);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [completedExperiments, setCompletedExperiments] = useState(new Set()); // Track completed experiments

    const examContainerRef = useRef(null);
    const timerRef = useRef(null);

    // Timer effect
    useEffect(() => {
        if (isExamStarted && !timerRef.current) {
            timerRef.current = setInterval(() => {
                setTimeLeft((prev) => {
                    if (prev <= 1) {
                        clearInterval(timerRef.current);
                        timerRef.current = null;
                        endExam();
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }

        return () => {
            clearInterval(timerRef.current);
        };
    }, [isExamStarted]);

    // Fullscreen and visibility change listeners
    useEffect(() => {
        const handleFullscreenChange = () => {
            setIsFullscreen(!!document.fullscreenElement);
            if (!document.fullscreenElement && isExamStarted && !isExamCompleted) {
                setTabSwitchCount((prev) => prev + 1);
                alert(
                    `You exited fullscreen mode. Tab switch count: ${tabSwitchCount + 1}. Please remain in fullscreen during the exam.`
                );
            }
        };

        const handleVisibilityChange = () => {
            if (document.visibilityState === "hidden" && isExamStarted && !isExamCompleted) {
                setTabSwitchCount((prev) => prev + 1);
                alert(`You switched tabs ${tabSwitchCount + 1} time(s). Please stay on the exam page.`);
            }
        };

        const handleKeydown = (event) => {
            if (isExamStarted && !isExamCompleted && event.key === "Escape") {
                event.preventDefault();
                setTabSwitchCount((prev) => prev + 1);
                alert("Pressing Escape is not allowed during the exam.");
            }
        };

        document.addEventListener("fullscreenchange", handleFullscreenChange);
        document.addEventListener("visibilitychange", handleVisibilityChange);
        document.addEventListener("keydown", handleKeydown);

        return () => {
            document.removeEventListener("fullscreenchange", handleFullscreenChange);
            document.removeEventListener("visibilitychange", handleVisibilityChange);
            document.removeEventListener("keydown", handleKeydown);
        };
    }, [isExamStarted, isExamCompleted, tabSwitchCount]);

    // Fetch experiments on mount
    useEffect(() => {
        const fetchExperiments = async () => {
            if (!set || !Array.isArray(set)) {
                setError("Invalid experiment set provided.");
                setLoading(false);
                return;
            }

            try {
                const responses = await Promise.all(
                    set.map((id) => axios.get(`http://localhost:8080/api/experiments/exp/${id}`))
                );
                const fetchedExperiments = responses.map((res) => res.data);
                setExperiments(fetchedExperiments);
                setSelectedExperiment(fetchedExperiments[0] || null);
            } catch (error) {
                console.error("Error fetching experiments:", error);
                setError("Failed to load experiments.");
            } finally {
                setLoading(false);
            }
        };

        if (set) fetchExperiments();
    }, [set]);

    const startExam = async () => {
        if (examContainerRef.current?.requestFullscreen) {
            examContainerRef.current.requestFullscreen().catch((err) => {
                console.error("Fullscreen request failed:", err);
                alert("Failed to enter fullscreen mode. Please try again.");
            });
        }
    
        try {
            // Fetch the current student data to get the existing completedTestIds
            const { data: student } = await axios.get(`http://localhost:8080/api/students/student/${studentId}`);
            const updatedCompletedTestIds = new Set(student.completedTestIds); // Use a Set to avoid duplicates
            updatedCompletedTestIds.add(test._id);
    
            // Update the student's completedTestIds in the backend
            await axios.put(`http://localhost:8080/api/students/${studentId}`, {
                completedTestIds: Array.from(updatedCompletedTestIds), // Convert the Set back to an array
            });
    
            console.log("Test ID added to student's completedTestIds.");
        } catch (error) {
            console.error("Error updating student's completedTestIds:", error);
            alert("Failed to update student's exam status. Please try again.");
            return;
        }
    
        setIsExamStarted(true);
    };
    
  
    const handleGoFullscreenButton = () => {
        if (examContainerRef.current?.requestFullscreen) {
            examContainerRef.current.requestFullscreen().catch((err) => {
                console.error("Failed to enter fullscreen:", err);
                alert("Unable to enter fullscreen. Please try again.");
            });
        } else {
            alert("Fullscreen mode is not supported on this browser.");
        }
    };

    const endExam = () => {
        setIsExamCompleted(true);
        clearInterval(timerRef.current);
        document.exitFullscreen?.().catch((err) => console.error("Failed to exit fullscreen:", err));
    };

    const handleSubmit = () => {
        if (window.confirm("Are you sure you want to submit the exam?")) {
            endExam();
            alert("Exam submitted successfully.");
        }
    };
    console.log(test)
    const formatTime = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = time % 60;
        return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
    };

    const handleExperimentClick = (index) => {
        setSelectedExperiment(experiments[index]);
    };

    const markExperimentAsCompleted = (experimentId) => {
        setCompletedExperiments((prev) => new Set(prev).add(experimentId));
    };

    if (loading) return <p>Loading experiments...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div ref={examContainerRef} style={{ padding: "20px", height: "100vh", background: "#f5f5f5" }}>
            {!isExamStarted ? (
                isExamCompleted ? (
                    <div>
                        <h2>Exam completed. Thank you!</h2>
                    </div>
                ) : (
                        <div style={{border:"1px solid black", width:"25vw", padding:"2rem" , justifyItems:"center", borderRadius:"1rem" ,position:"relative", left:"35vw", top:"30vh"} }>   
                            <strong>{test.testName}</strong>
                            <p>Time limit : { test.timeLimit}</p>
                            
                            
                    <button onClick={startExam} style={{backgroundColor:"teal", padding:"1rem" , borderRadius:"1rem" ,color:"white" , width:"20vw"}}>Start Exam</button>
                     </div>
                            )
            ) : (
                <div>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <p>{test?.testName || "Exam"}</p>
                        <p>Time Left: {formatTime(timeLeft)}</p>
                        <p>Tab Switch Count: {tabSwitchCount}</p>
                        {!isFullscreen && (
                            <button style={{ background: "#007bff", color: "#fff",padding:"1rem" , borderRadius:"1rem"}} onClick={handleGoFullscreenButton}>
                                Go Fullscreen
                            </button>
                        )}
                        <button onClick={handleSubmit} style={{ background: "#28a745", color: "#fff" ,padding:"1rem", borderRadius:"1rem"}}>
                            Submit Exam
                        </button>
                    </div>
                    <div style={{ marginBottom: "20px" }}>
                        {experiments.length > 0 ? (
                            experiments.map((experiment, index) => (
                                <button
                                    key={index}
                                    onClick={() => handleExperimentClick(index)}
                                    style={{
                                        margin: "0 10px",
                                        width: "40px",
                                        height: "40px",
                                        borderRadius: "50%",
                                        border: selectedExperiment === experiment ? "2px solid #007bff" : "2px solid #000",
                                        background: completedExperiments.has(experiment._id)
                                            ? "green"
                                            : selectedExperiment === experiment
                                            ? "#007bff"
                                            : "#fff",
                                        color: completedExperiments.has(experiment._id) || selectedExperiment === experiment ? "#fff" : "#000",
                                    }}
                                >
                                    {index + 1}
                                </button>
                            ))
                        ) : (
                            <p>No experiments found.</p>
                        )}
                    </div>

                    {selectedExperiment && (
                        <ExamCompilerPage
                            experiment={selectedExperiment}
                            classroomId={classroomId}
                            studentId={studentId}
                            setId={setId}
                            testId={test._id}
                            onComplete={() => markExperimentAsCompleted(selectedExperiment._id)}
                        />
                    )}
                </div>
            )}
        </div>
    );
}
