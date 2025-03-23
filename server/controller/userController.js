import express from 'express';  // Use import instead of require
import User from "../model/userNode.js";
import Item from "../model/itemNode.js";
import sendEmail from "../sendEmail.js";
import multer from "multer";
import mongoose from 'mongoose';
import path from "path";
import { fileURLToPath } from 'url';

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

export const uploadFile = upload.single("attachment");
const router = express.Router();

const imageStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(process.cwd(), "uploads")); // process.cwd() instead of __dirname
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}${path.extname(file.originalname)}`);
    },
});


const uploadPic = multer({storage});

export const uploadPicture = async(req,res) =>{
    router.post("/upload", upload.single("image"), (req, res) => {
        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" });
        }
        const fileUrl = `http://localhost:8000/uploads/${req.file.filename}`;
        res.json({ url: fileUrl });
    });
}

export const create = async (req, res) => {
    
    try {
        const newUser = new User(req.body);
        const email = newUser.email;
        const userExist = await User.findOne({ email });

        if (userExist) {
            return res.status(400).json({ message: "This email was registered. Please register with a different email." });
        }
        const saveData = await newUser.save();
        res.status(200).json(saveData);

    } catch (error) {
        res.status(500).json({ errorMessage: error.message });
    }
};


export const createItem = async (req, res) => {
   
    try {
        const { id, title, price, description, category, discountPercentage, rating, stock, brand, sku, dimensions, review, image, thumbnail } = req.body;
        console.log("Title " + title + "," + "price is " +  price + ","
            + "stock is " + stock + "," + "sku is " + sku
        );

        const checkDuplicate = await Item.findOne({ sku, title });
        



        if (checkDuplicate) {
            return res.status(400).json({
                message: "Item already exists. Please change SKU and title of the product that you want to add."
            });
        }

        // Create new item
        const newItem = new Item({
            id,
            title,
            price,
            description,
            category,
            discountPercentage,
            rating,
            stock,
            brand,
            sku,
            dimensions,
            review,
            image,
            thumbnail
        });

        // Save item to MongoDB
        await newItem.save();

        res.status(201).json({
            message: "Item created successfully",
            item: newItem
        });

    } catch (error) {
        res.status(500).json({
            message: "Server Error",
            error: error.message
        });
    }
};

export const TransactionHistory = async(req,res) =>{
    try {
        const id = req.params.id;
        const user = await User.findById(id);
        const transaction = user.boughtItems;
        if(!transaction){
            return res.status(404).json({ message: "There is no transaction." });
        }
        return res.status(200).json(transaction);

    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }

}
export const checkOut = async(req, res)=>{
    try {
        const {id, items, points, pointsEarned} = req.body;
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }
        user.boughtItems.push(...items.map(item => ({
            item: item.item._id,
            quantity: item.quantity
        }))); 
        user.cart = [];
        user.points = parseInt(points + pointsEarned);
        await user.save();
        
        

        for(let i = 0; i < items.length; i++){
            let itemId = items[i].item;
            let soldQty = items[i].quantity;
            let CheckedOutItem = await Item.findOne({_id : itemId});
            CheckedOutItem.stock -= soldQty;
            await CheckedOutItem.save();
           


        }
        
        console.log("DONE");
        res.status(200).json("All done");

    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
        
    }
}

export const getCart = async(req, res)=>{
    try {
        
    } catch (error) {
        
    }
}




