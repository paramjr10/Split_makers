import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const SettleUp = () => {
  const [pendingAmounts, setPendingAmounts] = useState([]);
  const [userDetails, setUserDetails] = useState({}); // State to store user details
  const { groupId } = useParams();

  useEffect(() => {
    fetchPendingAmounts();
  }, []);



  const fetchPendingAmounts = async () => {
    const response = await fetch(import.meta.env.VITE_REACT_APP_SERVER_BASE_URL+`user/group/${groupId}/pendingAmount`, {
      credentials: 'include',
    });
    const data = await response.json();
    setPendingAmounts(data);

    // Fetch user details for each pending amount
    const userPromises = data.map(async (amount) => {
      const userDetailsResponse = await fetch(import.meta.env.VITE_REACT_APP_SERVER_BASE_URL+`user/group/${groupId}/userDetails`, {
        method: 'POST',
        headers: {
          "Content-Type": "application/json"
        },
        credentials: 'include',
        body: JSON.stringify({
          paidBy: amount.user_id
        })
      });
      const userDetails = await userDetailsResponse.json();
      return userDetails;
    });

    const userDetailsData = await Promise.all(userPromises);
    setUserDetails(userDetailsData.reduce((acc, curr) => ({ ...acc, [curr._id]: curr }), {}));
  };

  return (
    <div className="h-[100vh] w-[full] flex flex-col items-center bg-gradient-to-r from-gray-600 to-gray-800 gap-8">
      {pendingAmounts.map((amount, index) => (
        <div key={index} className='flex w-[25vw] h-16 items-center bg-gray-800 rounded-md mt-2 text-white justify-between'>
          {userDetails[amount.user_id] && (
            <div className='flex justify-between w-full p-4'>
              <div className='font-bold text-xl'>
                {userDetails[amount.user_id].name}
              </div>
              <div style={{ color: amount.amount >= 0? 'green' : 'red' }} className='font-bold text-xl'>
                {amount.amount.toFixed(2)}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
  
}

  export default SettleUp;
