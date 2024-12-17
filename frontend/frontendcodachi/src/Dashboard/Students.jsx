import React, { useMemo, useState, useEffect } from "react";
import { MaterialReactTable } from "material-react-table";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import { IconButton } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useLocation, useNavigate } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles"; // Import ThemeProvider and createTheme

const Students = () => {
  const [pageIndex, setPageIndex] = useState(0);
  const location = useLocation();
  const [students, setStudents] = useState(location.state?.students || []); // Default to empty array if students are not found
  const [loading, setLoading] = useState(false); // Track loading state
  const [error, setError] = useState(null); // Track errors
  const [pageSize] = useState(10);
  const navigate = useNavigate();

  // Fetch student data (if not passed in the location state)
  useEffect(() => {
    if (!students.length) {
      setLoading(true);
      // Simulate fetching students from an API
      setTimeout(() => {
        // Replace with actual API call
        setStudents([
          // Example students data
          { studentId: 1, studentName: "John Doe", email: "john@example.com", mobile: "1234567890", course: "Math", enrollmentDate: "2024-01-01" },
          { studentId: 2, studentName: "Jane Doe", email: "jane@example.com", mobile: "0987654321", course: "Science", enrollmentDate: "2024-01-02" },
          // More students...
        ]);
        setLoading(false);
      }, 1000); // Simulate loading delay
    }
  }, [students]);

  // Handlers for actions
  const handleEdit = (row) => {
    navigate("/editstudent", { state: { row } }); // Pass the student data
  };

  const handleDelete = (row) => {
    alert(`Delete student: ${row.studentName}`);
    // Implement delete logic here
  };

  const columns = useMemo(
    () => [
      { accessorKey: "studentId", header: "ID", size: 80 },
      { accessorKey: "studentName", header: "Name", size: 150 },
      { accessorKey: "email", header: "Email", size: 200 },
      { accessorKey: "mobile", header: "Mobile No", enableSorting: false, size: 120 },
      { accessorKey: "course", header: "Course", enableSorting: false, size: 150 },
      {
        accessorKey: "enrollmentDate",
        header: "Enrollment Date",
        Cell: ({ renderedCellValue }) =>
          new Date(renderedCellValue).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          }),
        size: 120,
      },
      {
        accessorKey: "actions",
        header: "Action",
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
        size: 150,
      },
    ],
    []
  );

  // Handle page change
  const handlePageChange = (event, newPage) => {
    setPageIndex(newPage - 1); // Update the page index
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  // Slice students based on pagination state
  const paginatedStudents = students.slice(pageIndex * pageSize, (pageIndex + 1) * pageSize);

  return (
    <div className="dashboardPage">
      <div className="dashboard">
        <h3>Student List</h3>
        <div className="dtop">
          <span>Total count = {students.length}</span>
          <button className="btn btn-primary p-3" onClick={() => navigate("/createstudent")}>
            Create Student
          </button>
        </div>
        <MaterialReactTable
          columns={columns}
          data={paginatedStudents} // Use paginated data
          enableSorting
          localization={{
            toolbarSearchPlaceholder: "Search for keyword",
            toolbarSearchTooltip: "Search for a specific keyword",
          }}
          muiTableContainerProps={{
            sx: {
              maxHeight: "calc(100vh - 180px)",
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
        <div style={{ display: "flex", justifyContent: "center", padding: "10px" }}>
          <Stack spacing={2} justifyContent="center" alignItems="center">
            <Pagination
              count={Math.ceil(students.length / pageSize)} // Total pages based on data length and pageSize
              page={pageIndex + 1}
              onChange={handlePageChange}
              color="primary"
              variant="outlined"
              shape="rounded"
            />
          </Stack>
        </div>
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
