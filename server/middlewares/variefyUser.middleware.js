import { User } from "../models/user.model.js"


export const variefyUser = async (req, res, next) => {
    try{
        // console.log(req.cookies);
        const id = req.cookies.id
        // console.log(id);
        if(!id)
        {
            throw new Error("Unauthorized Request.")
        }
    
        const user = await User.findById(id).select("-password")
        if(!user)
        {
            throw new Error("User Doesn't exist.")
        }
    
        req.user = user
        console.log("authentication succeess");
        next();
    }
    catch(error)
    {
        return res.status(401).json({ message: error.message });
    }
}
// export default variefyUser