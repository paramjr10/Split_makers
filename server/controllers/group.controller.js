import { Group } from "../models/group.model.js";
import { User } from "../models/user.model.js";
import { getUserIdsFromEmails } from '../middlewares/getUserIdsFromEmails.middleware.js'

const createGroup = async (req, res) => {
    try {
        const {
            name
        } = req.body

        // Throw error if group name field is empty or empty string
        if (!name || name.trim() === "") {
            throw new Error("Group name is required");
        }
        // Ensure middleware has added user IDs to request object
        if (!req.userIds) {
            throw new Error("User IDs not found in request");
        }
        // for adding logged in user's own id.##VERY IMPORTANT
        const userId = req.cookies.id;
        if (!req.userIds) {
            req.userIds = [];
        }
        req.userIds.push(userId);
        // check if group is already exists
        const existedGroup = await Group.findOne({ name })

        if (existedGroup) {
            throw new Error("Group already existed with this name");
        }

        const pending_owes = req.userIds.map(userId => ({
            user_id: userId,
            amount: 0
        }))

        const initialRelations = req.userIds.map(userId => ({
            user_id: userId,
            pending_owes: pending_owes
        }));

        const group = await Group.create({
            name,
            members: req.userIds,
            relations: initialRelations
        })


        // update new group in each member's groups array (into userSchema)
        for (const userId of req.userIds) {
            const user = await User.findById(userId);
            if (user) {
                user.groups.push(group._id);
                await user.save();
            } else {
                // Handle case where member does not exist
                console.log(`Member with id ${userId} does not exist. Invite him/her on Bill Buddy first.`);
                res.json({ message: `Member with id ${userId} does not exist. Invite him/her on Bill Buddy first.` })
            }
        }

        res.status(201).json({ message: "New group created successfully" })
    }
    catch (err) {
        console.log("Error occured :- ", err);
        res.status(500).json({ message: "Server error" })
    }
}

const fetchGroups = async (req, res, next) => {
    const id = req.cookies.id;
    console.log(id);
    if (!id) {
        return res.status(400).json({ error: 'User ID not found in cookies' });
    }

    try {
        const user = await User.findById(id).select("-password").populate('groups')
            .catch(error => console.error('Populate error:', error))
        if (!user) {
            return res.status(404).json({ error: 'User or groups not found' });
        }
        console.log("user :- ", user)
        res.status(200).json({ user: { ...user, groups: user.groups } });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
}

async function getGroupNameAndMembersById(req, res) {
    const { groupId } = req.params;
    // console.log(groupId);
    try {
        const group = await Group.findById(groupId).populate('members');

        if (!group) {
            return res.status(404).json({ error: 'Group not found' });
        }
        //   console.log("Group name :- ", group.name)
        console.log("Group members :- ", group.members)
        return res.status(200).json({ groupname: group.name, members: group.members });
    } catch (error) {
        console.error('Error fetching group name:', error);
        res.status(500).json({ error: 'Server error' });
    }
}

async function getMemberNames(req, res) {
    try {

        const group = await Group.findById(req.params.groupId).populate('members');

        if (!group) {
            return res.status(404).json({ message: 'Group not found' });
        }
        const memberNames = group.members.map(member => member.name);
        res.status(200).json(memberNames);
    }
    catch (err) {
        console.log("Error :- ", err);
        res.status(500).json({ message: 'Error fetching group members' });
    }
}

async function addNewMembers(req, res) {
    const { groupId } = req.params;
    const { members } = req.body;
    console.log(members);

    try {
        // Find the group by ID
        const group = await Group.findById(groupId);

        if (!group) {
            return res.status(404).json({ message: 'Group not found' });
        }

        // Find users by their emails
        const users = await User.find({ email: { $in: members } });
        console.log("users:=", users)
        // Add user objects to the group's members array
        group.members = [...group.members, ...users.map(user => user._id)];
        console.log("group.members:=", group.members)

        // Update the group's relations array for each new member
        users.forEach(user => {
            // Update the relations array for the new member
            const newMemberRelation = {
                user_id: user._id,
                pending_owes: group.members.map(memberId => ({
                    user_id: memberId,
                    amount: 0 // Assuming the initial amount owed is 0
                }))
            };
            group.relations.push(newMemberRelation);

            // Update the relations array for each existing member to include the new member as a pending owe
            group.members.forEach(memberId => {
                if (memberId !== user._id) {
                    const existingMemberRelation = group.relations.find(relation => relation.user_id.equals(memberId));
                    if (existingMemberRelation) {
                        existingMemberRelation.pending_owes.push({
                            user_id: user._id,
                            amount: 0 // Assuming the initial amount owed is 0
                        });
                    } else {
                        group.relations.push({
                            user_id: memberId,
                            pending_owes: [{
                                user_id: user._id,
                                amount: 0 // Assuming the initial amount owed is 0
                            }]
                        });
                    }
                }
            });
        });

        // update new group's information in the user schema as well
        users.forEach(user => {
            user.groups.push(group._id);
            user.save(); // Save the user document to update the groups array
        });
        // Save the updated group
        await group.save();

        res.status(201).json({ message: 'Members added successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred while adding members' });
    }

}

async function getPendingAmount (req, res) {
    const { groupId } = req.params;
    const id = req.cookies.id; // Assuming you have a cookie named 'userId'
    console.log(id);

    try {
        // Find the group by groupId
        const group = await Group.findById(groupId);

        if (!group) {
            return res.status(404).json({ message: 'Group not found' });
        }

        // Find the relation with user_id = userId
        const relation = group.relations.find(relation => relation.user_id.equals(id));

        if (!relation) {
            return res.status(404).json({ message: 'Relation not found' });
        }

        // Return the pending_owes in the response
        res.status(200).json(relation.pending_owes);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
}

export {
    createGroup,
    fetchGroups,
    getGroupNameAndMembersById,
    getMemberNames,
    addNewMembers,
    getPendingAmount
}