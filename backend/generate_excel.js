const xlsx = require('xlsx');
const path = require('path');

const data = [
  {
    "Certificate ID": "CV-2024-001",
    "Student Name": "Rahul Sharma",
    "Email": "rahul@example.com",
    "Internship Domain": "Web Development",
    "Start Date": "2024-01-15",
    "End Date": "2024-04-15"
  },
  {
    "Certificate ID": "CV-2024-002",
    "Student Name": "Priya Patel",
    "Email": "priya@example.com",
    "Internship Domain": "Data Science",
    "Start Date": "2024-02-01",
    "End Date": "2024-05-01"
  },
  {
    "Certificate ID": "CV-2024-003",
    "Student Name": "Ankit Kumar",
    "Email": "ankit@example.com",
    "Internship Domain": "UI/UX Design",
    "Start Date": "2024-01-10",
    "End Date": "2024-03-10"
  },
  {
    "Certificate ID": "CV-2024-004",
    "Student Name": "Sneha Gupta",
    "Email": "sneha@example.com",
    "Internship Domain": "Mobile App Development",
    "Start Date": "2024-03-01",
    "End Date": "2024-06-01"
  }
];

const ws = xlsx.utils.json_to_sheet(data);
const wb = xlsx.utils.book_new();
xlsx.utils.book_append_sheet(wb, ws, "Students");

const filePath = path.join(__dirname, 'Sample_Data_New.xlsx');
xlsx.writeFile(wb, filePath);

console.log(`Excel file created successfully at: ${filePath}`);
