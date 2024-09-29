// CompilerPage.js

import React from "react";
import { Box } from "@chakra-ui/react";
import Editor from "@monaco-editor/react";

export default function CompilerPage() {
  return (
    <Box
      className="compiler"
      bg="samurai.gray"
      color="samurai.white"
      h="100vh"
      p={4}
    >
      {/* Navbar */}
      <Box className="navbar" bg="samurai.black" color="samurai.gold" p={4}>
        <h1>Samurai Code Editor</h1>
      </Box>

      {/* Code Editor */}
      <Box className="editor-container" mt={4} border="1px solid" borderColor="samurai.steel" borderRadius="md">
        <Editor
          height="70vh"
          defaultLanguage="java"
          defaultValue="// Start typing your code..."
          theme="vs-dark" // Monaco Editor dark theme
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            fontFamily: "monospace",
            scrollBeyondLastLine: false,
          }}
        />
      </Box>
    </Box>
  );
}
