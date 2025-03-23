import './App.css';
import { User } from './getuser/User';
import { AddUser } from './addUser/AddUser';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { Update } from './updateUser/Update';
import { Profile } from './userProfile/Profile';
import { OneProduct } from './Producsts/OneProduct';
import { Product } from './Producsts/Product';
import { Cart } from './Cart/Cart';
import { MainPage } from './Main Page/MainPage';
import { Items } from './Products/Items';
import { AddProduct } from './addProducts/AddProduct';
import { SaleReport } from './SaleReport/SaleReport';
import { UpdateProd } from './updateProduct/UpdateProd';


function App() {
  
  
  const route = createBrowserRouter([
    {
      path:"/",
      element:<MainPage/>,
    }, 
    {
      path:"/items",
      element:<Items/>
    },
    {
      path:"/users",
      element:<User/>
    },
    {
      path:"/add",
      element:<AddUser/>,
    },
    {
      path:"/update/:id",
      element:<Update/>,
    },
    {
      path:"/profile/:id",
      element:<Profile/>,
    },
    {
      path:"/product/:sku/:id",
      element:<OneProduct/>
    },
    {
      path:"/products/:id",
      element:<Product/>
    },
    {
      path:"/:id/cart",
      element:<Cart/>
    },
    {
      path:"/addproduct",
      element:<AddProduct/>
      
    },
    {
      path:"/salereport",
      element:<SaleReport/>
    },
    {
      path:"/updateproduct/:sku",
      element:<UpdateProd/>
    }
  ])
  return (
    <div className="App">
      <RouterProvider router={route}>
      </RouterProvider>
     
    </div>
  );
}

export default App;
