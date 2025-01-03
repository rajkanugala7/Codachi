import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Box, Text, Button, Flex, Spinner, Alert, AlertIcon } from "@chakra-ui/react";
import axios from "axios";

export default function TestsDashBoard() {
    const location = useLocation();
    const navigate = useNavigate();
    const { classroomId, role,studentId } = location?.state || {}; // Get classroomId and role from route state

    const [testDetails, setTestDetails] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchTests = async () => {
            try {
                // Fetch classroom details to get test IDs
                const response = await axios.get(`http://localhost:8080/api/classrooms/${classroomId}`);
                const testIds = response.data.testIds;

                if (testIds.length > 0) {
                    // Fetch each test's details by testId
                    const testResponses = await Promise.all(
                        testIds.map(testId =>
                            axios.get(`http://localhost:8080/api/exam/test/${testId}`)

                            
                        )
                    );
                    console.log(testResponses)
                    setTestDetails(testResponses.map(res => res.data));
                }
            } catch (err) {
                console.error("Error fetching test details:", err);
                setError("Failed to load test details.");
            } finally {
                setLoading(false);
            }
        };

        if (classroomId) fetchTests();
    }, [classroomId]);

    const handleDetails = (test) => {
        // Navigate to test details page
        navigate("/test-details", { state: { test, classroomId } });
    };

    const handleStartExam = (test) => {
        if (test.sets && test.sets.length > 0) {
            const randomSet = test.sets[Math.floor(Math.random() * test.sets.length)];
            console.log(randomSet)
            navigate("/exam", { state: { set: randomSet.questions, test:test, classroomId:classroomId, studentId:studentId } });
        } else {
            alert("No sets available for this test.");
        }
    };
    

    return (
        <Box className="testsPage" bg="#1A202C" color="white" minHeight="100vh" p={4}>
            <Text
                fontSize="2xl"
                fontWeight="500"
                mb={4}
                backgroundColor="#2D3748"
                height="10vh"
                width="97vw"
                margin="1.2vw"
                padding="1rem"
                borderRadius="1rem"
                color="white"
            >
                Tests Dashboard
            </Text>

            {loading ? (
                <Spinner size="xl" color="yellow.400" />
            ) : error ? (
                <Alert status="error" colorScheme="red" mb={4}>
                    <AlertIcon />
                    {error}
                </Alert>
            ) : (
                <>
                    {testDetails.length > 0 ? (
                        testDetails.map((test, index) => (
                            <Box
                                key={test._id}
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
                                bg="#2D3748"
                                _hover={{ backgroundColor: "#4A5568", boxShadow: "xl" }}
                                onClick={() => handleDetails(test)}
                            >
                                <Flex align="center" gap={4}>
                                    <Box
                                        display="flex"
                                        alignItems="center"
                                        justifyContent="center"
                                        borderRadius="full"
                                        width="3rem"
                                        height="3rem"
                                        backgroundColor="#4A5568"
                                        color="white"
                                        fontWeight="700"
                                        fontSize="lg"
                                    >
                                        {index + 1}
                                    </Box>
                                    <Text fontSize="lg" fontWeight="bold" marginTop="1rem" p={4}>
                                        {test.testName}
                                    </Text>
                                </Flex>

                                <Flex gap={2} align="center">
                                    {role === "Teacher" && (
                                        <>
                                            <Button
                                                colorScheme="yellow"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    // Navigate to edit test page
                                                    navigate("/edit-test", { state: { test } });
                                                }}
                                            >
                                                Edit
                                            </Button>
                                            <Button
                                                colorScheme="red"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    // Delete test logic
                                                    if (window.confirm("Are you sure you want to delete this test?")) {
                                                        axios.delete(`http://localhost:8080/api/exam/test/${test._id}`)
                                                            .then(() => {
                                                                setTestDetails((prev) => prev.filter((t) => t._id !== test._id));
                                                                alert("Test deleted successfully!");
                                                            })
                                                            .catch((err) => {
                                                                alert("Error deleting test. Please try again.");
                                                            });
                                                    }
                                                }}
                                            >
                                                Delete
                                            </Button>
                                        </>
                                    )}

                                    {role === "Student" && (
                                        <Button
                                            colorScheme="teal"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                // Navigate to start exam page
                                                handleStartExam(test);
                                            }}
                                        >
                                            Start Exam
                                        </Button>
                                    )}
                                </Flex>
                            </Box>
                        ))
                    ) : (
                        <Text>No tests available for this classroom.</Text>
                    )}
                </>
            )}
        </Box>
    );
}
