import React, { useEffect, useState } from 'react';
import './user.css';
import axios from "axios";
import { Link, useNavigate } from 'react-router-dom';

export const User = () => {
  const navigate = useNavigate();
  const [users, setUser] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);

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
      
      await fetchDat();
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const filterUsers = (userInput) =>{
    if(!userInput){
      setFilteredUsers([]);
      return;

    }
    const matches = users.filter((userInfo)=>
      userInfo.name.toLowerCase().includes(userInput.toLowerCase())
    );
    setFilteredUsers(matches);

  };

  return (
    <div>
      <div>
      
        <button onClick={()=> navigate('/')} type="button"
                      className="btn btn-info">
        <i class="fa-solid fa-store"></i>
          Store Page</button>
      </div>
    <div className='userTable'>
      
      <Link to="/add" type="button" className="btn btn-primary">
        Add user <i className="fa-solid fa-user-plus"></i>
      </Link>
      <div className="searchBox">
        <input placeholder="Enter name of user to search"
        value={searchTerm}
        onChange={(e) =>{
          setSearchTerm(e.target.value);
          filterUsers(e.target.value);
        }}
        ></input>
        {filteredUsers.length > 0 && (
          <ul className="search-dropdown">
            {filteredUsers.map((userInfo)=>(
              <li key={userInfo._id} onClick={() => navigate(`/profile/${userInfo._id}`)}>
                {userInfo.name}
              </li>
            ))}
          </ul>

        )}
      </div>
      {users.length === 0 ? (
        <div className='noDat'>
          <h3>No user data in the database</h3>
          <p>Please click 'Add user' button to add user to database.</p>
        </div>
      ) : (
        <table className='table table-bordered'>
          <thead>
            <tr>
              <th scope='col'>ID</th>
              <th scope='col'>Name</th>
              <th scope='col'>Phone</th>
              <th scope='col'>Address</th>
              <th scope='col'>Email</th>
              <th scope='col'>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length === 0 && users.map((user, index) => {
              return (
                <tr key={user._id || index}>
                  <td>{index + 1}</td>
                  <td>{user.name}</td>
                  <td>{user.phone}</td>
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
                      style={{ marginRight: '10px' }}
                      onClick={() => deleteUser(user._id || user.id)}
                    >
                      <i className="fa-solid fa-trash"></i>
                    </button>

                    <button
                     onClick={() => navigate(`/profile/${user._id}`)}
                      type="button"
                      className="btn btn-info"
                    >
                      <i class="fa-solid fa-user"></i>

                    </button>
                  </td>
                </tr>
              );
            })}

            {
              filteredUsers.length > 0 && filteredUsers.map((user, index) => {
                return (
                  <tr key={user._id || index}>
                    <td>{index + 1}</td>
                    <td>{user.name}</td>
                    <td>{user.phone}</td>
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
                        style={{ marginRight: '10px' }}
                        onClick={() => deleteUser(user._id || user.id)}
                      >
                        <i className="fa-solid fa-trash"></i>
                      </button>
  
                      <button
                       onClick={() => navigate(`/profile/${user._id}`)}
                        type="button"
                        className="btn btn-info"
                      >
                        <i class="fa-solid fa-user"></i>
  
                      </button>
                    </td>
                  </tr>
                );
              })

            }
          </tbody>
        </table>
      )}
    </div>
    </div>
  );
};
