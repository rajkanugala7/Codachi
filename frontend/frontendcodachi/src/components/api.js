import axios from "axios";
import { LANGUAGES } from "../constants";

// Define the Piston API URL
const API_URL = "https://emkc.org/api/v2/piston/execute";

// Function to execute code with the selected language and version
export const executeCode = async (languageKey, code) => {
  try {
    // Get the language details from the constants.js
    const selectedLanguage = LANGUAGES[languageKey];

    // Prepare the payload for the API call
    const payload = {
      language: selectedLanguage.name.toLowerCase(), // Convert language name to lowercase as required by the API
      version: selectedLanguage.version,            // Specify the version from the constants.js
      files: [
        {
          name: "main",
          content: code,                            // Pass the code entered by the user
        },
      ],
    };

    // Make the POST request to the Piston API
    const response = await axios.post(API_URL, payload);

    // Return the response data
    return response.data;
  } catch (error) {
    console.error("Error executing code:", error);
    throw error; // Rethrow the error to handle it in the calling function
  }
};
