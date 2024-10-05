import { Box, Text, Button } from "@chakra-ui/react";
import { useState } from "react"; // Import useState to manage state
import { executeCode } from "./api";

export default function Output({ editorRef, language }) {
  const [output, setOutput] = useState(""); // State to store the output

  const runCode = async () => {
    const sourceCode = editorRef.current.getValue(); // Get the code from the editor
    if (!sourceCode) return; // If no code, exit

    try {
      // Call the executeCode function and pass the selected language and code
      const result = await executeCode(language, sourceCode);

      // Check the result from the API and update the output accordingly
      if (result.run && result.run.stdout) {
        console.log("Code Output:", result.run.stdout);
        setOutput(result.run.stdout); // Set the output to the state
      } else if (result.run && result.run.stderr) {
        console.log("Code Error:", result.run.stderr);
        setOutput(result.run.stderr); // Set the error output to the state
      }
    } catch (err) {
      console.error("Error executing code:", err);
      setOutput(`Error executing code: ${err.message}`); // Set error message
    }
  };

  return (
    <Box>
      <Text fontWeight="bold" fontSize="xl">OUTPUT</Text>
      <Button variant="outline" colorScheme="green" onClick={runCode}>
        RUN
      </Button>
      <Box
        border="1px solid"
        borderRadius={4}
        borderColor="#555555"
        p={2}
        mt={4} // Margin to space out the output box
         // Light background for readability
        minHeight="100px" // Ensure some space for the output
        fontFamily="monospace" // Use a monospace font for code output
        whiteSpace="pre-wrap" // Preserve formatting of output
      >
        {output ? output : "No output yet"} {/* Show output or a placeholder */}
      </Box>
    </Box>
  );
}
