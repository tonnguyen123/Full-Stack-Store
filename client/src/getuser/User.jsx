import React, { useEffect, useState } from 'react';
import './user.css';
import axios from "axios";
import { Link, useNavigate } from 'react-router-dom';

export const User = () => {
  const navigate = useNavigate();
  const [users, setUser] = useState([]);

  // Fetch data from API
  const fetchDat = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/users");
      // Ensure res.data is an array before setting state
      if (Array.isArray(res.data)) {
        setUser(res.data);
      } else {
        console.error("Data is not an array:", res.data);
        setUser([]); // Fallback to empty array
      }
    } catch (error) {
      console.log("Error while fetching data.", error);
      setUser([]); // Ensure we set to an array in case of error
    }
  };

  useEffect(() => {
    fetchDat();
  }, []);

  const deleteUser = async (userId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this user?");
    if (!confirmDelete) return;

    try {
      await axios.delete(`http://localhost:8000/api/delete/user/${userId}`);
      alert("User deleted successfully!");

      // Refetch the updated data
      await fetchDat();
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  return (
    <div className='userTable'>
      <Link to="/add" type="button" className="btn btn-primary">
        Add user <i className="fa-solid fa-user-plus"></i>
      </Link>
      {users.length === 0 ? (
        <div className='noDat'>
          <h3>No user data in the database</h3>
          <p>Please click 'Add user' button to add user to database.</p>
        </div>
      ) : (
        <table className='table table-bordered'>
          <thead>
            <tr>
              <th scope='col'>id</th>
              <th scope='col'>name</th>
              <th scope='col'>address</th>
              <th scope='col'>email</th>
              <th scope='col'>action</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => {
              return (
                <tr key={user._id || index}>
                  <td>{index + 1}</td>
                  <td>{user.name}</td>
                  <td>{user.address}</td>
                  <td>{user.email}</td>
                  <td className='actions'>
                    <button
                      onClick={() => navigate(`/update/${user._id}`)}
                      type="button"
                      className="btn btn-success"
                      style={{ marginRight: '10px' }}
                    >
                      <i className="fa-solid fa-pen-to-square"></i>
                    </button>
                    <button
                      type="button"
                      className="btn btn-danger"
                      onClick={() => deleteUser(user._id || user.id)}
                    >
                      <i className="fa-solid fa-trash"></i>
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
};
