import React, { useState, useEffect } from "react";
import { Doughnut } from "react-chartjs-2";
import { useLocation } from "react-router-dom";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import axios from "axios";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function TestDetails() {
  const location = useLocation();
  const currTest = location?.state?.test; // Fetch `test` from state
  const classroomId = location?.state?.classroomId;

  const [test, setTest] = useState(null);
  const [students, setStudents] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (currTest && classroomId) {
      setLoading(true);
        // Fetch test details
        console.log(currTest)
      axios
        .get(`http://localhost:8080/api/exam/test/${currTest._id}`)
        .then((response) => {
          setTest(response.data);
        })
        .catch((err) => {
          console.error(err);
          setError("Failed to fetch test details.");
          setLoading(false);
        });

      // Fetch students
      axios
        .get(`https://codachi-1.onrender.com/api/students/${classroomId}`)
        .then((response) => {
            setStudents(response.data);
            setLoading(false)
        })
        .catch((err) => {
          console.error(err);
          setError("Failed to fetch student details.");
        });
    } else {
      setLoading(false);
      setError("Test or classroom ID is missing.");
    }
  }, [currTest, classroomId]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  if (!test || students.length === 0) {
    return <div>No data available for this test or classroom.</div>;
  }

  // Filter test submissions
  const progress = test.testSubmissions || [];

  // Separate completed and not completed students
  const completedStudentIds = new Set(progress.map((entry) => entry.studentId));
  const completedStudents = students.filter((student) =>
    completedStudentIds.has(student._id)
  );
  const notCompletedStudents = students.filter(
    (student) => !completedStudentIds.has(student._id)
  );

  // Data for the doughnut chart
  const data = {
    labels: ["Completed", "Not yet Completed"],
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
        const clickedIndex = elements[0].index;
        setSelectedCategory(clickedIndex === 0 ? "Completed" : "Not Completed");
      }
    },
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-evenly",
        backgroundColor: "#F0F0F7",
              height: "100vh",
        padding:"1rem"
      }}
    >
      <div style={{ maxWidth: "40vw", textAlign: "center" }}>
        <h3>{test.testName}</h3>
        <p>Test Completion Details</p>
        <Doughnut data={data} options={options} />
      </div>
      <div style={{ maxWidth: "55vw" }}>
        {selectedCategory && (
          <>
            <h4>{selectedCategory} Students</h4>
            <ul className="listDiv">
              {(selectedCategory === "Completed"
                ? completedStudents
                : notCompletedStudents
              ).map((student) => (
                <li key={student._id } className="listitem">
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
