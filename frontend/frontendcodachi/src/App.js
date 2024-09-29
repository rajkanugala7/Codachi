// App.js
import { ChakraProvider } from "@chakra-ui/react";
import theme from "./theme";
import CompilerPage from "./components/CompilerPage";

function App() {
  return (
    <ChakraProvider theme={theme}>
      <CompilerPage />
    </ChakraProvider>
  );
}

export default App;
