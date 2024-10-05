import React, { useState, useRef } from "react";
import { Box, Flex } from "@chakra-ui/react";
import Editor from "@monaco-editor/react";
import LanguageSelector from "./LanguageSelector";
import { LANGUAGES } from "../constants"; // Assuming your language constants are in constants.js
import Output from "./Output";

export default function CompilerPage() {
  const [code, setCode] = useState(LANGUAGES["Java"].codeSnippet); // Initialize with Java code snippet
  const [language, setLanguage] = useState("Java");
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

  return (
    <Box className="compiler" bg="samurai.gray" color="samurai.white" h="100vh" p={4}>
      {/* Navbar */}
      <Box className="navbar rounded" bg="samurai.black" color="samurai.gold" p={4}>
        <h1 style={{ fontSize: "1.2rem" }}>CODACHI</h1>
      </Box>

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
          <h2>Problem Statement</h2>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nemo ipsa sed, modi nisi, sit dolorem aliquid
            soluta repellendus, ad voluptate inventore debitis assumenda cumque. Optio natus ducimus amet sunt.
          </p>
          {/* Add more content as needed */}
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

        {/* Code Editor */}
        <Box
          className="editor-container"
          width={`calc(100% - ${dividerPosition}px - 10px)`} // Right box width adjusted based on divider
          border="1px solid"
          borderColor="samurai.steel"
          borderRadius="md"
        >
          {/* Language Selector */}
          <LanguageSelector language={language} onSelect={onSelect} />
          
          {/* Code Editor */}
          <Editor
            height="80%"
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

          {/* Test Cases */}
          <div className="p-4">
            <Output language={language} editorRef={editorRef} />
            <h1>Test Cases</h1>
            <p style={{ color: "red" }}>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Quae quam laborum autem libero ratione dolore esse
              aliquam, iste quasi non accusamus, reprehenderit dignissimos sed dolorem modi. Voluptas sunt aliquam maxime!
            </p>
          </div>
        </Box>
      </Flex>
    </Box>
  );
}
