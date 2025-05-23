import React, { useState, useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Box, Flex, Button,Textarea } from "@chakra-ui/react";
import Editor from "@monaco-editor/react";
import LanguageSelector from "./LanguageSelector";
import { LANGUAGES } from "../constants"; // Assuming your language constants are in constants.js
import Output from "./Output";
import axios from "axios";
import { executeCode } from "./api"; // Assuming you have an API function to execute the code

export default function ExamCompilerPage({
  experiment,
  classroomId,
  studentId,
  setId,
  testId,
  onComplete
}) {
  const [code, setCode] = useState(LANGUAGES["Java"].codeSnippet); // Initialize with Java code snippet
  const [language, setLanguage] = useState("Java");
  const [userInput, setUserInput] = useState(""); // State to store user input
  const [output, setOutput] = useState(""); // State to store output
  const location = useLocation();

  const [testCases, setTestCases] = useState([]);
  

  useEffect(() => {
    // Define an async function to fetch test cases
    const fetchTestCases = async () => {
      try {
        const response = await axios.get(
          `https://codachi-1.onrender.com/api/testcases/${experiment._id}`
        );
        console.log("Fetched test cases:", response.data);
        setTestCases(response.data); // Store fetched test cases
      } catch (error) {
        console.error("Error fetching test cases:", error);
      }
    };

    // Call the fetch function if experiment ID is available
    if (experiment._id) {
      fetchTestCases();
    }
  }, [experiment._id]); // Fetch again if experiment ID changes

  const editorRef = useRef(null);

  const onMount = (editor) => {
    editorRef.current = editor;
    editor.focus();
  };

  const onSelect = (selectedLanguage) => {
    setLanguage(selectedLanguage);
    setCode(LANGUAGES[selectedLanguage].codeSnippet); // Set the code snippet based on selected language
  };

  const [dividerPosition, setDividerPosition] = useState(650); // Initial divider position in pixels
  const containerRef = useRef(null); // Reference to the container

  // Handle mouse down event for the divider
  const handleMouseDown = (e) => {
    e.preventDefault();
    const startX = e.clientX; // Get the starting X position of the mouse
    const startWidth = dividerPosition; // Store the initial width of the left box

    // Handle mouse move event
    const handleMouseMove = (e) => {
      const deltaX = e.clientX - startX; // Calculate how far the mouse has moved
      const newDividerPosition = startWidth + deltaX; // Calculate the new width for the left box
      const containerWidth = containerRef.current.clientWidth; // Get the total width of the container

      // Prevent overflow beyond container bounds
      if (newDividerPosition > 50 && newDividerPosition < containerWidth - 50) {
        setDividerPosition(newDividerPosition); // Set new divider position
      }
    };

    // Handle mouse up event
    const handleMouseUp = () => {
      window.removeEventListener("mousemove", handleMouseMove); // Stop moving
      window.removeEventListener("mouseup", handleMouseUp); // Stop listening to mouseup
    };

    window.addEventListener("mousemove", handleMouseMove); // Start listening to mousemove
    window.addEventListener("mouseup", handleMouseUp); // Start listening to mouseup
  };

  // Function to execute the code with user input
  const handleRunCode = async () => {
    try {
      const response = await executeCode({
        code,
        language,
        userInput,
        classroomId,
        studentId,
      });
      setOutput(response.data.output);
    } catch (error) {
      console.error("Error executing code:", error);
    }
  };

  return (
    <Box className="compiler" bg="samurai.gray" color="samurai.white" h="90vh" p={4}>
      {/* Main Content: Problem Statement and Code Editor */}
      <Flex mt={4} h="calc(100vh - 100px)" ref={containerRef}>
        {/* Problem Statement */}
        <Box
          className="probState p-3"
          width={`${dividerPosition}px`} // Left box width based on divider position
          bg="#555555"
          border="1px solid"
          borderColor="samurai.steel"
          borderRadius="md"
          p={4}
          overflowY="auto"
        >
          <h2>{experiment.name}</h2>
          <p>{experiment.problemStatement}</p>
        </Box>

        {/* Resizable Divider */}
        <Box
          className="draggable-divider"
          onMouseDown={handleMouseDown} // Start resizing on mousedown
          cursor="col-resize"
          width="5px"
          bg="samurai.steel"
          height="100%"
        />

        {/* Code Editor and Output Section */}
        <Box
          className="editor-container"
          width={`calc(100% - ${dividerPosition}px - 10px)`} // Right box width adjusted based on divider
          border="1px solid"
          borderColor="samurai.steel"
          borderRadius="md"
          p={4}
        >
          {/* Language Selector */}
          <LanguageSelector language={language} onSelect={onSelect} />

          {/* Code Editor */}
          <Editor
            height="85%"
            language={language.toLowerCase()}
            value={code}
            theme="vs-dark"
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              fontFamily: "monospace",
              scrollBeyondLastLine: false,
            }}
            onChange={(value) => setCode(value)}
            onMount={onMount}
          />

         

          {/* Output Section */}
          <Box mt={6}>
            <Output
              editorRef={editorRef}
              language={language}
              testCases={testCases}
              expId={experiment._id}
              classroomId={classroomId}
              studentId={studentId}
              setId={setId}
              testId={testId}
              onComplete={onComplete}
            />
          </Box>
        </Box>
      </Flex>
    </Box>
  );
}
