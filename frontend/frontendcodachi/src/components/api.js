import axios from "axios";
import { LANGUAGES } from "../constants"; // Ensure this file has all required language data

// Define the Piston API URL
const API_URL = "https://emkc.org/api/v2/piston/execute";

export const executeCode = async (languageKey, code, input = "", testCases = []) => {
  try {
    const selectedLanguage = LANGUAGES[languageKey];

    if (!selectedLanguage) {
      throw new Error("Invalid programming language selected.");
    }

    const payload = {
      language: selectedLanguage.name.toLowerCase(),
      version: selectedLanguage.version,
      files: [
        {
          name: "main",
          content: code,
        },
      ],
      stdin: input,
    };

    // If no test cases are provided, execute with custom input
    if (testCases.length === 0) {
      const response = await axios.post(API_URL, payload);
      return handleResponse(response);
    } else {
      // Execute for test cases
      let results = [];
      let allPassed = true;

      for (let i = 0; i < testCases.length; i++) {
        const { input: testCaseInput, output: expectedOutput } = testCases[i];

        // Update stdin for the current test case
        payload.stdin = testCaseInput;

        // Send request to the API for each test case
        const response = await axios.post(API_URL, payload);

        // Get the actual output from the response
        const result = handleResponse(response);
        const actualOutput = result.finalResult.trim();  // Trim the actual output

        // Trim expected output and compare
        const testCasePassed = actualOutput === expectedOutput.trim();
        
        results.push({
          testCase: i + 1,
          input: testCaseInput,
          expectedOutput,
          actualOutput,
          passed: testCasePassed,
        });

        if (!testCasePassed) {
          allPassed = false;
        }
      }

      return {
        finalResult: allPassed ? "Accepted" : "Failed",
        testCasesResults: results,
        isError: allPassed ? false : true
      };
    }
  } catch (error) {
    // Display error message directly in the output box
    return {
      finalResult: `Error: ${error.message}`,
      isError: true
    };
  }
};

// Handle the response from the Piston API
const handleResponse = (response) => {
  const { stdout, stderr } = response?.data?.run || {};

  // If there is an error in the execution, throw it
  if (stderr) {
    throw new Error(stderr.trim()); // Throw the error for higher-level handling
  }

  // If no errors, return stdout
  const actualOutput = stdout?.trim() || "No output received.";
  return {
    finalResult: actualOutput,
  };
};
