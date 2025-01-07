import { Box, Text, Button, Input } from "@chakra-ui/react";
import { useState } from "react";
import { executeCode } from "./api";
import axios from "axios";

export default function Output({
  editorRef,
  language,
  testCases,
  expId,
  classroomId,
  studentId,
  setId,
  testId,
  onComplete, // Correctly structured as part of props
}) {
  const [output, setOutput] = useState(""); // State to store the output
  const [userInput, setUserInput] = useState(""); // State for user input
  const [isLoading, setIsLoading] = useState(false); // Loading state
  const [isError, setIsError] = useState(false); // Error state
  const [inputBox, setInputBox] = useState(false); // To control the custom input box visibility

  const runCode = async () => {
    const sourceCode = editorRef?.current?.getValue(); // Safely access the editor's value
    if (!sourceCode) {
      setOutput("Please enter code to run."); // Handle empty code
      return;
    }

    try {
      setIsLoading(true);
      setIsError(false);

      let result;

      if (inputBox && userInput) {
        result = await executeCode(language, sourceCode, userInput); // Pass user input
      } else {
        result = await executeCode(language, sourceCode, "", testCases); // Pass test cases
      }

      if (result) {
        setOutput(result.finalResult); // Set the final result as output

        if (result.finalResult === "Accepted") {
          if (setId === -1) {
            try {
              const response = await axios.post(
                `http://localhost:8080/api/experiments/${expId}`,
                {
                  classroomId: classroomId,
                  studentId: studentId,
                }
              );
              console.log("Experiment completed:", response.data);
               // Call onComplete if provided
            } catch (err) {
              console.error("Error completing experiment:", err);
            }
          } else if (setId) {
            try {
              const response = await axios.put(
                `http://localhost:8080/api/exam/test/${testId}`,
                {
                  setId: setId,
                  studentId: studentId,
                  experimentId: expId,
                  codeWritten: sourceCode,
                }
              );
              console.log("Test completed:", response.data);
              onComplete?.();
            } catch (err) {
              console.error("Error completing test:", err);
            }
          }
        }

        setIsError(!!result.isError);
      } else {
        setOutput("No output received.");
      }
    } catch (err) {
      console.error("Error executing code:", err);
      setOutput(`Error executing code: ${err.message}`);
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box>
      <Text fontWeight="bold" fontSize="xl">
        Run your Code
      </Text>

      {/* Checkbox for custom input */}
      <label>
        <input
          type="checkbox"
          onChange={() => setInputBox((prev) => !prev)}
          checked={inputBox}
        />
        Custom Input
      </label>

      {/* Show input box when custom input is enabled */}
      {inputBox && (
        <Input
          placeholder="Enter input here..."
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          mt={2}
          size="sm"
        />
      )}

      <Button
        variant="outline"
        colorScheme="green"
        onClick={runCode}
        isLoading={isLoading}
        mt={2}
      >
        Run
      </Button>

      <Box
        border="1px solid"
        borderRadius="md"
        borderColor={isError ? "red.500" : "green.500"}
        p={2}
        mt={4}
        minHeight="100px"
        fontFamily="monospace"
        whiteSpace="pre-wrap"
        overflowX="auto"
      >
        {output || "No output yet"}
      </Box>
    </Box>
  );
}
