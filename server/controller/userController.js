import User from "../model/userNode.js";

export const create = async(req,res) =>{
    try{
        const newUser = new User(req.body);
        const email = newUser.email;
        const userExist = await User.findOne({ email });

        if(userExist){
            return res.status(400).json({message:"This email was registered.Please register with a different email."});
        }
        const saveData = await newUser.save();
        res.status(200).json(saveData);

    }
    catch(error){
        res.status(500).json({ errorMessage: error.message });
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

export const getUserById = async(req,res)=>{
    try{

        const id = req.params.id;
        const userExist = await User.findById(id);
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


