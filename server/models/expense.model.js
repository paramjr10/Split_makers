import mongoose, { Schema } from "mongoose";

const expenseSchema = new mongoose.Schema(
    {
        group: {
            type: Schema.Types.ObjectId,
            ref: "Group",
            required: true
        },
        paidBy: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        totalAmount:{
            type: Number,
        },
        involved_users: [{
            user_id: {
              type: Schema.Types.ObjectId,
              ref: 'User', 
              required: true
            },
            amount_owes: {
              type: Number,
              required: true
            }
          }],
        description:{
            type: String,
            required: true
        },
        createdAt: {
          type: Date,
          default: Date.now 
        }
    }
)

export const Expense = mongoose.model("expense", expenseSchema)