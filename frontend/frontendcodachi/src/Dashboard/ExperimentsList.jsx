import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Box, Text, Button, Flex, Spinner, Alert, AlertIcon } from "@chakra-ui/react";
import axios from "axios";

export default function ExperimentList() {
  const location = useLocation();
  const navigate = useNavigate();
  const labId = location.state?.labId;
  const role = location.state?.role; // Retrieve the role from location.state
  const studentId = location.state?.studentId;
  const classroomId = location?.state?.classroomId;
  const className = location.state?.className;
  const [experiments, setExperiments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const studentCount = location.state.studentCount;
  const students = location.state.students;
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

    if (labId) {
      fetchExperiments();
    }
  }, [labId]);

  const handleAddExperiment = () => {
    navigate('/addExperiment', { state: { labId } });
  };

  const handleEdit = (exp) => {
    navigate('/editExperiment', { state: { experiment: exp, labId } });
  };

  const handleDelete = async (expId) => {
    if (window.confirm("Are you sure you want to delete this experiment?")) {
      try {
        await axios.delete(`https://codachi-1.onrender.com/api/experiments/${expId}`);
        setExperiments(prev => prev.filter(exp => exp._id !== expId));
        alert("Experiment deleted successfully!");
      } catch (err) {
        console.error("Error deleting experiment:", err);
        alert("Failed to delete experiment. Please try again.");
      }
    }
  };
  const handleDetails = (exp)=>{
    navigate('/completion-details', {state:{exp:exp,studentCount:studentCount,classroomId:classroomId , className:className,students:students}})
  }

  const handleClick = (e, exp) => {
    e.preventDefault();
    console.log("expid : ", exp._id);
    navigate(`/compiler`, { state: { experiment: exp, classroomId: classroomId, studentId:studentId } });
  };

  return (
    <Box>
      <Text fontSize="2xl" mb={4}>Experiments {classroomId}---{ studentId}</Text>

      {role === "Teacher" && (
        <Button colorScheme="blue" onClick={handleAddExperiment} mb={4}>
          Add Experiment
        </Button>
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
            experiments.map((exp) => (
              <Box
                key={exp._id}
                cursor="pointer"
                p={4}
                borderWidth="3px"
                borderRadius="md"
                borderStyle="dashed"
                mb={4}
                _hover={{ backgroundColor: "gray.100" }}
              >
                <Text fontSize="lg" fontWeight="bold" onClick={(e) => handleClick(e, exp)}>
                  {exp.name}
                </Text>

                {role === "Teacher" && (
                  <Flex mt={2} gap={2}>
                    <Button colorScheme="yellow" onClick={() => handleEdit(exp)}>
                      Edit
                    </Button>
                    <Button colorScheme="red" onClick={() => handleDelete(exp._id)}>
                      Delete
                    </Button>
                    <Button colorScheme="red" onClick={()=>{handleDetails(exp)}}>Completion Details</Button>
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
