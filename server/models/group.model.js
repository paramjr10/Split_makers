import mongoose, { Schema } from "mongoose";
const groupSchema = new mongoose.Schema(
    {
        name:{
            type:String,
            required:true
        },
        members:[
            {
                type:Schema.Types.ObjectId,
                ref:"User"
            }
        ],
        relations: [{
            user_id: {
              type: Schema.Types.ObjectId,
              ref: "User"
            },
            pending_owes: [{
              user_id: {
                type: Schema.Types.ObjectId,
                ref: "User"
              },
              amount: Number
            }]
          }]
    }
)

export const Group = mongoose.model("Group", groupSchema)