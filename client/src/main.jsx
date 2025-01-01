import React from 'react'
import ReactDOM from 'react-dom/client'
// import App from './App.jsx'
import './index.css'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './components/HomePage.jsx';
import LoginPage from './components/LoginPage.jsx';
import SignUpPage from './components/SignUpPage.jsx';
import Header from './components/Header.jsx';
import PageWrapper from './components/PageWrapper.jsx';
import GroupsPage from './components/GroupsPage.jsx';
import Group from './components/Group.jsx';
import CreateGroupForm from './components/CreateGroupForm.jsx';
import LogOut from './components/LogOut.jsx';
import AddExpense from './components/AddExpense.jsx';
import EquallySplit from './components/EquallySplit.jsx';
import SeeMembers from './components/SeeMembers.jsx';
import SettleUp from './components/SettleUp.jsx';
import AddNewMembers from './components/AddNewMembers.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <Router>
    <Routes>
    <Route path="/" element={<HomePage/>}/>

    <Route path="/login" element={<LoginPage/>}/>
    <Route path="/signup" element={<SignUpPage/>}/>
    <Route path='/logout' element ={<LogOut/>}/>

    <Route path='/creategroup' element ={<PageWrapper><CreateGroupForm/></PageWrapper>}/>
    <Route path='/groups' element={<PageWrapper><GroupsPage/></PageWrapper>}/>
    <Route path='/group/:groupId' element={<PageWrapper><Group /></PageWrapper>}></Route>
    <Route path='/group/:groupId/add-expense' element={<PageWrapper><AddExpense/></PageWrapper>}></Route>
    <Route path='/group/:groupId/see-members' element={<PageWrapper><SeeMembers/></PageWrapper>}></Route>
    <Route path= '/group/:groupId/add-new-member' element={<PageWrapper><AddNewMembers/></PageWrapper>}></Route>
    <Route path='/group/:groupId/settle-up' element={<PageWrapper><SettleUp/></PageWrapper>}></Route>
    <Route path='/group/:groupId/add-expense/split-equally' element={<EquallySplit/>}></Route>

    
    </Routes>
  </Router>
)