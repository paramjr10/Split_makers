import { Group } from "../models/group.model.js";
// import { User } from "../models/user.model.js";
import { Expense } from "../models/expense.model.js";



const addExpense = async (req, res) => {
    try {
        const {
            groupId,
            description,
            amount,
            paidBy,
            involved_members
        } = req.body;
        console.log(involved_members)
        const individualAmount = amount / involved_members.length;

        // Fetch the group document
        const group = await Group.findById(groupId);

        if (!group) {
            throw new Error("Group not found");
        }

        // Iterate over the relations to find the one with user_id = paidBy
        const relation = group.relations.find(relation => relation.user_id.equals(paidBy._id));

        if (!relation) {
            throw new Error("Relation not found");
        }

        // Iterate over the involved_members and update the pending_owes array
        for (const member of involved_members) {
            const oweEntry = relation.pending_owes.find(owe => owe.user_id.equals(member._id));

            if (oweEntry) {
                oweEntry.amount += individualAmount; // Update the amount
            } else {
                throw new Error("Member not found in pending_owes");
            }
        }
        await group.save();

        // update in involved_members

        for (const member of involved_members) {
            const relation = group.relations.find(relation => relation.user_id.equals(member._id));

            if (!relation) {
                throw new Error("Relation not found");
            }
            const oweEntry = relation.pending_owes.find(owe => owe.user_id.equals(paidBy._id));

            if (oweEntry) {
                oweEntry.amount -= individualAmount; // Update the amount owed by the paidBy user to each member
            } else {
                throw new Error("PaidBy user not found in pending_owes");
            }
        }
        await group.save();

        
        // Create the expense
        const response = await Expense.create({
            paidBy: paidBy,
            description: description,
            involved_users: involved_members.map(member => ({
                user_id: member,
                amount_owes: individualAmount
            })),
            group: groupId,
            totalAmount: amount
        });

        if (!response) {
            throw new Error("Server Error");
        }

        res.status(201).json({ message: "Inserted successfully!" });
    } catch (err) {
        console.log("Error :", err);
        res.status(500).json({ message: "Server error" });
    }
};


const getExpenseHistory = async (req, res) => {
    try {

        const groupId = req.params.groupId;

        const expenses = await Expense.find({ group: groupId }).sort({ createdAt: -1 });


        if (expenses.length === 0) {
            return res.status(404).json({ message: 'No expenses found for this group' });
        }

        res.status(200).json(expenses);
    } catch (error) {
        console.error('Error fetching expenses:', error);
        res.status(500).json({ message: 'Server error' });
    }
};


export {
    addExpense,
    getExpenseHistory
}

