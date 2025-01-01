import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

function AddNewMembers() {
  const [members, setMembers] = useState([]);
  const [newMember, setNewMember] = useState('');
  const [error, setError] = useState('');
  const {groupId} = useParams();
  const navigate = useNavigate();

  const handleAddMember = (e) => {
    e.preventDefault(); 
    if (newMember.trim() === '') {
      setError('Member Gmail cannot be empty.');
      return;
    }
    setMembers([...members, newMember]);
    setNewMember(''); 
    setError('');
  };

  const handleRemoveMember = (index) => {
    setMembers(members.filter((_, i) => i!== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (members.length < 1) {
      setError('At least one member is required.');
      return;
    }

    try {
      // Assuming you have an endpoint to add members to a group
      const response = await fetch(import.meta.env.VITE_REACT_APP_SERVER_BASE_URL+`user/group/${groupId}/add-new-members`, {
        method: 'POST',
        headers: {
          "Content-Type": "application/json"
        },
        credentials: 'include',
        body: JSON.stringify({
          members: members
        })
      });
      const responseData = await response.json();
      if (response.status === 201) {
        navigate(`/group/${groupId}/see-members`);
      } else {
        setError(responseData.message);
      }
    } catch (err) {
      console.error("An error occurred adding members:", err);
      setError("An error occurred while adding the members.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="h-screen w-full flex items-center justify-center bg-gradient-to-r from-gray-500 to-gray-800">
      <div className='p-5 flex flex-col gap-8 w-min-[600px] h-auto w-auto justify-self-start items-center bg-gray-800 border-2 rounded-xl shadow-lg border-none outline-none shadow-gray-500 m-auto'>
        <h2 className='text-white text-2xl mb-4'>Add Members to Group</h2>
        <div className="flex items-center">
          <label htmlFor="memberGmail" className="text-sm font-medium text-white mr-4">Enter Gmail of Member:</label>
          <input
            type="email"
            id="memberGmail"
            value={newMember}
            onChange={(e) => setNewMember(e.target.value)}
            className="block w-[400px] h-[2rem] rounded-md border-gray-700 bg-slate-200 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 p-4"
            placeholder='Enter member Gmail'
          />
        </div>
        <button type="button" onClick={handleAddMember} className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mt-4">Add Member</button>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <div className="flex flex-col mt-4">
          {members.map((member, index) => (
            <div key={index} className="flex items-center justify-between">
              <span className="text-white text-md">{member}</span>
              <button onClick={() => handleRemoveMember(index)} className="text-black font-bold rounded-full ml-2 mb-4 text-2xl">⛔</button>
            </div>
          ))}
        </div>
        <button type="submit" className="mt-4 w-[150px] bg-indigo-600 text-white px-4 py-2 rounded-xl hover:bg-indigo-700">Confirm Addition</button>
      </div>
    </form>
  );
}

export default AddNewMembers;
