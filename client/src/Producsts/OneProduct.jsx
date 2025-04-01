import axios from 'axios';
import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router';
import {Link} from 'react-router-dom';
import "./oneProduct.css";

export const OneProduct = () => {
    const [product,setProd] = useState({id:"",title:"",price:"",description:"",
        category:"",discountPercentage:"",rating:"",stock:"",brand:"",sku:"",
        weight:"",dimensions:"",review:[]
    });

    
    
    const{sku,id} = useParams();
    
    console.log("Product ID:", id, "Type:", typeof id);
    const [quantity, setQty] = useState(1);
    console.log(sku);

 

    useEffect(() => {
      const fetchData = async () => {
          try {
              const res = await axios.get(`http://localhost:8000/api/product/${sku}`);
              setProd(res.data);
          } catch (error) {
              console.log("Error fetching product's data.");
          }
      };
  
      fetchData();
  }, [sku]);
  

    const ChangeQty = (type) =>{
        if(type === "plus"){
            setQty(quantity+1);
           
        }
        if (type === "minus"){
            if(quantity > 0){
                setQty(quantity-1);
            }
            
        } 
        console.log("quantity is " + quantity); 
    }

    const starRating = (starNum) => {
        let stars = [];
        let count = 0;
        while (starNum > 0) {
          if (starNum < 1) {
            stars.push(<i className="fa-regular fa-star-half-stroke" key={count}></i>);
            starNum--;
          } else {
            stars.push(<i className="fa-solid fa-star" key={count}></i>);
            starNum--;
          }
          count++;
        }
        const emptyStars = 5 - count;
        for (let i = 0; i < emptyStars; i++) {
          stars.push(<i className="fa-regular fa-star" key={count + i}></i>);
        }
        return <div>{stars}</div>;
      };

    const handleNumber = (e) => {
        const value = e.target.value;
        if (value === "" || /^[1-9]\d*$/.test(value)) {
            setQty(value === "" ? "" : parseInt(value));
        }
    };

    const AdditemToCart = async(item, event) => {
        event.stopPropagation(); // Prevent navigation
        event.preventDefault();  // Prevent default link behavior
        
        console.log(id);
        console.log(item.sku);
        
        try {
          console.log("I am in here");
          const response = await axios.put("http://localhost:8000/api/update/cart",{
            id: id,
            sku: item.sku,
            qty: quantity
          });
          console.log(response);
          
          
        } catch (error) {
          console.error("Error adding item to cart:", error);
        }
        
      
      };

    const checkStock = () =>{
        if(product.stock > 0){
            return true;
        }
        else{
            return false;
        }
    } 

    
  return (
    <div>
        <div className='topButtons'>
            <Link to = {'/items'}>
            <button >PRODUCTS</button>
            </Link>
            <Link to = {'/'}>
            <button>HOME</button>
            </Link>
       
        

        </div>
        
        <h1>{product.title} </h1>
        <h3># {product.sku}</h3>
        <div className='rating'>
        {starRating(product.rating)}
        <h5>{product.rating}</h5>
        </div>
      
       
        <img src={product.thumbnail} alt={product.title || 'Product image'} />

        <h5>${product.price}</h5>
        {
            checkStock() && id !== 'undefined' &&(
                <div>
            <button onClick={()=>ChangeQty("minus")}>-</button>
            <input type="number" min ="1" value={quantity}
            onChange={handleNumber}
            ></input>
            <button onClick={()=>ChangeQty("plus")}>+</button>
           
              <button onClick={(e) => AdditemToCart(product, e)}>Add to Cart</button>
            
            
        </div>
            )
        }
        
        <p>{product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}</p>
        <h3>Product description</h3>
        <p>{product.description}</p>
    </div>
  )
}

