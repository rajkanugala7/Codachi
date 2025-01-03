import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import ExamCompilerPage from "../components/ExamCompilerPage";

export default function ExamPage() {
    const [timeLeft, setTimeLeft] = useState(3600); // Exam duration in seconds (1 hour)
    const [isExamCompleted, setIsExamCompleted] = useState(false);
    const [isExamStarted, setIsExamStarted] = useState(false);
    const [tabSwitchCount, setTabSwitchCount] = useState(0);
    const [experiments, setExperiments] = useState([]);
    const [selectedExperiment, setSelectedExperiment] = useState(null); // Selected experiment state
    const examContainerRef = useRef(null);
    const timerRef = useRef(null);

    useEffect(() => {
        const handleFullscreenChange = () => {
            if (!document.fullscreenElement && isExamStarted && !isExamCompleted) {
                if (window.confirm("Exiting full-screen mode is not allowed. Re-enter?")) {
                    reenterFullscreen();
                } else {
                    alert("You must remain in full-screen mode during the exam.");
                    setTabSwitchCount((prev) => prev + 1);
                }
            }
        };

        const handleVisibilityChange = () => {
            if (document.visibilityState === "hidden" && isExamStarted && !isExamCompleted) {
                setTabSwitchCount((prev) => {
                    const newCount = prev + 1;
                    alert(`You switched tabs ${newCount} time(s). Please stay on the exam page.`);
                    return newCount;
                });
            }
        };

        const handleKeydown = (event) => {
            if (isExamStarted && !isExamCompleted) {
                if (event.key === "Escape") {
                    event.preventDefault();
                    setTabSwitchCount((prev) => {
                        const newCount = prev + 1;
                        alert(`You pressed Escape ${newCount} time(s). This action is not allowed during the exam.`);
                        return newCount;
                    });
                }
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
    }, [isExamStarted, isExamCompleted]);

    const reenterFullscreen = () => {
        if (examContainerRef.current) {
            if (examContainerRef.current.requestFullscreen) {
                examContainerRef.current.requestFullscreen()
                    .catch((err) => console.error("Failed to re-enter full-screen mode:", err));
            } else {
                console.error("Fullscreen is not supported by this browser.");
            }
        }
    };

    const startExam = () => {
        if (examContainerRef.current?.requestFullscreen) {
            examContainerRef.current.requestFullscreen()
                .then(() => {
                    setIsExamStarted(true);
                    startTimer();
                })
                .catch((err) => alert("Failed to enter full-screen mode: " + err.message));
        } else {
            alert("Your browser does not support full-screen mode.");
        }
    };

    const startTimer = () => {
        timerRef.current = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(timerRef.current);
                    endExam();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    };

    const endExam = () => {
        setIsExamCompleted(true);
        clearInterval(timerRef.current); // Stop the timer
        if (document.exitFullscreen) {
            document.exitFullscreen().catch((err) =>
                console.error("Failed to exit full-screen mode:", err)
            );
        }
        alert(`Exam completed! You switched tabs or pressed Escape ${tabSwitchCount} time(s).`);
    };

    const handleSubmit = () => {
        const confirmed = window.confirm("Are you sure you want to submit the exam?");
        if (confirmed) {
            endExam();
        }
    };

    const formatTime = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = time % 60;
        return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
    };

    const handleExperimentClick = (index) => {
        setSelectedExperiment(experiments[index]);
    };

    return (
        <div
            ref={examContainerRef}
            style={{
                padding: "20px",
                height: "100vh",
                background: "#f5f5f5",
                outline: "none",
                position: "relative", // Added position to prevent resizing issues
            }}
            tabIndex="0"
        >
            {!isExamStarted ? (
                <button onClick={startExam}>Start Exam</button>
            ) : (
                <>
                    <h1>Coding Exam</h1>
                    <p>Time Left: {formatTime(timeLeft)}</p>
                    <p>Tab Switch Count: {tabSwitchCount}</p>

                    {/* Experiment Number Circles */}
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
                                        border: `2px solid ${selectedExperiment === experiment ? "#007bff" : "#000"}`,
                                        backgroundColor: selectedExperiment === experiment ? "#007bff" : "#fff",
                                        color: selectedExperiment === experiment ? "#fff" : "#000",
                                        cursor: "pointer",
                                        fontSize: "18px",
                                        fontWeight: "bold",
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center",
                                    }}
                                >
                                    {index + 1}
                                </button>
                            ))
                        ) : (
                            <p>No experiments available</p>
                        )}
                    </div>

                    {/* Display selected experiment */}
                    {selectedExperiment && (
                        <ExamCompilerPage
                            experiment={selectedExperiment}
                        />
                    )}

                    <textarea
                        rows="10"
                        cols="50"
                        placeholder="Write your code here..."
                    ></textarea>
                    <br />
                    <button onClick={handleSubmit}>Submit Exam</button>
                    <button onClick={reenterFullscreen}>Re-enter Full-Screen</button>
                </>
            )}
        </div>
    );
}
