import React from 'react';
import "./mainPage.css";
import { useNavigate } from 'react-router-dom';


export const MainPage = () => {
   const navigate = useNavigate();
  return (
    <div className='MainPage'> 
    <div className='pageTitle' style={{alignSelf:'center'}}>
          <h1>
          Ton's Store
          </h1>

    </div>

      <div className='buttons'>
        
      
      <button className='userButton' onClick={()=> navigate('/users')}>Manage Customers
      <i class="fa-solid fa-users"></i>
      </button>
      <button className='productButton' onClick={()=> navigate('/items')}>
        Manage Products
        <i class="fa-brands fa-product-hunt"></i>
      
      </button>

      </div>
      
     
    </div>
  )
}