export const removeItemFromCart = async (req, res) => {
    try {
        const { id, sku } = req.body;

        if (!id || !sku) {
            return res.status(400).json({ message: "User ID and SKU are required." });
        }

        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        const item = await Item.findOne({ sku });
        if (!item) {
            return res.status(404).json({ message: "Item not found." });
        }

        const initialCartLength = user.cart.length;
        user.cart = user.cart.filter(cartItem => cartItem.item.toString() !== item._id.toString());

        if (user.cart.length === initialCartLength) {
            return res.status(404).json({ message: "Item not found in cart." });
        }

        await user.save();
        res.status(200).json({ message: "Item removed from cart successfully.", cart: user.cart });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

export const getItemById = async (req,res) =>{
    const ItemId = req.params.id;
    const item = await Item.findById(ItemId);

    if(!item){
        return res.status(404).json({message:"Item not found in database."});
    }
    return res.status(200).json(item);

}






export const addItemToCart = async (req, res) => {
    try {
        const { id, sku, qty } = req.body;

        if (!id || !sku || qty <=0) {
            return res.status(400).json({ message: "User ID and SKU are required" });
        }

        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        const item = await Item.findOne({ sku });
        if (!item) {
            return res.status(404).json({ message: "Item not found." });
        }

        let cartItem = user.cart.find(cartItem => cartItem.item.toString() === item._id.toString());

        if (cartItem) {
            cartItem.quantity +=qty ; // Ensure quantity is a number
        } else {
            user.cart.push({ item: item._id, quantity: qty });
        }

        await user.save();
        res.status(200).json({ message: "Cart updated successfully", cart: user.cart });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};








export const getAllUser = async(req,res)=>{
    try{
        const userData = await User.find();
        if(!userData || userData.length === 0){
            return res.status(404).json({message:"User data is empty."});
        }
        res.status(200).json(userData);

    }
    catch(error){
        res.status(500).json({ errorMessage: error.message });
    }

};

export const getAllItem = async(req,res) =>{
    try {
        const allItem = await Item.find();
        if(!allItem || allItem.length === 0){
            return res.status(404).json("Database for item is empty.");
        }
        res.status(200).json(allItem);
    } catch (error) {
        res.status(500).json({errorMessage:error.message});
        console.log("Error of fetching item data.");
    }
    

};

export const getUserById = async (req, res) => {
    try {
        const id = req.params.id;

        // Fetch the user and populate the cart items with their details (like title, price, etc.)
        const userExist = await User.findById(id).populate('cart.item'); // Populate the 'item' field in 'cart'

        if (!userExist) {
            return res.status(404).json({ message: "User not found with matching id." });
        }

        res.status(200).json(userExist);
    } catch (error) {
        res.status(500).json({ errorMessage: error.message });
    }
};




export const getItemBySku = async (req, res) => {
    try {
        const Sku = req.params.sku;
        const itemExist = await Item.findOne({ sku: Sku });

        if (!itemExist) {
            return res.status(404).json({ message: "No matching product was found." });
        }

        res.status(200).json(itemExist); 
    } catch (error) {
        res.status(500).json({ errorMessage: error.message });
    }
};

export const GetItemAndUser = async (req, res)=>{
    try {
        const Sku = req.params.sku;
        const userID =  req.params.id;
        const currItem = await Item.findOne({sku:Sku});
        const currUser = await User.findById(userID);

        if(!currItem || !currUser){
            return res.status(404).json({message:"Error adding item to cart for this user."});
        }
        res.status(200).json({currItem,currUser});
        
    } catch (error) {
        res.status(500).json({ errorMessage: error.message });
    }
};

export const getUserbyMemNum = async(req,res)=>{
    try{

        const memNum = req.params.memberNum;
        const userExist = await User.findOne({memberNum:memNum});
        if(!userExist){
            return res.status(404).json({message:"User not found with matching id."});
        }
        res.status(200).json(userExist);
    }
    catch(error){
        res.status(500).json({ errorMessage: error.message });
    }
};



export const update = async(req,res)=>{
    try{
        const id = req.params.id;
        const userExist = await User.findById(id);
        if(!userExist){
            return res.status(404).json({message:"User not found with matching id."});
        }
        const updateInfo = await User.findByIdAndUpdate(id,req.body,{
            new:true,
        });
        res.status(200).json(updateInfo);
 }
    catch(error){
        res.status(500).json({ errorMessage: error.message });
    }
};


export const updateItem = async(req,res) => {
    const sku = req.params.sku;
    const updatedItem = req.body;
    const item = await Item.findOne({sku});
    try {
        if(!item){
            return res.status(404).json({message:"Cannot find the item in the database."});
    
        }
        item.title = updatedItem.title;
        item.price = updatedItem.price;
        item.stock = updatedItem.stock;
        item.sku = updatedItem.sku;
        item.thumbnail = updatedItem.thumbnail;
    } catch (error) {
        res.status(500).json({ errorMessage: error.message });
    }
    
    await item.save();
    res.status(200).json({message:"Updated the information of the item."});

    

}


export const deleteUser = async(req,res)=>{
    try{
        const id = req.params.id;
        const userExist = await User.findById(id);
        if(!userExist){
            return res.status(404).json({message:"User not found with matching id."});
        }
        await User.findByIdAndDelete(id);
        res.status(200).json({message:"User deleted."})


 }
    catch(error){
        res.status(500).json({ errorMessage: error.message });
    }
};

export const emailUser = async (req,res) =>{
    
    try{
        const {email, subject, message} = req.body;
        let attachment = null;
        if(req.file){
            attachment = {
                name: req.file.originalname,
                type: req.file.mimetype,
                data: req.file.buffer.toString("base64"),
            };
        }
        await sendEmail(email, subject,message, attachment);
        res.status(200).send("Email sent successfully");
    }
    catch (error){
        res.status(500).send("Error sending email.");
    }
};




