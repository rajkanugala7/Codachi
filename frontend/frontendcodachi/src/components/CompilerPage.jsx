import React, { useState, useRef } from "react";
import { Box, Flex } from "@chakra-ui/react";
import Editor from "@monaco-editor/react";

export default function CompilerPage() {
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
      <Box className="navbar rounded" bg="samurai.black" color="samurai.gold"  p={4}>
        <h1 style={{fontSize:"1.2rem"}}>CODACHI</h1>
      </Box>

      {/* Main Content: Problem Statement and Code Editor */}
      <Flex mt={4} h="calc(100vh - 100px)" ref={containerRef}>
        {/* Problem Statement */}
        <Box
          className="probState p-3"
          width={`${dividerPosition}px`} // Left box width based on divider position
          bg="samurai.lightGray"
          border="1px solid"
          borderColor="samurai.steel"
          borderRadius="md"
          p={4}
          overflowY="auto"

        >
          <h2>Problem Statement</h2>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nemo ipsa sed, modi nisi, sit dolorem aliquid soluta repellendus, ad voluptate inventore debitis assumenda cumque. Optio natus ducimus amet sunt.
            {/* Add more content as needed */}
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Id hic aut necessitatibus possimus repellat excepturi quasi obcaecati incidunt quia ad illum suscipit sunt sed itaque illo beatae, voluptates qui rerum?
            Praesentium earum ipsam harum, accusantium velit cum ex at natus, inventore vero placeat eius. Voluptas nulla asperiores fuga ut deserunt esse possimus consequatur natus veritatis nesciunt enim similique, doloribus molestias.
            Minus, perferendis necessitatibus ab quod voluptates, explicabo nobis, rem aliquam nihil totam quidem? Libero porro eveniet odit quos cupiditate non ipsam. Asperiores perferendis voluptatum corporis eligendi deleniti minima porro incidunt!
            Odit impedit quibusdam earum porro in repudiandae voluptatibus natus qui quas quia obcaecati illum iste veritatis, deserunt repellendus laudantium ab. Ratione quod eos totam nesciunt consequuntur ipsa exercitationem aspernatur sequi.
            Maiores fuga molestiae aut natus consequuntur esse assumenda, inventore dolore culpa consectetur nihil accusantium, quis placeat provident laboriosam deleniti omnis dolor, eaque odit quas accusamus illum. Vero dolores iusto consequatur?
         
             Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatem sint quos error architecto in, itaque consequuntur optio perspiciatis, obcaecati asperiores sit magnam ipsum ea a pariatur, rerum similique eligendi iste?
             Placeat dolor totam facere eligendi. Exercitationem doloremque cupiditate sequi voluptas culpa nihil, sint incidunt similique sunt inventore! Velit exercitationem eveniet architecto rem error, accusamus sunt ab et repellat fugiat nulla!
             Autem veritatis incidunt perspiciatis ad temporibus exercitationem sunt id labore deserunt tempora saepe repellendus quidem cupiditate voluptatem totam nobis, nam ut repellat laudantium. Sequi sit, sapiente debitis molestias ea magnam.
             Dicta, officia autem! Aliquam impedit dignissimos dolor cupiditate molestias, quasi deserunt nemo blanditiis unde aperiam suscipit illum quam dolorem id quos esse minus obcaecati tempora doloribus, aliquid numquam consectetur? Numquam!
             Sapiente veritatis placeat libero ab, debitis eius iusto numquam voluptates blanditiis facere esse deserunt dolores unde amet provident possimus nisi doloribus praesentium molestiae dolor aspernatur culpa! Voluptatibus accusamus nisi nulla!
         
          </p>
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
          <Editor
            height="80%"
            defaultLanguage="java"
            defaultValue="// Start typing your code..."
            theme="vs-dark"
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              fontFamily: "monospace",
              scrollBeyondLastLine: false,
            }}
          />
     
            <div className="p-4">
            <h1>Test Cases</h1>
            <p style={{color:"red"}}>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quae quam laborum autem libero ratione dolore esse aliquam, iste quasi non accusamus, reprehenderit dignissimos sed dolorem modi. Voluptas sunt aliquam maxime!
            Dolores ex excepturi magni aut dolor pariatur? Laudantium eveniet inventore quisquam, quasi magnam consectetur ad asperiores velit non provident aperiam id! Repellendus earum quo voluptatum tempore neque? Suscipit, placeat ratione.
            Officiis aspernatur qui facilis necessitatibus quia cum doloremque sit neque dolore accusantium, amet aliquam aliquid vitae deserunt esse, optio nisi fuga! Eos minus aspernatur quidem asperiores, ipsa inventore eligendi autem.
            Quos similique, fuga iusto facere harum tenetur, itaque aut quod incidunt ducimus non illo dolorem exercitationem amet. Voluptatum minima sint eligendi quasi quibusdam odit suscipit earum asperiores, velit esse sunt.
            Consequuntur sint animi beatae non voluptatibus commodi aspernatur nostrum deserunt, sit vero. Doloremque debitis eaque eos pariatur quisquam odit ipsam magni assumenda architecto repellat ipsa, rerum quidem placeat dolorem officia!</p>
            </div>
        </Box>
      </Flex>
    </Box>
  );
}
