import express from "express"
import { create, getAllItem, deleteUser, getAllUser, getUserById, update, emailUser, uploadFile, createItem, getItemBySku, addItemToCart, removeItemFromCart, checkOut, TransactionHistory, getItemById, updateItem} from "../controller/userController.js"


const route  = express.Router();

route.post("/user",create);
route.post("/item",createItem);
route.get("/items",getAllItem);
route.get("/users",getAllUser);
route.get("/user/:id",getUserById);
route.get("/product/:sku",getItemBySku);
route.get("/itemID/:id",getItemById);
route.put("/update/user/:id",update);
route.put("/itemupdate/:sku",updateItem);
route.put("/update/cart",addItemToCart);
route.put("/removeItem/cart",removeItemFromCart);
route.put("/checkOut",checkOut);
route.get("/history/:id",TransactionHistory);
route.delete("/delete/user/:id",deleteUser);
route.post("/email",uploadFile, emailUser);


export default route;