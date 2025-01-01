import { Router } from "express";
import { getUserDetails, getUserDetailsById, loginUser, logout, registerUser } from "../controllers/user.controller.js";
import {variefyUser} from "../middlewares/variefyUser.middleware.js";
import {getUserIdsFromEmails} from "../middlewares/getUserIdsFromEmails.middleware.js";
import { addNewMembers, createGroup, fetchGroups, getMemberNames, getPendingAmount } from "../controllers/group.controller.js";

import { getGroupNameAndMembersById } from "../controllers/group.controller.js";
import { addExpense, getExpenseHistory } from "../controllers/transaction.controller.js";



const router = Router()

router.route('/register').post(registerUser)
router.route('/login').post(loginUser)
router.route('/logout').get(logout)
router.route('/details').get(variefyUser, getUserDetails)
router.route('/newgroup').post(getUserIdsFromEmails,(req, res) => createGroup(req, res));
router.route('/fetchGroups').get(fetchGroups)
router.route('/group/:groupId/userDetails').post(getUserDetailsById);

// group
router.route('/group/:groupId').get(getGroupNameAndMembersById)
router.route(`/group/:groupId/members`).get(getMemberNames);
router.route('/group/:groupId/add-new-members').post(addNewMembers);
router.route('/group/:groupId/pendingAmount').get(getPendingAmount);

// expense
router.route('/group/add-expense').post(addExpense)
router.route('/group/:groupId/expenses').get(getExpenseHistory);

export default router