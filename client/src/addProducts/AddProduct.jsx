import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

export const AddProduct = () => {
    const newItem = {
        title: '',
        price: '',
        stock: '',
        sku: '',
        category:'',
        thumbnail: ''
    };
    const [newProduct, setItem] = useState(newItem);

    


    
    const navigate = useNavigate();

    const inputHandler = (e) => {
        const { name, value } = e.target;
        setItem({ ...newProduct, [name]: value });
    };

    const fileHandler = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
    
        const formData = new FormData();
        formData.append("image", file);
    
        try {
            const res = await axios.post("http://localhost:8000/api/upload", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
    
            setItem({ ...newProduct, thumbnail: res.data.url });
        } catch (error) {
            console.error("Error uploading image:", error.response?.data || error.message);
        }
    };

    const submitForm = async (e) => {
        e.preventDefault();
        
        console.log(`Title: ${newProduct.title}, Price: ${newProduct.price}, Stock: ${newProduct.stock}, SKU: ${newProduct.sku}`);
    
        try {
            await axios.post('http://localhost:8000/api/item', newProduct);
            navigate('/items');
        } catch (error) {
            console.error('Error adding product:', error.response?.data || error.message);
        }
    };
    

    return (
        <div className='addUser'>
            <Link className='backButton btn btn-info' to='/items'>
                <i className='fa-solid fa-square-caret-left'> BACK</i>
            </Link>
            <h3>ADD NEW PRODUCT</h3>
            <form className='addUserForm' onSubmit={submitForm}>
                <div className='inputGroup'>
                    <label htmlFor='title'>Name of product: </label>
                    <input type='text' id='title' name='title' onChange={inputHandler} placeholder='Enter product name' required />
                </div>
                <div className='inputGroup'>
                    <label htmlFor='price'>Price: </label>
                    <input type='number' id='price' name='price' onChange={inputHandler} placeholder='Enter price' required />
                </div>
                <div className='inputGroup'>
                    <label htmlFor='stock'>Stock: </label>
                    <input type='number' id='stock' name='stock' onChange={inputHandler} placeholder='Enter stock' required />
                </div>
                <div className='inputGroup'>
                    <label htmlFor='sku'>SKU: </label>
                    <input type='text' id='sku' name='sku' onChange={inputHandler} placeholder='Enter or scan SKU' required />
                </div>
                <div className='inputGroup'>
                    <label htmlFor='category'>Product's Category: </label>
                    <input type='text' id='category' name='category' onChange={inputHandler} placeholder='Enter image URL' />
                </div>
                <div className='inputGroup'>
                    <label htmlFor='thumbnail'>Thumbnail URL: </label>
                    <input type='text' id='thumbnail' name='thumbnail' onChange={inputHandler} placeholder='Enter image URL' />
                </div>
                
                <div className='inputGroup'>
                    <label>Or Upload Thumbnail: </label>
                    <input type='file' accept='image/*' onChange={fileHandler} />
                </div>
                <div className='inputGroup'>
                    <button type='submit' className='btn btn-primary'>Submit</button>
                </div>
            </form>
        </div>
    );
};
