import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const Group = () => {
  const { groupId } = useParams();
  const [expenses, setExpenses] = useState([]);
  const [paidByName, setPaidByName] = useState(''); //this is for getting name of the paidBy (because it comes as id from the API.)
  const navigate = useNavigate();

  useEffect(() => {
    fetchExpenses();
  }, [groupId]);

  // useEffect(() => {
  //   handelGetUserDetails();
  // }, [expenses.paidBy])


  const fetchExpenses = async () => {
    try {
      const response = await fetch(import.meta.env.VITE_REACT_APP_SERVER_BASE_URL+`user/group/${groupId}/expenses`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setExpenses(data);
      // console.log(data);
      // Fetch user details for each expense
      const userPromises = data.map(async (expense) => {
        const response = await fetch(import.meta.env.VITE_REACT_APP_SERVER_BASE_URL+`user/group/${groupId}/userDetails`, {
          method: 'POST',
          headers: {
            "Content-Type": "application/json"
          },
          credentials: 'include',
          body: JSON.stringify({
            paidBy: expense.paidBy
          })
        });
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const user = await response.json();
        return { ...expense, paidBy: user.name }; // Assuming the user object has a 'name' property
      });

      const users = await Promise.all(userPromises);
      setExpenses(users); // Update expenses with user names
    } catch (error) {
      console.error('Error fetching expenses:', error);
    }
  };

  const formatDateType = (dateString) => {
    const date = new Date(dateString);

    const formattedDate = date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    const formattedTime = date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false, // Use 24-hour format
    });

    return {formattedDate, formattedTime};

  }




  return (
    <div className="h-screen w-full flex bg-gradient-to-r from-gray-600 to-gray-800">
      <div className="flex flex-col place-items-start justify-items-start mt-8 ml-4">
        <div className="flex flex-col gap-4">
          <div>
            <button onClick={() => navigate(`/group/${groupId}/add-expense`)} className="bg-gradient-to-r from-purple-500 to-purple-700 text-white px-4 py-2 rounded-xl hover:from-purple-600 hover:to-purple-800 transition duration-300">Add Expense</button>
            <button onClick={() => navigate(`/group/${groupId}/settle-up`)} className="bg-gradient-to-r from-purple-500 to-purple-700 text-white px-4 py-2 rounded-xl hover:from-purple-600 hover:to-purple-800 transition duration-300 ml-4">Settle Up</button>
            <button onClick={() => navigate(`/group/${groupId}/see-members`)} className="bg-gradient-to-r from-purple-500 to-purple-700 text-white px-4 py-2 rounded-xl hover:from-purple-600 hover:to-purple-800 transition duration-300 ml-4">See members</button>
          </div>
          <h1 className="text-white text-2xl font-bold mt-4 shadow-lg bg-violet-800">Group History:- </h1>
        </div>

        {expenses.map((expense, index) => (

          <div className='flex justify-between bg-gray-800 text-white p-4 mt-4 rounded-lg w-[500px] cursor-pointer'>

            <div >
              <p><strong>Description:</strong> {expense.description}</p>
              <p><strong>Amount:</strong> {expense.totalAmount}</p>
              <p><strong>Paid By:</strong> {expense.paidBy}</p>
            </div>
            <div>
              <p className='font-bold'>{formatDateType(expense.createdAt).formattedDate}</p>
              <p>{formatDateType(expense.createdAt).formattedTime}</p>
            </div>
          </div>
        ))}


      </div>
    </div>
  );
};

export default Group;
