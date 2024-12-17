import React, { useEffect, useRef, useState } from "react";

export default function ExamPage() {
    const [timeLeft, setTimeLeft] = useState(3600); // Exam duration in seconds (1 hour)
    const [isExamCompleted, setIsExamCompleted] = useState(false);
    const [isExamStarted, setIsExamStarted] = useState(false);
    const examContainerRef = useRef(null);
    const timerRef = useRef(null);

    useEffect(() => {
        // Add event listeners
        document.addEventListener("fullscreenchange", handleFullscreenChange);
        document.addEventListener("keydown", handleKeydown);

        return () => {
            // Cleanup listeners on unmount
            clearInterval(timerRef.current);
            document.removeEventListener("fullscreenchange", handleFullscreenChange);
            document.removeEventListener("keydown", handleKeydown);
        };
    }, []);

    const handleFullscreenChange = () => {
        if (!document.fullscreenElement && isExamStarted && !isExamCompleted) {
            alert("Exiting full-screen mode is not allowed during the exam!");
            reenterFullscreen();
        }
    };

    const reenterFullscreen = () => {
        if (examContainerRef.current.requestFullscreen) {
            examContainerRef.current.requestFullscreen().catch((err) =>
                console.error("Failed to re-enter full-screen mode:", err)
            );
        }
    };

    const handleKeydown = (event) => {
        if (isExamStarted && !isExamCompleted) {
            const allowedKeys = [
                "Backspace", "Tab", "Enter", "Space", "ArrowLeft", "ArrowRight", 
                "ArrowUp", "ArrowDown", "Delete",
            ]; // Control keys
            const isAlphanumeric = /^[a-zA-Z0-9]$/.test(event.key); // Letters & numbers
            const isSymbol = /^[!@#$%^&*()_\-+=<>?/\\:;"'{}[\]~`]$/.test(event.key); // Symbols

            // Prevent ESC key behavior and exiting full-screen mode
            if (event.key === "Escape") {
                event.preventDefault(); // Block ESC key
                alert("ESC key is disabled during the exam!");
            } else if (!(isAlphanumeric || isSymbol || allowedKeys.includes(event.key))) {
                event.preventDefault();
                alert("Only alphanumeric keys and coding symbols are allowed!");
            }
        }
    };

    const startExam = () => {
        if (examContainerRef.current.requestFullscreen) {
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
        clearInterval(timerRef.current);
        if (document.exitFullscreen) {
            document.exitFullscreen().catch((err) =>
                console.error("Failed to exit full-screen mode:", err)
            );
        }
        alert("Exam completed!");
        // Handle submission logic here
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

    return (
        <div
            ref={examContainerRef}
            style={{
                padding: "20px",
                height: "100vh",
                background: "#f5f5f5",
            }}
        >
            {!isExamStarted ? (
                <button onClick={startExam}>Start Exam</button>
            ) : (
                <>
                    <h1>Coding Exam</h1>
                    <p>Time Left: {formatTime(timeLeft)}</p>
                    <textarea
                        rows="10"
                        cols="50"
                        placeholder="Write your code here..."
                    ></textarea>
                    <br />
                    <button onClick={handleSubmit}>Submit Exam</button>
                </>
            )}
        </div>
    );
}
