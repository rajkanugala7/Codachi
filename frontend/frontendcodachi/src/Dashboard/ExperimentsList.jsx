import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Box, Text, Button, Flex, Spinner, Alert, AlertIcon, Img } from "@chakra-ui/react";
import axios from "axios";

export default function ExperimentList() {
  const location = useLocation();
  const navigate = useNavigate();

  const {
    labId,
    role,
    studentId,
    classroomId,
    className,
    studentCount,
    students,
  } = location.state || {};

  const [experiments, setExperiments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  console.log(role);

  useEffect(() => {
    const fetchExperiments = async () => {
      try {
        const response = await axios.get(`https://codachi-1.onrender.com/api/experiments/${labId}`);
        setExperiments(response.data);
      } catch (err) {
        console.error("Error fetching experiments:", err);
        setError("Failed to load experiments.");
      } finally {
        setLoading(false);
      }
    };

    if (labId) fetchExperiments();
  }, [labId]);

  const handleAddExperiment = () => navigate("/addExperiment", { state: { labId } });

  const handleEdit = (exp) => navigate("/editExperiment", { state: { experiment: exp, labId } });

  const handleDelete = async (expId) => {
    if (window.confirm("Are you sure you want to delete this experiment?")) {
      try {
        await axios.delete(`https://codachi-1.onrender.com/api/experiments/${expId}`);
        setExperiments((prev) => prev.filter((exp) => exp._id !== expId));
        alert("Experiment deleted successfully!");
      } catch (err) {
        console.error("Error deleting experiment:", err);
        alert("Failed to delete experiment. Please try again.");
      }
    }
  };

  const handleDetails = (exp) => {
    navigate("/completion-details", {
      state: { exp, studentCount, classroomId, className, students },
    });
  };

  const handleClick = (e, exp) => {
    e.preventDefault();
    navigate("/compiler", { state: { experiment: exp, classroomId, studentId } });
  };
  const handleExam = (e) => {
    navigate("/newtest",{state:{experiments:experiments, classroomId:classroomId }})
  }

  const isCompleted = (exp) =>
    classroomId in exp.classroomProgress &&
    exp.classroomProgress[classroomId]?.some((progress) => progress.studentId === studentId);

  return (
    <Box className="experimentsPage">
      <Text
        fontSize="2xl"
        fontWeight="500"
        mb={4}
        backgroundColor="#9F9FFF"
        height="10vh"
        width="97vw"
        margin="1.2vw"
        padding="1rem"
        borderRadius="1rem"
      >
        Experiments
      </Text>

      {role === "Teacher" && (
        <div className="btnexam">
        <Button
          colorScheme="blue"
          onClick={handleAddExperiment}
          mb={4}
          padding="1rem"
          fontSize="1rem"
        >
          Add a New Experiment
          </Button>
        <Button onClick={handleExam} className="">Create an Exam</Button>
        </div>
      )}

      {loading ? (
        <Spinner size="xl" />
      ) : error ? (
        <Alert status="error">
          <AlertIcon />
          {error}
        </Alert>
      ) : (
        <>
          {experiments.length > 0 ? (
            experiments.map((exp, index) => (
              <Box
                key={exp._id}
                cursor="pointer"
                p={4}
                height="auto"
                color="#D3D3F2"
                borderRadius="1rem"
                boxShadow="lg"
                mb={4}
                width="90%"
                mx="auto"
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                _hover={{ backgroundColor: "#2F3339", boxShadow: "xl" }}
                onClick={(e) => handleClick(e, exp)}
              >
                <Flex align="center" gap={4}>
                  <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    borderRadius="full"
                    width="3rem"
                    height="3rem"
                    backgroundColor="#2F3339"
                    color="white"
                    fontWeight="700"
                    fontSize="lg"
                  >
                    {index + 1}
                  </Box>
                  <Text fontSize="lg" fontWeight="bold" marginTop="1rem" p={4}>
                    {exp.name}
                  </Text>
                </Flex>

                {role === "student" && (
                  <Text color={isCompleted(exp) ? "green" : "red"} fontWeight="bold">
                    {isCompleted(exp) ? <><img src="./tester.png" alt="" width={"60vw"} /></> : <><img src="https://cdn-icons-png.freepik.com/256/10712/10712091.png?uid=R168975488&ga=GA1.1.1638776978.1715106991&semt=ais_hybrid" alt="" width={"60vw"} /></>}
                  </Text>
                )}

                {role === "Teacher" && (
                  <Flex gap={2} align="center">
                    <Button
                      colorScheme="yellow"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEdit(exp);
                      }}
                    >
                      Edit
                    </Button>
                    <Button
                      colorScheme="red"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(exp._id);
                      }}
                    >
                      Delete
                    </Button>
                    <Button
                      colorScheme="purple"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDetails(exp);
                      }}
                    >
                      Completion Details
                    </Button>
                  </Flex>
                )}
              </Box>
            ))
          ) : (
            <Text>No experiments available.</Text>
          )}
        </>
      )}
    </Box>
  );
}
