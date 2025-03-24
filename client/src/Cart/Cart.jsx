import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import './cart.css';

export const Cart = () => {
    const { id } = useParams();
    console.log(id);
    const [itemsInCart, setCart] = useState([]);
    const [user,setUser] = useState();
    const[currPoints,setPoints] = useState(0);
    let OrderAmount = 0;

    
    

    const ChangeQty = async (type, itemId) => {
        setCart(prevCart =>
            prevCart.map(item => {
                if (item._id === itemId) {
                    const newQuantity = type === "plus" ? item.quantity + 1 : item.quantity - 1;
                    const updatedQuantity = Math.max(1, newQuantity);
    
                    axios.put("http://localhost:8000/api/update/cart", {
                        id,
                        itemId,
                        quantity: updatedQuantity
                    }).catch(err => console.error("Error updating quantity:", err));
    
                    return { ...item, quantity: updatedQuantity };
                }
                return item;
            })
        );
    };
    
    

    const handleNumber = (e, itemId) => {
        const value = e.target.value;
        setCart(prevCart => 
            prevCart.map(item => {
                if (item._id === itemId) {
                    return {
                        ...item,
                        quantity: value === "" ? "" : parseInt(value),
                    };
                }
                return item;
            })
        );
    };

    
    const removeItem = async (id, itemSKU) => {
        try {
            const response = await axios.put("http://localhost:8000/api/removeItem/cart", {
                id: id,
                sku: itemSKU
            });
    
            setCart(prevCart => prevCart.filter(item => item.item.sku !== itemSKU)); // Update state directly
    
            console.log("Cart updated:", response.data);
        } catch (error) {
            console.error("Error removing item from the cart:", error);
        }  
    };

    const processPayment = async()=>{
        return window.confirm("Do you want to process payment?");
        
    }

    const paywithPoints = async()=>{
        return window.confirm(`${user.name} has ${user.points} equal to $${user.points/100} Do you want to process payment with points?`);
    }

    const checkOut = async () => {
        const updatedCheckouts = [...itemsInCart];
        console.log("Check out list is " + updatedCheckouts);
        const confirmation = await processPayment();
        let startPoints = currPoints;

        if(!confirmation){
            return;
        }
            try {
                console.log("processing");
                console.log("Type of points is " + typeof currPoints);
                console.log("Total amount is " + OrderAmount);
                if (await paywithPoints()) { 
                    if (startPoints > OrderAmount * 100) {
                        startPoints -=  OrderAmount*100
                        
                        console.log("After payment, the points left is " + (startPoints));
                        setPoints(startPoints);
                        
                        console.log(startPoints);
                    }
                }
                
            
                const response = await axios.put("http://localhost:8000/api/checkOut", {
                    id: id,
                    items: updatedCheckouts,
                    points: startPoints,
                    pointsEarned: OrderAmount * 10
                });

                console.log("Checkout Success:", response.data);
                
                setCart([]);
                console.log("Points is " + currPoints);
            } catch (error) {
                console.error("Checkout Error:", error.response?.data || error.message);
            }
        
    };
    
    

    useEffect(() => {
        const fetchCart = async () => {
            try {
                const currUser = await axios.get(`http://localhost:8000/api/user/${id}`);
                setUser(currUser.data); 
                setPoints(currUser.data.points);
                setCart(currUser.data.cart);
            } catch (error) {
                console.log("Error getting items in the cart.");
            }
        };
        fetchCart();
    }, [id]);
    

    return (
        <div className="cartContainer">
            <div className='navigationButtons'>
            <Link className='backButton' to="/users" type="button" class="btn btn-info">
            <i class="fa-solid fa-house"></i>
             Home
            </Link>
            <Link to={`/products/${id}`} state={{ user: {_id:user?._id, cart: user?.cart || [] } }} type="button" className="btn btn-primary">
            <i class="fa-solid fa-store"></i>
            Products</Link>

            </div>
            

            {/* Checkout Box on Top Right */}
            <div className="checkout">
                <h2>Order Summary</h2>
                <p>Total Items: {itemsInCart.reduce((total, item) => total + item.quantity, 0)}</p>
                <p>Total Price: ${OrderAmount = itemsInCart.reduce((total, item) => total + item.item.price * item.quantity, 0)}</p>
                <button className="checkoutButton" onClick={checkOut}>Proceed to Checkout</button>
            </div>
    
            {/* Cart Items Below */}
            <div className="cartItems">
                {itemsInCart.map((itemInCart) => (
                    <div className="itemGrid" key={itemInCart._id}>
                        {itemInCart.item && (
                            <>
                                <img src={itemInCart.item.thumbnail} className="thumbnail" alt={itemInCart.item.title} />
                                <Link to={`/product/${itemInCart.item.sku}/${id}`}>{itemInCart.item.title}</Link>
                                <div className='qtyArea'>
                                    <button onClick={() => ChangeQty("minus", itemInCart._id)}>-</button>
                                    <input
                                        type="number"
                                        min="1"
                                        value={itemInCart.quantity}
                                        onChange={(e) => handleNumber(e, itemInCart._id)}
                                        className="qtyInput"
                                    />
                                    <button onClick={() => ChangeQty("plus", itemInCart._id)}>+</button>
                                </div>
                                <div className="PriceSection">
                                    <h3>Total Price</h3>
                                    <h3>${itemInCart.item.price * itemInCart.quantity}</h3>
                                </div>
                                <div>
                                    <button className="closeButton" onClick={() => removeItem(id, itemInCart.item.sku)}>Remove Item</button>
                                </div>
                            </>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
    

};
