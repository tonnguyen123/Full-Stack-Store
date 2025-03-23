import mongoose from "mongoose";


const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    address:{
        type:String,
        required:true
    },
    phone:{
        type:String,
        required: false
    },
    memberNum:{
        type: Number,
        required:true
    },
    points:{
        type:Number,
        required:true,
        default:0
    },
    cart:[
        {
            item:{type:mongoose.Schema.Types.ObjectId,
            ref:"Item"},
            quantity:{type:Number, default:1}

        }
     ],
    boughtItems:[{
        item:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Item"
        },
        purchaseDate: {
            type: Date,
            default: Date.now  // Automatically set purchase date
        },
        quantity:{type:Number, default:1}

    }]
   

})

export default mongoose.model("Users", userSchema)