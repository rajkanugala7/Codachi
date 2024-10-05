export const LANGUAGES = {
  JavaScript: {
    name: "JavaScript",
    version: "nodejs-18.16.0",  // Piston API version for JavaScript (Node.js)
    codeSnippet: `// JavaScript Example
  console.log("Welcome to Codachi");`
  },
  Python: {
    name: "Python",
    version: "3.10.0",  // Piston API version for Python
    codeSnippet: `# Python Example
  print("Welcome to Codachi")`
  },
  Java: {
    name: "Java",
    version: "15.0.2",  // Piston API version for Java
    codeSnippet: `// Java Example
  public class Main {
    public static void main(String[] args) {
      System.out.println("Welcome to Codachi");
    }
  }`
  },
  C: {
    name: "C",
    version: "10.2.0",  // Piston API version for C (GCC)
    codeSnippet: `// C Example
  #include <stdio.h>
  
  int main() {
    printf("Welcome to Codachi\\n");
    return 0;
  }`
  },
  cpp: {
    name: "C++",
    version: "10.2.0",  // Piston API version for C++ (G++)
    codeSnippet: `// C++ Example
  #include <iostream>
  using namespace std;
  
  int main() {
    cout << "Welcome to Codachi" << endl;
    return 0;
  }`
  }
};
