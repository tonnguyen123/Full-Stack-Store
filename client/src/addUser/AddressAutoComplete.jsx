import React, { useState, useRef, useEffect } from 'react';
import axios from "axios";
import "./autoComplete.css";


const HERE_API_KEY = process.env.REACT_APP_MAP_API;
export default function AddressAutoComplete({ currUser,onSelect }) {
    const [addrQuery, setQuery] = useState("");
    const [suggestions, setSuggestions] = useState([]);
    const dropdownRef = useRef(null);
    
    useEffect(() => {
        if (currUser?.address) {
            setQuery(currUser.address);
        }
    }, [currUser.address]); 

    // Handle input change and fetch suggestions
    const handleSearch = async (e) => {
        const value = e.target.value;
        setQuery(value);
        console.log("auto "+ addrQuery);

        if (value.length > 2) {
            try {
                const response = await axios.get(
                    `https://autocomplete.search.hereapi.com/v1/autocomplete?q=${value}&apiKey=${HERE_API_KEY}`
                );
                setSuggestions(response.data.items);
            } catch (error) {
                console.log("error", error);
            }
        } else {
            setSuggestions([]);
        }
    };

    // Handle selecting a suggested address
    const handleSelect = (address) => {
        setQuery(address);  // Update input field
        onSelect(address);  // Pass selected address to parent component
        setSuggestions([]); // Hide suggestions
    };

    // Detect clicks outside the input box and suggestions list
    useEffect(() => {
        
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setSuggestions([]); // Hide suggestions when clicking outside
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [currUser.address]);

    return (
        <div className='addressSpace' ref={dropdownRef} style={{ position: "relative", width: "300px" }}>
            <input
                
                type="text" 
                value={addrQuery} 
                onChange={handleSearch} 
                placeholder= {currUser.address}

            />
            {suggestions.length > 0 && (
                <ul className='list'>
                    {suggestions.map((item, index) => (
                        <li className='item' key={index}>
                            <button className='ListButton'
                                onClick={() => handleSelect(item.address.label)} 
                                
                                onMouseEnter={(e) => e.target.style.background = "grey"}
                                onMouseLeave={(e)=> e.target.style.background = "white"}

                            >
                                {item.address.label}
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
