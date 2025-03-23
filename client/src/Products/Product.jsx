import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom"; 
import "./product.css";

export const Product = () => {
  const [productArray, setArray] = useState([]);
  const [categories, setCategory] = useState([]);
  const [currUser,setUser] = useState();
  const [Cart,setCart] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);


  const navigate = useNavigate();
  const {id} = useParams();

 
  
  const location = useLocation();
  const user = location.state?.user || { _id: null, cart: [] };
  const [cartCount, setCartCount] = useState(user.cart?.length || 0);



  const fetchItems = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/items");
      setArray(res.data);
      const uniqueCategories = new Set(res.data.map((product) => product.category));
      setCategory([...uniqueCategories]);
    } catch (error) {
      console.error("Error fetching items:", error);
    }
  };








  useEffect(() => {
    fetchItems();
    
    
  }, []);

  const getCartCount = async() =>{
    const userCart = await axios.get(`http://localhost:8000/api/cart/${user._id}`);
    let cartSize = userCart.data.length;
    if(cartSize > 0){
      setCartCount(cartSize);
    }
    else{
      
    }
   

 }
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
        qty:1
      });
      console.log("Cart updated:", response.data);
      setCartCount(cartCount+1);
      
    } catch (error) {
      console.error("Error adding item to cart:", error);
    }
    
  
  };

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


  const filterProducts = (userInput) =>{
    if(!userInput){
      setFilteredProducts([]);
      return;

    }
    const matches = productArray.filter((product)=>
    product.title.toLowerCase().includes(userInput.toLowerCase())
    );
    setFilteredProducts(matches);

  };

  return (
    <div className="container">
      <div className="topBar">
      <div className="ProfilePageButtons">
      <Link button type="button" class="btn btn-success"  onClick={() => navigate('/')}> 
          <i class="fa-solid fa-house"></i>
            Home
      </Link>
      <button
           onClick={() => navigate(`/addproduct`)}
            type="button"
            className="btn btn-info"
        > 
          <text>Add New Product </text>
          
          <i class="fa-solid fa-square-plus"></i>
      </button>
      <Link>
            <button type="button" class="btn btn-primary" onClick={() => navigate(`/salereport`)}>
            <text style={{marginRight:'5px'}}>Sale Report</text>
            <i class="fa-solid fa-chart-simple"></i>
            
              
            
            </button>
            </Link>
      </div>

      <div className="searchBox">
        <input placeholder="Enter name of item to search"
        value={searchTerm}
        onChange={(e) =>{
          setSearchTerm(e.target.value);
          filterProducts(e.target.value);
        }}
        ></input>
        {filteredProducts.length > 0 && (
          <ul className="search-dropdown">
            {filteredProducts.map((product)=>(
              <li key={product._id} onClick={() => navigate(`/product/${product.sku}/${id}`)}>
                {product.title}
              </li>
            ))}
          </ul>

        )}
      </div>
      </div>

      {categories.map((category) => (
        <div key={category} className="category-section">
          <h1>{category}</h1>
          <div className="products-grid">
            {productArray

              .filter((product) => product.category === category)
              .map((product) => (
                <div key={product._id} className="item">
                  <Link to={`/product/${product.sku}/${id}`} state={{ user }}>
                    <img src={product.thumbnail} alt={product.title} />
                    <h4>{product.title}</h4>
                    <h5>Rating: {product.rating}</h5>
                    {starRating(product.rating)}
                    <h5>$ {product.price}</h5>
                  </Link>
                  <Link to={`/updateproduct/${product.sku}`}>
                  <button type="button" class="btn btn-warning" >
                    <text style={{marginRight:'10px'}}>Edit</text>
                  <i class="fa-solid fa-plus-minus"></i>
                  </button>
                  
                  </Link>
                
                  <h5>{product.stock > 0 ? `${product.stock} in stock` : "Out of stock" }</h5>
                </div>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
};