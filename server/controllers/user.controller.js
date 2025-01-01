import {
    User
} from '../models/user.model.js'




const registerUser = async (req, res,next) => {
    // fetch details
    // check if User existed
    // create  and save a new User 
    try {
        const {
            name,
            email,
            password,
        } = req.body;
    
        if ([name, email, password].some((field) => field?.trim() === "")) {
            throw new Error( "All fields are required")
        }
    
        //check if the email is already
        const existedUser = await User.findOne({email})
    
        if (existedUser) {
           throw new Error("user already existed with this email");
        }
    
        const user = await User.create({
            name,
            email,
            password
        })
    
        const createdUser = await User.findById(user._id).select("-password");
        if (!createdUser) {
            throw new Error('Something went wrong while creating user');
        }
    
        return res
            .status(201)
            .json(createdUser)
    } catch (error){
        return res.status(401).json({ message: error.message });
    }
}

const loginUser = async (req, res, next) => {
    try{
        const {
            email,
            password
        } = req.body;
    
        const user = await User.findOne({
            email
        });
    
        if (!user) {
            throw new Error("User doesn't exist")
        }
    
        const isPasswordvalid = await user.isPasswordCorrect(password)
    
        if (!isPasswordvalid) {
            throw new Error('Invalid Password')
        }
    
        const loggedInUser=await User.findById(user._id).select('-password');

        const expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + 30);

        return res
            .status(200)
            .cookie("id", user._id, { 
                expires: expiryDate,
                httpOnly: true,
                sameSite: 'None',
                secure: true
            })
            .json({ user: loggedInUser });
    }
    catch(err)
    {
        return res.status(401).json({ message: err.message });
    }
}





const getUserDetails = async(req, res, next)=>{
    return res.status(200).json({user : req.user})
}



async function getUserDetailsById(req, res) {
    try {
        const user = await User.findById(req.body.paidBy)

        if (!user) {
            return res.status(404).json({ message: "User not found" })
        }
        res.status(200).json(user);
    }
    catch (err) {
        console.log("Error :- ", err);
        res.status(500).json({ message: 'Error fetching group members' });
    }
}






const logout= async (req,res)=>{
    // await User.findByIdAndUpdate(req.user._id,{
    //     $set:{
    //         refreshToken:undefined
    //     }
    // },{
    //     new:true
    // })

    // const option = {
    //     httpOnly:true,
    //     secure:true
    // }

    return res
    .status(200)
    .clearCookie("id")
    .json(
        "user logged out successfully"
    )   
}

export {
    registerUser,
    loginUser,
    getUserDetails,
    logout,
    getUserDetailsById
}