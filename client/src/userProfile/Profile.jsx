import React, { useEffect, useState, useRef } from 'react';
import axios from "axios";
import JsBarcode from "jsbarcode";
import { useParams, Link, useNavigate  } from 'react-router-dom';
import './profile.css';
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export const Profile = () => {
  const {id} = useParams();
  const barcodeRef = useRef(null);
  const [barcodeVal, setBarcode] = useState("");
  const [user,setUser] = useState({name:"", email:"", address:"", phone:"",  memberNum:"", points:""});
  const [emailTitle, setTitle] = useState('');
  const [emailBody, setBody] = useState('');
  const [showEmailWindow, setShow] = useState(false);
  const [file, setFile] = useState(null);
  const [showTransaction, setShowTransaction] = useState(false);
  const [transactions, setTransaction] = useState([]);
  const navigate = useNavigate();

  
  const generateRecipt = async (transactionsOnDate) => {
    if (!transactionsOnDate || transactionsOnDate.length === 0) {
      console.error("No transactions available for receipt generation!");
      return;
    }
  
    const wrapperId = `receipt-container-${transactionsOnDate[0].id}`;
    let content = document.getElementById(wrapperId);
  
    if (!content) {
      console.error("Transaction container not found!");
      return;
    }
  
    content.style.fontSize = "12px";
    content.style.lineHeight = "1.5";
  
    const buttons = content.querySelectorAll(".TransactionButtons");
    buttons.forEach((button) => (button.style.display = "none"));
  
    await Promise.all(
      Array.from(content.querySelectorAll("img")).map((img) => {
        return new Promise((resolve) => {
          if (!img.complete) {
            img.onload = resolve;
            img.onerror = resolve;
          } else {
            resolve();
          }
        });
      })
    );
  
    setTimeout(async () => {
      try {
        const canvas = await html2canvas(content, { scale: 3, useCORS: true });
        const imgData = canvas.toDataURL("image/png");
  
        const doc = new jsPDF("p", "mm", "a4");
        doc.addImage(imgData, "PNG", 10, 10, 180, 120);
        doc.save(`Receipt_${transactionsOnDate[0].id}.pdf`);
      } catch (error) {
        console.error("Error generating PDF:", error);
      } finally {
        buttons.forEach((button) => (button.style.display = "block"));
      }
    }, 500);
  };
  
  

  
  
  
  const showHistory = async () => {
    if(showTransaction === false){
      setShowTransaction(true);
    }
    else if (showTransaction === true){
      setShowTransaction(false);
    }
    
    try {
      const historyRes = await axios.get(`http://localhost:8000/api/history/${id}`);
      if (!historyRes.data) {
        alert("There is no history of purchase made by this customer.");
        return;
      }
      
      const transactionsWithItems = await Promise.all(
        historyRes.data.map(async (transaction) => {
          const itemRes = await axios.get(`http://localhost:8000/api/itemID/${transaction.item}`);
          return {
            ...transaction,
            itemDetails: itemRes.data,
          };
        })
      );
  
      setTransaction(transactionsWithItems);
    } catch (error) {
      console.error("Error fetching transaction history:", error);
    }
  };
  

  const inputHandler = (e) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  const handleSend = async () => {
    setShow(false);
  
    const formData = new FormData();
    formData.append("email", user.email);
    formData.append("subject", emailTitle);
    formData.append("message", emailBody);
  
    if (file) {
      formData.append("attachment", file);
    }
  
    try {
      await axios.post("http://localhost:8000/api/email", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert(`Email sent to ${user.name} at ${user.email}`);
    } catch {
      alert("Error sending email");
    }
  };
 const groupReceiptbyDate = () => {
  const groupedByDate = {};
  transactions.forEach((item) => {
    const dateInfo = item.purchaseDate.split("T")[0];
    if(!groupedByDate[dateInfo]){
      groupedByDate[dateInfo] = [];
    }
    groupedByDate[dateInfo].push(item);
  })
  return groupedByDate;

 }

 

 console.log(groupReceiptbyDate());





  const handleFile = (e) =>{
    const chosenFile = e.target.files[0];
   setFile(chosenFile);

  }





  useEffect(() => {
    const fetchData = async () => {
      try {
        const currUser = await axios.get(`http://localhost:8000/api/user/${id}`);
        setUser(currUser.data);
        setBarcode(currUser.data.memberNum);
        console.log(user.memberNum);
      } catch {
        console.log("Error showing user's profile");
      }
    };
  
    fetchData();
  }, [id, user.memberNum]);  // Add user.memberNum to the dependency array
  
  
  


  useEffect(() => {
    if (barcodeRef.current && barcodeVal) {
      JsBarcode(barcodeRef.current, barcodeVal, {
        format: "CODE128",
        displayValue: true,
        lineColor: "black",
        width: 2,
        height: 60,
      });
    }
  }, [barcodeVal]); 



  return (
    <div>
      <div style={{ textAlign: "center", margin: "20px" }}>
      <h3>{user.name}'s Loyalty Barcode</h3>
      <svg ref={barcodeRef}>
      </svg>
      <p>Total Points: {user.points}</p>
      <div style={{marginBottom:'10px'}}>
      <Link>
      <button type="button" class="btn btn-primary" onClick={() => navigate(`/${id}/cart`)}>
        <i className="fa-solid fa-cart-shopping"></i>
        CART
      </button>
      </Link>
      </div>
      
      <Link className='backButton btn btn-info' to="/users">
        <i className="fa-solid fa-square-caret-left"> BACK</i>
      </Link>
      <div style={{marginTop:'10px'}}>
      <button
          type="button"
          className="btn btn-success"
          onClick={()=>setShow(true)}
      ><i class="fa-solid fa-square-envelope"> E-MAIL</i>
      </button>
      </div>
      <Link to ={`/products/${id}`}>
      <button button type="button" class="btn btn-warning" className='viewButton' style={{marginTop:'10px'}}>View Products</button>
      </Link>
      <div style={{marginTop:'10px'}}>
      <button style={{backgroundColor:'white', borderColor:'red', color:'red', 
      borderRadius: '5px', textAlign: 'center' 
     }}
     onMouseEnter={(e) => {
      e.target.style.backgroundColor = 'red';
      e.target.style.color = 'white';
    }}
    onMouseLeave={(e) => {
      e.target.style.backgroundColor = 'white';
      e.target.style.color = 'red';
    }}
    onClick={showHistory}
      >Transaction History</button>
      </div>

      {
        showEmailWindow && (
          <div className='Overlay'>
            <div className='EmailContent'>
              <button className='closeButton' onClick={() => setShow(false)}>
                X
              </button>
              <h6>To </h6>
             
              <input
              type='text' 
              className='userEmail' 
              value={user.email}
              onChange={inputHandler}
              ></input>
  
              <h6>Title </h6>
              <input 
              className='emailTitle'
              type='text'
              value={emailTitle}
              onChange={(e) => setTitle(e.target.value)}
              />

              
              <h6>Body</h6>
              <textarea
              className='emailBody'
              type='text'
              value={emailBody}
              onChange={(e) => setBody(e.target.value)}
              />

               <h6>File</h6>
            <input type="file" onChange={handleFile} />

             
             <div>
             
             <button
             className="btn btn-success" 
             onClick={()=> handleSend()}>
              <i class="fa-solid fa-paper-plane"></i>
            </button>

             </div>
           
            </div>

          </div>
        )
      }
      
      {showTransaction && 
  Object.entries(groupReceiptbyDate()).map(([date, transactionsOnDate]) => (
    transactionsOnDate.length > 0 && ( // Ensure array is not empty
      <div key={date} id={`receipt-container-${transactionsOnDate[0].id}`} className='purchasedItem'>
        <h2>Purchase Date: {new Date(date).toLocaleDateString()}</h2>
        <div className='TransactionButtons'>
          <button onClick={() => generateRecipt(transactionsOnDate)} style={{ marginRight: '10px' }}>Save as PDF</button>
        </div>

        {transactionsOnDate.map((transaction) => {
  const time = new Date(transaction.purchaseDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <div key={transaction.id} className="transactionDetails">
      <h3>{transaction.itemDetails?.title || "Unknown Item"}</h3>
      {transaction.itemDetails?.thumbnail && (
        <img src={transaction.itemDetails.thumbnail} alt={transaction.itemDetails.title} width="100" />
      )}
      <h4>Quantity sold: {transaction.quantity}</h4>
      <h4>Payment: ${transaction.quantity * transaction.itemDetails.price}</h4>
      <h4>Time: {time}</h4> {/* Show the extracted time */}
      <h4>___________________</h4>
    </div>
  );
})}


       
      </div>
    )
  ))
}





      </div>
      
     
</div>


  );
};

