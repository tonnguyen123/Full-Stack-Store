import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
    rating:{type: Number},
    comment:{type: String},
    date:{type: Date},
    reviewerName:{type:String},
    reviewerEmail:{type:String},
});


const itemSchema = new mongoose.Schema({
    id:{
        type: Number,
       
    },
    title:{
        type:String,
     
    },
    price:{
        type: Number,
   
    },
    description:{
        type:String,
     
    },
    category:{
        type:String,
    
    },
    discountPercentage:{
        type:Number,
      
    },
    rating:{
        type:Number,
    
    },
    stock:{
        type:Number,
   
    },
    brand:{
        type:String,
     
    },
    
    sku:{
        type:String,
     
    },
    weight:{
        type:Number,
     
    }, 
    dimensions:{
        width:{type: Number},
        height:{type: Number},
        depth:{type:Number}
    },
    review: [reviewSchema],
    image:[{type:String}],
    thumbnail:{type:String},

    
});

const Item = mongoose.model("Item", itemSchema);
export default Item;