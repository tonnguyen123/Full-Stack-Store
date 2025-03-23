import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

export const UpdateProd = () => {
    const newItem = {
        title: '',
        price: '',
        stock: '',
        sku: '',
        category:'',
        thumbnail: ''
    };
    const [currItem, setItem] = useState(newItem);
    const {sku} = useParams();
    console.log("sku is "+ sku);


    const fetchItemInfo = async() =>{
        const item = await axios.get("http://localhost:8000/api/product/"+ sku);
        setItem(item.data);
    }

    useEffect(()=>{
        fetchItemInfo();
    }, [sku]);
    

    


    
    const navigate = useNavigate();

    const inputHandler = (e) => {
        const { name, value } = e.target;
        setItem({ ...currItem, [name]: value });
    };

    
    const submitForm = async (e) => {
        e.preventDefault();
        
        
        console.log("Title " + currItem.title + "," + "price is " +  currItem.price + ","
            + "stock is " + currItem.stock + "," + "sku is " + currItem.sku
        );

        

        try {
            await axios.put(`http://localhost:8000/api/itemupdate/${sku}`, currItem);
            navigate('/items');
        } catch (error) {
            console.error('Error adding product:', error.response?.data || error.message);
        }
    };

    return (
        <div className='addUser'>
            <Link className='backButton btn btn-info' to='/items' style={{marginBottom:'30px'}}>
                <i className='fa-solid fa-square-caret-left'> BACK</i>
            </Link>
            <h3>EDIT INFORMATION OF THE PRODUCT BELOW:</h3>
            <form className='addUserForm' onSubmit={submitForm} >
                <div style={{display:'flex', justifyContent:'center'}}>
                <img src={currItem.thumbnail} style={{ width:'180px', height:'180px', justifyContent:'center', display:'flex'}}/>
                </div>
               
                <div className='inputGroup'>
                    <label htmlFor='title'>Current name of product: </label>
                    <input value={currItem.title} type='text' id='title' name='title' onChange={inputHandler} placeholder='Enter product name' required />
                </div>
                <div className='inputGroup'>
                    <label htmlFor='price'> Current Price: </label>
                    <input value={currItem.price} type='number' id='price' name='price' onChange={inputHandler} placeholder='Enter price' required />
                </div>
                <div className='inputGroup'>
                    <label htmlFor='stock'>Current Stock: </label>
                    <input value={currItem.stock} type='number' id='stock' name='stock' onChange={inputHandler} placeholder='Enter stock' required />
                </div>
                <div className='inputGroup'>
                    <label htmlFor='sku'> Current SKU: </label>
                    <input value={currItem.sku} type='text' id='sku' name='sku' onChange={inputHandler} placeholder='Enter or scan SKU' required />
                </div>
                <div className='inputGroup'>
                    <label htmlFor='category'> Current Product's Category: </label>
                    <input value={currItem.category} type='text' id='category' name='category' onChange={inputHandler} placeholder='Enter image URL' />
                </div>
                <div className='inputGroup'>
                    <label htmlFor='thumbnail'> Current Thumbnail URL: </label>
                    <input value={currItem.thumbnail} type='text' id='thumbnail' name='thumbnail' onChange={inputHandler} placeholder='Enter image URL' />
                </div>
                
                
                <div className='inputGroup'>
                    <button type='submit' className='btn btn-primary'>Save</button>
                </div>
            </form>
        </div>
    );
};
