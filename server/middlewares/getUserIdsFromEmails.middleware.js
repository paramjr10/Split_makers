import {User} from '../models/user.model.js'

export const getUserIdsFromEmails = async (req, res, next) => {
  try {
    const { members } = req.body;

    // Validate email format using a regular expression (optional)
    if (!members || !members.every(email => /\S+@\S+\.\S+/.test(email))) {
      throw new Error("Invalid email(s) provided. Please enter valid email addresses.");
    }

    // Efficiently retrieve user IDs using `find` with `in` operator
    const userIds = await User.find({ email: { $in: members } }).select('_id');

    // Check if all members were found
    if (userIds.length !== members.length) {
      const missingEmails = members.filter(email => !userIds.some(user => user.email === email));
      throw new Error(`Some members with emails [${missingEmails.join(', ')}] not found.`);
    }

    // Attach the user IDs to the request object
    req.userIds = userIds.map(user => user._id);
    console.log(req.userIds)

    next();
  } catch (error) {
    console.error("Error in getUserIdsFromEmails middleware:", error);
    res.status(400).json({ message: error.message });
  }
};



