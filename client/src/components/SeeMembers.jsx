import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const SeeMembers = () => {
  const [memberNames, setMemberNames] = useState([]);
  const [groupName, setGroupName] = useState('');
  const { groupId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    fetchMemberNames();
    handelFetchGroupName();
  }, [groupId]);

  const fetchMemberNames = async () => {
    try {
      const response = await fetch(import.meta.env.VITE_REACT_APP_SERVER_BASE_URL+`user/group/${groupId}/members`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setMemberNames(data);
    } catch (error) {
      console.error('There has been a problem with your fetch operation:', error);
    }
  };

  const handelFetchGroupName = async () => {
    try {
      const response = await fetch(import.meta.env.VITE_REACT_APP_SERVER_BASE_URL+`user/group/${groupId}`, {
        method: 'GET',
        credentials: 'include'
      });
      const responseData = await response.json();
      setGroupName(responseData.groupname);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="h-screen w-full flex items-start justify-start bg-gradient-to-r from-gray-600 to-gray-800">
      <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 max-w-md mx-auto mt-10 ml-10">
        <h2 className="text-3xl font-semibold text-gray-800 dark:text-white mb-4 relative">
          Members of 
          <span className="text-violet-500 underline"> {groupName} </span>
        </h2>
        <ul className="list-disc pl-5">
          {memberNames.map((name, index) => (
            <li key={index} className="text-gray-700 dark:text-gray-300 mb-2 text-2xl">{name}</li>
          ))}
        </ul>
        <div className='w-full flex justify-end mt-8'>

          <button className='bg-purple-500 hover:bg-purple-800 text-white p-2 rounded-lg'
          onClick={()=>navigate(`/group/${groupId}/add-new-member`)}>Add new member</button>
        </div>
      </div>
    </div>
  );
};

export default SeeMembers;
