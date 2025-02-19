import React, { useState } from 'react';
import "./adduser.css";
import { Link, useNavigate } from 'react-router-dom';
import axios from "axios";


export const AddUser = () => {
    const HERE_API_KEY = process.env.HERE_MAP_API;

    const users = {
        name: "",
        email:"",
        address:"",
     };
     const [user, setUser] = useState(users);
     const [addSuggestion, setSugesstion] = useState([]);
     const navigate = useNavigate();

     const inputHandler = (e) =>{
        const {name,value} = e.target;
        if(e.target.name === "address"){
            console.log("This is address field.");

        }
        
        setUser({...user,[name]:value});
     };
     const submitForm = async(e)=>{
        e.preventDefault();
        await axios.post("http://localhost:8000/api/user",user)
        .then((response)=>{
            console.log("User created successfully.");
            navigate("/");

        })
        .catch((error)=>{
            console.log("User is not created.");
        })

     }

  return (
    <div className='addUser'>
        <Link className='backButton' to="/" type="button" class="btn btn-info">
        <i class="fa-solid fa-square-caret-left"> BACK</i>
        </Link>
        <h3>ADD NEW USER</h3>
        <form className='addUserForm'>
            <div className='inputGroup'>
                <label htmlFor='name'>Name: </label>
                <input
                type='text'
                id='name'
                name='name'
                onChange={inputHandler}
                autoComplete='off'
                placeholder='Enter your name'

                />
            </div>
            <div className='inputGroup'>
                <label htmlFor='email'>E-mail: </label>
                <input
                type='email'
                id='email'
                name='email'
                onChange={inputHandler}
                autoComplete='off'
                placeholder='Enter your email'

                />
            </div>
            <div className='inputGroup'>
                <label htmlFor='address'> Address: </label>
                <input
                type='text'
                id='address'
                name='address'
                onChange={inputHandler}
                autoComplete='off'
                placeholder='Enter your address'

                />
            </div>
            <div className='inputGroup' onClick={submitForm}>
                <button type="button" class="btn btn-primary">
                    Submit
                </button>
            </div>
        </form>

    </div>
  )
}
