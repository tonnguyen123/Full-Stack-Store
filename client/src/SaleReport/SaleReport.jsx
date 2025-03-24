import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { Chart as ChartJS } from 'chart.js/auto';
import axios from 'axios';


export const SaleReport = () => {
    const [users, setUser] = useState([]);
    const [saleArray, setArray] = useState([]);
    const [categoryArray, setCattogery] = useState([]);
    const [selectedOption, setOption] = useState('product');

    const navigate = useNavigate();

    // Fetch user data and process sales

    const handleChange =(e) =>{
        setOption(e.target.value);
    }

    // Process sales data from users
    const processSalesData = async (data) => {
        if (data.length === 0) {
            console.log("No data");
            setArray([]); // Reset array if no data
            return;
        }
    
        let newSales = [];
        let categories = [];

    
        try {
            for (const user of data) {
                if (Array.isArray(user.boughtItems)) {
                    for (const item of user.boughtItems) {
                        try {
                            // Fetch product details
                            const response = await axios.get(`http://localhost:8000/api/itemID/${item.item}`);
                            const productName = response.data.title; // Ensure API returns title
                            const productCategory = response.data.category;
                            newSales.push({
                                product: productName,
                                quantity: item.quantity
                            });

                            categories.push({
                                type: productCategory,
                                quantity: item.quantity
                            })
                        } catch (error) {
                            console.error(`Error fetching product name for item ${item.item}:`, error);
                        }
                    }
                }
            }
    
            setArray(newSales); // Update state after all API calls
            setCattogery(categories);
        } catch (error) {
            console.error("Error processing sales data:", error);
        }
    };
    

    // Log when saleArray updates
    

    useEffect(() => {
        const fetchDat = async () => {
            try {
                const res = await axios.get("http://localhost:8000/api/users");
                if (Array.isArray(res.data)) {
                    setUser(res.data);
                    processSalesData(res.data);
                } else {
                    console.error("Data is not an array:", res.data);
                    setUser([]);
                    setArray([]); // Reset sales array
                }
            } catch (error) {
                console.log("Error while fetching data.", error);
                setUser([]);
                setArray([]); // Reset sales array
            }
        };
    
        fetchDat();
    }, []); // Empty dependency array to run only once on mount
    

    // Chart data based on saleArray
    const chartData = {
  
        labels: [...new Set(saleArray.map(item => item.product))], // Unique product names
        datasets: [
            {
                label: 'Sales',
                data: saleArray.reduce((acc, item) => {
                    acc[item.product] = (acc[item.product] || 0) + parseInt(item.quantity);
                    return acc;
                }, {}),
                backgroundColor: 'rgba(54, 162, 235, 0.6)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1,
            },
        ],
    };

    const chartData2 = {
        labels: [...new Set(categoryArray.map(item => item.type))],
        datasets:[
            {
                label:'Sales',
                data: categoryArray.reduce((acc,item)=>{
                    acc[item.type] = (acc[item.type] || 0) + parseInt(item.quantity);
                    return acc;
                } , {}),
                backgroundColor: 'rgba(54, 162, 235, 0.6)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1,
            }
        ]
        
    }



    // Chart options
    // Chart options
// Chart options with bold axis titles
const options = {
    responsive: true,
    scales: {
        x: {
            title: {
                display: true,
                text: 'Product', // Set the x-axis title
                font: {
                    weight: 'bold', // Make the x-axis title bold
                },
            },
        },
        y: {
            beginAtZero: true,
            title: {
                display: true,
                text: 'Sold Quantity', // Set the y-axis title
                font: {
                    weight: 'bold', // Make the y-axis title bold
                },
            },
        },
    },
};


const options2 = {
    responsive: true,
    scales: {
        x: {
            title: {
                display: true,
                text: 'Category', // Set the x-axis title
                font: {
                    weight: 'bold', // Make the x-axis title bold
                },
            },
        },
        y: {
            beginAtZero: true,
            title: {
                display: true,
                text: 'Sold Quantity', // Set the y-axis title
                font: {
                    weight: 'bold', // Make the y-axis title bold
                },
            },
        },
    },
};


    return (
        <div style={{ width: '600px', margin: 'auto', textAlign: 'center' }}>
            <div style={{gap:'10px', display:'flex', justifyContent:'center'}}>
            <Link button type="button" class="btn btn-success"  onClick={() => navigate('/')}> 
             <i class="fa-solid fa-house"></i>
            Home
            </Link>
            <Link>
            <button type="button" class="btn btn-primary" onClick={() => navigate(`/items`)}>
             <text style={{marginRight:'5px'}}>Product Page</text>
             <i class="fa-brands fa-product-hunt"></i>               

                        </button>
                        </Link>

            </div>
            
            
            <h1>Product Sales Chart</h1>
            <div style={{ gap:'10px', marginBottom:'40px', alignItems:'center'}}>
            <label style={{fontWe: 'bold'}}>Select the type of report sort by:</label>
            <select value={selectedOption} onChange={handleChange}>
                <option value="product">product</option>
                <option value="category">category</option>
            </select>
            </div>
            
            {
                selectedOption === 'product' && (
                    <Bar data={chartData} options={options} />
                )
                 

            }
            {
                selectedOption === 'category' && (
                    <Bar data={chartData2} options={options2} />
                )
            }
           
        </div>
    );
}