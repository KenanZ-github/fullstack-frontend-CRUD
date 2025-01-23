import "./App.css";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import Navbar from "./Layout/Navbar";
import Home from "./pages/Home";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AddUser from "./users/AddUser";
import EditUser from "./users/EditUser";
import ViewUser from "./users/ViewUser";
import * as XLSX from "xlsx"; // Import za Excel

function App() {
  const exportToExcel = (users) => {
    const worksheet = XLSX.utils.json_to_sheet(users); // Kreiraj Excel sheet
    const workbook = XLSX.utils.book_new(); // Kreiraj novi workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, "Users"); // Dodaj sheet u workbook
    XLSX.writeFile(workbook, "users.xlsx"); // Preuzmi Excel fajl
  };

  return (
    <div className="App">
      <Router>
        <Navbar /> {/* Ukloni proslijeđivanje ovdje */}
        <Routes>
          <Route exact path="/" element={<Home exportToExcel={exportToExcel} />} /> {/* Proslijedi u Home */}
          <Route exact path="/adduser" element={<AddUser />} />
          <Route exact path="/edituser/:id" element={<EditUser />} />
          <Route exact path="/viewuser/:id" element={<ViewUser />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
