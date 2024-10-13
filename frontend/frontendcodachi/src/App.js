// import { ChakraProvider } from "@chakra-ui/react";
// import theme from "./theme";
// import CompilerPage from "./components/CompilerPage";
// import ExperimentList from "./Dashboard/ExperimentsList";

// function App() {
//   // Sample problem statement and test cases
//   const problemStatement = `Given an integer number, write a program that returns its square. 
//   Your task is to implement a function that takes an integer and returns the square of that integer.
  
//   ### Input
//   - An integer number n.

//   ### Output
//   - Return the square of the input number.

//   ### Example:
//   **Input:** 4
//   **Output:** 16

//   **Input:** -3
//   **Output:** 9`;

//   const testCases = [
//     {
//       input: "2",
//       output: "4",
//     },
//     {
//       input: "-5",
//       output: "25",
//     },
//     {
//       input: "0",
//       output: "0",
//     },
//     {
//       input: "10",
//       output: "100",
//     },
//   ];
  // const problems = [
  //   {
  //     name: "Square Each Number",
  //     statement: "Given an array of integers, return a new array where each number is squared. Example: [1, 2, 3] should return [1, 4, 9]."
  //   },
  //   {
  //     name: "Sum of All Elements",
  //     statement: "Given an array of integers, find the sum of all the elements. Example: [5, 10, 15] should return 30."
  //   },
  //   {
  //     name: "Reverse the Array",
  //     statement: "Given an array, return a new array with the elements in reverse order. Example: [10, 20, 30] should return [30, 20, 10]."
  //   },
  //   {
  //     name: "Filter Even Numbers",
  //     statement: "Given an array of integers, return a new array containing only the even numbers. Example: [3, 5, 8, 10] should return [8, 10]."
  //   },
  //   {
  //     name: "Find Maximum Value",
  //     statement: "Given an array of integers, return the maximum value from the array. Example: [4, 7, 1, 9, 2] should return 9."
  //   },
  //   {
  //     name: "Count Occurrences of a Number",
  //     statement: "Given an array of integers and a number, count how many times the number appears in the array. Example: [1, 3, 2, 3, 4, 3] with the number 3 should return 3."
  //   },
  //   {
  //     name: "Check if Palindrome",
  //     statement: "Given an array of integers, return true if the array is a palindrome (the array reads the same forwards and backwards), otherwise return false. Example: [1, 2, 3, 2, 1] should return true."
  //   },
  //   {
  //     name: "Sum of Array After Doubling",
  //     statement: "Given an array of integers, double each element and return the sum of the resulting array. Example: [1, 2, 3] should return 12 (since [2, 4, 6] and 2+4+6 = 12)."
  //   },
  //   {
  //     name: "Find Index of Element",
  //     statement: "Given an array of integers and a target number, return the index of the target number in the array. If the number is not present, return -1. Example: [10, 20, 30] with target 20 should return 1."
  //   },
  //   {
  //     name: "Remove Duplicates",
  //     statement: "Given an array of integers, return a new array with all duplicate values removed. Example: [1, 2, 2, 3, 3, 4] should return [1, 2, 3, 4]."
  //   }
  // ];
  

//   return (
//     <ChakraProvider theme={theme}>
//       <ExperimentList experiments={problems}/>
//     </ChakraProvider>
//   );
// }

// export default App;
import { ChakraProvider } from "@chakra-ui/react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import theme from "./theme";
import CompilerPage from "./components/CompilerPage";
import ExperimentList from "./Dashboard/ExperimentsList";

function App() {
  
  const problems = [
    {
        name: "Square Each Number",
        statement: "Given an integer, return the square of the number. Example: Input '2' should return Output '4'.",
        testCases: [
            { input: "2", output: "4" },
            { input: "3", output: "9" },
            { input: "-4", output: "16" },
        ]
    },
    {
        name: "Sum of All Elements",
        statement: "Given two integers, return their sum. Example: Input '5 10' should return Output '15'.",
        testCases: [
            { input: "5 10", output: "15" },
            { input: "1 2", output: "3" },
            { input: "-1 -1", output: "-2" },
        ]
    },
    {
        name: "Reverse the Number",
        statement: "Given an integer, return the reverse of the number. Example: Input '123' should return Output '321'.",
        testCases: [
            { input: "123", output: "321" },
            { input: "-456", output: "-654" },
            { input: "100", output: "1" },
        ]
    },
    {
        name: "Filter Even Number",
        statement: "Given an integer, return true if it is even, otherwise return false. Example: Input '8' should return Output 'true'.",
        testCases: [
            { input: "8", output: "true" },
            { input: "7", output: "false" },
            { input: "-4", output: "true" },
        ]
    },
    {
        name: "Find Maximum Value",
        statement: "Given two integers, return the maximum value. Example: Input '4 9' should return Output '9'.",
        testCases: [
            { input: "4 9", output: "9" },
            { input: "15 12", output: "15" },
            { input: "-3 -2", output: "-2" },
        ]
    },
    {
        name: "Count Occurrences of a Number",
        statement: "Given an integer and a list, return how many times the integer appears. Example: Input '3 1 2 3 3 4' should return Output '2'.",
        testCases: [
            { input: "3 1 2 3 3 4", output: "2" },
            { input: "2 2 2 2 3", output: "4" },
            { input: "5 1 2 3", output: "0" },
        ]
    },
    {
        name: "Check if Palindrome",
        statement: "Given an integer, return true if it is a palindrome, otherwise return false. Example: Input '121' should return Output 'true'.",
        testCases: [
            { input: "121", output: "true" },
            { input: "123", output: "false" },
            { input: "-121", output: "false" },
        ]
    },
    {
        name: "Sum After Doubling",
        statement: "Given an integer, double it and return the result. Example: Input '3' should return Output '6'.",
        testCases: [
            { input: "3", output: "6" },
            { input: "10", output: "20" },
            { input: "-4", output: "-8" },
        ]
    },
    {
        name: "Find Index of Element",
        statement: "Given a number and a list, return the index of the number. Example: Input '20 10 20 30' should return Output '1'.",
        testCases: [
            { input: "20 10 20 30", output: "1" },
            { input: "1 1 2 3", output: "0" },
            { input: "5 1 2 3", output: "-1" },
        ]
    },
    {
        name: "Remove Duplicates",
        statement: "Given an integer and a list, return true if the integer is unique in the list. Example: Input '3 1 2 3 4' should return Output 'false'.",
        testCases: [
            { input: "3 1 2 3 4", output: "false" },
            { input: "2 1 2 2 3", output: "false" },
            { input: "5 1 2 3", output: "true" },
        ]
    }
];

  
  
  return (
    <ChakraProvider theme={theme}>
      <Router>
        <Routes>
          {/* Route for Experiment List */}
          <Route path="/" element={<ExperimentList experiments={problems} />} />

          {/* Route for CompilerPage, passing the experiment name in the URL */}
          <Route path="/compiler" element={<CompilerPage  />} />
        </Routes>
      </Router>
    </ChakraProvider>
  );
}

export default App;
