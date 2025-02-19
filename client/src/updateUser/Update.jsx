import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { useNavigate, useParams, Link } from 'react-router-dom';
import './update.css';

export const Update = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState({ name: "", email: "", address: "" });

  // Memoize FetchUserInfo to avoid recreating it on every render.
  const FetchUserInfo = useCallback(async () => {
    try {
      const currUser = await axios.get("http://localhost:8000/api/user/" + id);
      setUser(currUser.data);
    } catch (error) {
      console.log("Error fetching user's info:", error);
    }
  }, [id]);

  useEffect(() => {
    FetchUserInfo();
  }, [FetchUserInfo]);

  const inputHandler = (e) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  const saveChange = async () => {
    if (!user.name || !user.address || !user.email) {
      alert("Please make sure all information below is filled before saving.");
    } else {
      const confirmUpdate = window.confirm("Are you sure you want to save all changes that you made?");
      if (confirmUpdate) {
        try {
          await axios.put(`http://localhost:8000/api/update/user/${user._id}`, user);
          navigate("/");
        } catch (error) {
          console.log("Error updating user:", error);
        }
      }
    }
  };

  return (
    <div className='Update'>
      <Link className='backButton btn btn-info' to="/">
        <i className="fa-solid fa-square-caret-left"> BACK</i>
      </Link>

      <h3>UPDATE USER'S INFORMATION</h3>

      <form className='UpdateForm'>
        <div className='inputGroup'>
          <label htmlFor='name'>Name: </label>
          <input
            type='text'
            id='name'
            name='name'
            value={user.name}
            onChange={inputHandler}
            autoComplete='off'
            placeholder={user.name}
          />
        </div>
        <div className='inputGroup'>
          <label htmlFor='email'>E-mail: </label>
          <input
            type='email'
            id='email'
            name='email'
            value={user.email}
            onChange={inputHandler}
            autoComplete='off'
            placeholder='Enter your email'
          />
        </div>
        <div className='inputGroup'>
          <label htmlFor='address'>Address: </label>
          <input
            type='text'
            id='address'
            name='address'
            value={user.address}
            onChange={inputHandler}
            autoComplete='off'
            placeholder='Enter your address'
          />
        </div>
        <div className='buttonGroup'>
          <button type="button" className="btn btn-primary" onClick={saveChange}>
            Save Changes
          </button>
          <button type="button" className="btn btn-secondary" onClick={FetchUserInfo}>
            Undo Changes
          </button>
        </div>
      </form>
    </div>
  );
};
