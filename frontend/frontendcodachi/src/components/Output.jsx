import { Box, Text, Button, Textarea, Input } from "@chakra-ui/react";
import { useState } from "react"; // Import useState to manage state
import { executeCode } from "./api";

export default function Output({ editorRef, language, testCases }) {
  const [output, setOutput] = useState(""); // State to store the output
  const [userInput, setUserInput] = useState(""); // State for user input
  const [isLoading, setIsLoading] = useState(false); // Loading state
  const [isError, setIsError] = useState(false); // Error state
  const [inputBox, SetInputBox] = useState(false); // To control the custom input box visibility

  const runCode = async () => {
    const sourceCode = editorRef.current.getValue(); // Get the code from the editor
    if (!sourceCode) {
      setOutput("Please enter code to run."); // Handle empty code
      return;
    }
  
    try {
      setIsLoading(true);
      setIsError(false);
  
      let result;
  
      // If custom input is enabled and user input exists, pass user input
      if (inputBox && userInput) {
        result = await executeCode(language, sourceCode, userInput); // Pass only user input
      } else {
        // Otherwise, pass test cases
        result = await executeCode(language, sourceCode, "", testCases); // Pass test cases if no custom input
      }
  
      // Check the result from the API and update the output accordingly
      if (result && result.finalResult) {
        setOutput(result.finalResult); // Set the final result as output
        if (result.isError)
          setIsError(true)
        else
          setIsError(false)
      } else {
        setOutput("No output received.");
      }
    } catch (err) {
      console.error("Error executing code:", err);
      setOutput(`Error executing code: ${err.message}`); // Display error message in output
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
      <input
        type="checkbox"
        id="inputBox"
        onChange={() => {
          SetInputBox(!inputBox);
        }}
      />
      <label htmlFor="inputBox"> Custom input</label>

      {/* Show textarea when custom input is enabled */}
      {inputBox && (
        <Input
          placeholder="Enter input here..."
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          mt={2} // Margin top for spacing
          size="sm" // Adjust size (optional)
          resize="vertical" // Allow vertical resizing
          rows={3} // Minimum number of rows visible
        />
      )}

      <Button
        variant="outline"
        colorScheme="green"
        onClick={runCode}
        isLoading={isLoading}
        mt={2}
      >
        RUN
      </Button>

      <Box
        border="1px solid"
        borderRadius={4}
        borderColor={isError ? "red.500" : "green"}
        p={2}
        mt={4} // Margin to space out the output box
        minHeight="100px" // Ensure some space for the output
        fontFamily="monospace" // Use a monospace font for code output
        whiteSpace="pre-wrap" // Preserve formatting of output
        overflowX="auto" // Allow horizontal scrolling if the output is long
      >
        {output ? output : "No output yet"} {/* Show output or a placeholder */}
      </Box>
    </Box>
  );
}
