import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';


const AddExpense = () => {
  const { groupId } = useParams();
  const [groupName, setGroupName] = useState('');
  const [description, setDescription] = useState('');  // expense description
  const [amount, setAmount] = useState(0); // expense amount
  const [paidBy, setPaidBy] = useState({}); // the user object who paid the amount
  const [members, setMembers] = useState([]); // members of group
  const navigate = useNavigate();
  const [selectedOption, setSelectedOption] = useState('');   //for equally or unequally
  const [selectedMembers, setSelectedMembers] = useState([]);  // involved members in the expense.

  useEffect(() => {

    handelFetchGroupNameAndMembers(groupId);

  }, [groupId])

  // useEffect(() => {
  //   setPaidByName((paidByName) => paidByName = paidBy.name)
  // }, [paidBy])
  // Remove these lines from handleSelectChange
  // console.log(paidBy);
  // console.log(paidBy.name);




  const handleSelectChange = (e) => {
    console.log(e.target.value);
    const selectedMemberId = e.target.value;
    // const selectedMember = members.find(member => member._id === selectedMemberId);
    // console.log(selectedMember);
    setPaidBy(members.find(member => member._id === e.target.value));
    console.log(paidBy);
    console.log(paidBy.name);
  }

  const handelFetchGroupNameAndMembers = async (groupId) => {
    try {
      const response = await fetch(import.meta.env.VITE_REACT_APP_SERVER_BASE_URL+`user/group/${groupId}`, {
        method: 'GET',
        credentials: 'include'
      })
      const responseData = await response.json();
      // console.log(responseData)
      setGroupName(responseData.groupname);
      setMembers(responseData.members)

    }
    catch (err) {
      console.log(err)
    }
  }
  const handleSelection = (member) => {
    if (selectedMembers.includes(member)) {
      setSelectedMembers(selectedMembers.filter(m => m !== member));
    } else {
      setSelectedMembers([...selectedMembers, member]);
    }
  };




  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(import.meta.env.VITE_REACT_APP_SERVER_BASE_URL+'user/group/add-expense', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          groupId: groupId,
          description: description,
          amount: amount,
          paidBy: paidBy,
          involved_members: selectedMembers
        }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      console.log(data);
      // Handle success, e.g., show a success message

      navigate(`/group/${groupId}`)
    } catch (error) {
      console.error('There has been a problem with your fetch operation:', error);
      // Handle error, e.g., show an error message
    }
  };




  return (
    <form onSubmit={handleSubmit} className="h-screen w-full flex items-center justify-center bg-gradient-to-r from-gray-600 to-gray-800">
      <div className='p-5 flex flex-col gap-8 w-[1000px] h-full justify-center items-center bg-gray-800 border-2 rounded-xl shadow-lg border-none outline-none shadow-gray-500 m-auto'>
        <h1 className='text-white text-2xl font-bold '>Adding expense to the group :- <span className='text-violet-500 underline'>{groupName}</span></h1>
        <div className=" w-full flex items-center justify-evenly">
          <label htmlFor="description" className="text-xl font-medium text-white mr-4">Description:</label>
          <input
            type="text"
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            className="block w-[400px] h-[2rem] rounded-md border-gray-700 bg-slate-200 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 p-4"
            placeholder='Enter description'
          />
        </div>
        <div className="w-full flex items-center justify-evenly">
          <label htmlFor="amount" className="text-xl font-medium text-white mr-4">Amount (₹):</label>
          <input
            type="number"
            id="amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
            className="block w-[400px] h-[2rem] rounded-md border-gray-700 bg-slate-200 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 p-4"
            placeholder='Enter amount'
          />
        </div>
        <div className="w-full flex items-center justify-evenly">
          <label htmlFor="paidBy" className="text-xl font-medium text-white mr-4">Paid By:</label>
          {/* <select className='border-2 w-full px-2 rounded-md' value={paidBy.name} onChange={(e) => { setPaidBy(e.target.value); console.log(paidBy) }}>

              {members.map((option) => (
                <option key={option._id} value={option._id} name='member'>
                  {option.name}
                </option>
              ))}
            </select> */}
          <select
            id="paidBy"
            placeholder="Select a member"
            // value={paidBy ? paidBy.name : ''}
            // className='px-2 rounded-md w-40 border-gray-700 shadow-sm block'
            className="block w-[400px] rounded-md border-gray-700 bg-slate-200 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 p-1"
            onChange={(e) => { handleSelectChange(e) }}
          // className="block w-[400px] h-[2rem] rounded-md border-gray-700 bg-slate-200 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 p-4"
          >
            <option value="">Select a member</option>
            {members.map((member, index) => (
              <option key={index} value={member._id}>{member.name}</option>
            ))}
          </select>



        </div>
        <div className="flex items-center">
          <label className="text-2xl font-medium text-white mr-4">Split Option:</label>
          <label className='text-white font-medium text-2xl font-sans mr-8'>
            <input
              type="radio"
              value="equally"
              checked={selectedOption === 'equally'}
              onChange={(e) => setSelectedOption(e.target.value)}
              className='mr-1'
            />
            Equally
          </label>
          <label className='text-white font-medium text-2xl font-sans mr-8'>
            <input
              type="radio"
              value="unequally"
              checked={selectedOption === 'unequally'}
              onChange={(e) => setSelectedOption(e.target.value)}
              className='mr-1'
            />
            Unequally
          </label>
        </div>
        <div className="p-4 space-y-2">
          {members.map((member, index) => (
            <label key={index} className="flex items-center space-x-2">
              <input
                type="checkbox"
                value={member}
                checked={selectedMembers.includes(member)}
                onChange={() => handleSelection(member)}
                className="form-checkbox h-5 w-5 text-blue-600"
              />
              <span className='text-xl text-white w-full'>{member.name}</span>
            </label>
          ))}
        </div>
        <button type="submit" onClick={()=> handleSubmit} className="mt-4 w-[300px] bg-indigo-600 text-white text-2xl px-4 py-2 rounded-xl hover:bg-indigo-700">Add Expense</button>
      </div>
    </form>
  );
};

export default AddExpense;
