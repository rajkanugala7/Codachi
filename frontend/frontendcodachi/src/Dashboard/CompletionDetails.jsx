import React, { useState, useEffect } from "react";
import { Doughnut } from "react-chartjs-2";
import { useLocation } from "react-router-dom";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import axios from "axios";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function CompletionDetails() {
  const location = useLocation();
  const experimentId = location?.state?.exp?._id || ""; // Fetch `exp._id` from state
  const classroomId = location?.state?.classroomId;
  const className = location?.state?.className;
  const students = location?.state?.students || [];

  const [experiment, setExperiment] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    // Fetch experiment details from backend using `experimentId`
    if (experimentId) {
      axios
        .get(`https://codachi-1.onrender.com/api/experiments/exp/${experimentId}`) // Update this to your API endpoint
        .then((response) => {
          setExperiment(response.data);
          setLoading(false);
        })
        .catch((err) => {
          console.error(err);
          setError("Failed to fetch experiment details.");
          setLoading(false);
        });
    } else {
      setLoading(false);
      setError("Experiment ID is missing.");
    }
  }, [experimentId]);

  if (loading) return <div>Loading...</div>;
  if (error || !experiment || !classroomId || students.length === 0) {
    return <div>{error || "No experiment or classroom data available"}</div>;
  }

  // Filter progress for the classroom
  const progress = experiment.classroomProgress[classroomId] || [];

  // Filter completed and not completed students
  const completedStudentIds = new Set(progress.map((entry) => entry.studentId));
  const completedStudents = students.filter((student) =>
    completedStudentIds.has(student._id)
  );
  const notCompletedStudents = students.filter(
    (student) => !completedStudentIds.has(student._id)
  );

  // Data for the doughnut chart
  const data = {
    labels: ["Completed", "Not Completed"],
    datasets: [
      {
        label: "# of Students",
        data: [completedStudents.length, notCompletedStudents.length],
        backgroundColor: ["#0FEE8A", "#F54F47"], // Green and red
        borderColor: ["#4caf50", "#f44336"],
        borderWidth: 1,
      },
    ],
  };

  // Chart options
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "bottom",
      },
      tooltip: {
        callbacks: {
          label: function (tooltipItem) {
            return `${tooltipItem.label}: ${tooltipItem.raw} students`;
          },
        },
      },
    },
    onClick: (_, elements) => {
      if (elements.length > 0) {
        const clickedIndex = elements[0].index; // Determine the slice clicked
        setSelectedCategory(clickedIndex === 0 ? "Completed" : "Not Completed");
      }
    },
  };

  return (
    <div style={{ display: "flex", justifyContent: "space-evenly", backgroundColor:"#F0F0F7" , height:"100vh"}}>
      <div style={{ maxWidth: "40vw", textAlign: "center" }}>
        <h3> Experiment: {experiment.name}</h3>
        <p>
          <strong>Classroom:</strong> {className}
        </p>
        <p>Experiment Completion Details</p>
        <Doughnut data={data} options={options} />
      </div>
      <div style={{ maxWidth: "55vw" }}>
        {selectedCategory && (
          <>
            <h2>{selectedCategory} Students</h2>
            <ul>
              {(selectedCategory === "Completed"
                ? completedStudents
                : notCompletedStudents
              ).map((student) => (
                <li key={student._id}>
                  <strong>{student.name}</strong> - {student.email}
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </div>
  );
}
