import { useNavigate } from "react-router-dom";
import { Box, Text } from "@chakra-ui/react";

export default function ExperimentList({ experiments }) {
  const navigate = useNavigate();

  const handleClick = (exp) => {
    // Navigate to the compiler page and pass the experiment object in the state
    navigate(`/compiler`, { state: { experiment: exp } });
  };

  return (
    <Box>
      <Text fontSize="2xl" mb={4}>Java Experiments List </Text>
      {experiments.map((exp, index) => (
        <Box
          key={index}
          onClick={() => handleClick(exp)}
          cursor="pointer"
          p={4}
          borderWidth="3px"
              borderRadius="md"
              borderStyle={"dashed"}
              borderBottom={"3px"}
              
          mb={2}
          _hover={{ backgroundColor: "gray.100" }}
        >
          <Text>{exp.name}</Text>
        </Box>
      ))}
    </Box>
  );
}
