import React, { useState } from 'react';
import "./adduser.css";
import { Link, useNavigate } from 'react-router-dom';
import axios from "axios";
import AddressAutoComplete from './AddressAutoComplete';


export const AddUser = () => {
    
    const users = {
        name: "",
        email:"",
        address:"",
        phone:"",
     };
     const [user, setUser] = useState(users);
     
     const navigate = useNavigate();

     const inputHandler = (e) => {
        const { name, value } = e.target;
    
        if (name === "phone") {
            // Remove non-numeric characters and restrict to 12 digits
            const numericValue = value.replace(/\D/g, "").slice(0, 12); // Only keep up to 12 digits
            setUser({ ...user, [name]: numericValue });
        } else {
            setUser({ ...user, [name]: value });
        }
    };
     const submitForm = async(e)=>{
        e.preventDefault();
        if(user.address.trim() === "" || user.email.trim() === "" || user.name.trim() === "" ||  isNaN(user.phone) || user.phone.length > 12 ){
            alert("Please make sure to fill all information properly to add new user.");
            return; // Stop function execution
        }


        const memNum = Math.floor(100000000000 + Math.random() * 900000000000).toString();
        setUser({ ...user, memberNum : memNum });
        
        await axios.post("http://localhost:8000/api/user",user)
        .then((response)=>{
            console.log(user.memberNum);
            console.log("User created successfully.");
            console.log(user.phone);
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
                <label htmlFor='phone'>Phone Number: </label>
                <input
                type='tel'
                id='phone'
                name='phone'
                onChange={inputHandler}
                autoComplete='off'
                maxLength="12"
                pattern="\d{1,12}"  
                placeholder='Enter your phone number'

                />
            </div>
            <div className='inputGroup'>
                <label htmlFor='address'> Address: </label>
                <AddressAutoComplete 
                currUser={user}
                onSelect = {(selectedAdd) =>
                setUser((prevUser) => ({...prevUser, address:selectedAdd}))

                }/>
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
