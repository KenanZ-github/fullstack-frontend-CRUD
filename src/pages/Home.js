import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import * as XLSX from "xlsx";

export default function Home() {
  const [users, setUsers] = useState([]); // Originalni korisnici
  const [searchTerm, setSearchTerm] = useState(""); // Stanje za pretragu

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    const result = await axios.get("http://localhost:8080/users");
    setUsers(result.data);
  };

  const handleSearch = async () => {
    if (searchTerm.trim() !== "") {
      const result = await axios.get(`http://localhost:8080/users/search?name=${searchTerm}`);
      setUsers(result.data); // Postavi filtrirane korisnike
    } else {
      loadUsers(); // Ponovo učitaj sve korisnike ako nema pretrage
    }
  };

  const deleteUser = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/users/${id}`);
      loadUsers(); // Ponovo učitaj korisnike nakon brisanja
    } catch (error) {
      console.error("There was an error deleting the user!", error);
    }
  };

  const exportToExcel = () => {
    if (users.length > 0) { // Provjeri da li ima korisnika
      const worksheet = XLSX.utils.json_to_sheet(users);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Users");
      XLSX.writeFile(workbook, "users.xlsx");
    } else {
      console.warn("No users to export.");
    }
  };

  return (
    <div className="container">
      <div className="py-4">
        <div className="d-flex mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Search by name"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button className="btn btn-primary mx-2" onClick={handleSearch}>
            Search
          </button>
          {/* Dugme za export to Excel pored search dugmeta */}
          <button className="btn btn-success mx-2" onClick={exportToExcel}>
            Export to Excel
          </button>
        </div>

        {users.length > 0 ? (
          <table className="table border shadow">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Name</th>
                <th scope="col">UserName</th>
                <th scope="col">Email</th>
                <th scope="col">Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => (
                <tr key={index}>
                  <th scope="row">{index + 1}</th>
                  <td>{user.name}</td>
                  <td>{user.username}</td>
                  <td>{user.email}</td>
                  <td>
                    <Link className="btn btn-primary mx-2" to={`/viewuser/${user.id}`}>
                      View
                    </Link>
                    <Link className="btn btn-outline-primary mx-2" to={`/edituser/${user.id}`}>
                      Edit
                    </Link>
                    <button className="btn btn-danger mx-2" onClick={() => deleteUser(user.id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No users found. Please search by name.</p>
        )}
      </div>
    </div>
  );
}
