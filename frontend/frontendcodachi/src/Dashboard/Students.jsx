import React, { useMemo, useState, useEffect } from "react";
import { MaterialReactTable } from "material-react-table";
import { IconButton } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useLocation, useNavigate } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import axios from "axios";

const Students = () => {
  const location = useLocation();
  const [students, setStudents] = useState(location.state?.students || []); // Default to empty array if students are not found
  const className = location.state?.className;
  const classroomId = location.state?.classroomId;
  const teacherId = location.state?.teacherId;
  const [loading, setLoading] = useState(false); // Track loading state
  const [error, setError] = useState(null); // Track errors
  const navigate = useNavigate();

  // Fetch student data (if not passed in the location state)
  useEffect(() => {
    if (!students.length) {
      setLoading(true);
      // Simulate fetching students from an API
      setTimeout(() => {
        // Replace with actual API call
        setStudents([
          { studentId: 1, studentName: "John Doe", email: "john@example.com", mobile: "1234567890", course: "Math", enrollmentDate: "2024-01-01" },
          { studentId: 2, studentName: "Jane Doe", email: "jane@example.com", mobile: "0987654321", course: "Science", enrollmentDate: "2024-01-02" },
          // Add more student data here...
        ]);
        setLoading(false);
      }, 1000); // Simulate loading delay
    }
  }, [students]);

  // Handlers for actions
  const handleEdit = (row) => {
    console.log(teacherId)
    navigate("/editstudent", { state: { row , className:className,teacherId:teacherId,classroomId:classroomId} }); // Pass the student data
  };

  const handleDelete = async (row) => {
    if (window.confirm(`Are you sure to delete ${row.name}?`)) {
      try {
        // Send a DELETE request to the server
        const response = await axios.delete(`https://codachi-1.onrender.com/api/students/${row._id}`);
  
        // If the deletion is successful, remove the student from the local state
        alert(`Student ${row.name} deleted successfully!`);
        
        // Optionally, you can update the state here to remove the student from the UI
        // For example, if you have a students state, you can filter it out
        setStudents((prevStudents) => prevStudents.filter(student => student._id !== row._id));
        
      } catch (err) {
        console.error("Error deleting student:", err);
        alert("Failed to delete student. Please try again later.");
      }
    }
  };
  

  const columns = useMemo(
    () => [
      { accessorKey: "_id", header: "id", size: 100 },
    
      { accessorKey: "rollno", header: "Roll No.", size: 100 },
      { accessorKey: "name", header: "Name", size: 150 }, // Name column
 // Roll Number column
      { accessorKey: "email", header: "Email", size: 200 }, // Email column
      {
        accessorKey: "actions",
        header: "Actions",
        Cell: ({ row }) => (
          <>
            <IconButton onClick={() => handleEdit(row.original)}>
              <EditIcon color="primary" />
            </IconButton>
            <IconButton onClick={() => handleDelete(row.original)}>
              <DeleteIcon color="error" />
            </IconButton>
          </>
        ),
        enableSorting: false,
        size: 150, // Actions column
      },
    ],
    []
  );
  

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="dashboardPage">
      <div className="dashboard">
        <h3>Students { className} </h3>
        <div className="dtop" style={{marginLeft:"76vw",marginRight:"1.5rem"}}>
          <span>Total Students = {students.length}</span>
          <button className="btn btn-primary p-3" onClick={() => navigate("/createstudent", {state:{classroomId:classroomId,teacherId:teacherId,className:className}})}>
            Add new Student
          </button>
        </div>
        <MaterialReactTable
          columns={columns}
          data={students} // Display all students
          enableSorting
          localization={{
            toolbarSearchPlaceholder: "Search for keyword",
            toolbarSearchTooltip: "Search for a specific keyword",
          }}
          muiTableContainerProps={{
            sx: {
              maxHeight: "calc(100vh - 180px)", // Allow scrolling for large datasets
              overflowY: "auto",
              width: "100%",
            },
          }}
          muiTableProps={{
            sx: {
              tableLayout: "fixed",
              width: "100%",
            },
          }}
          muiTableBodyCellProps={{
            sx: {
              wordWrap: "break-word",
            },
          }}
        />
      </div>
    </div>
  );
};

const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2", // Customize primary color
    },
    secondary: {
      main: "#dc004e", // Customize secondary color
    },
  },
});

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <Students />
    </ThemeProvider>
  );
};

export default App;
