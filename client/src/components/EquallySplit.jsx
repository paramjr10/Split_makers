import React, { useState } from 'react';

const EquallySplit = ({ members=["Prince", "Param", "Pranav", "Karan"], amount=400, onSubmit }) => {
    const [selectedMembers, setSelectedMembers] = useState([]);

    const handleMemberSelect = (memberId) => {
        setSelectedMembers(prev => {
            if (prev.includes(memberId)) {
                return prev.filter(id => id !== memberId);
            } else {
                return [...prev, memberId];
            }
        });
    };

    const handleSubmit = () => {
        onSubmit(selectedMembers, amount / selectedMembers.length);
    };

    return (
        <div className="h-screen w-full flex items-center justify-center bg-gradient-to-r from-gray-600 to-gray-800">
            <div className='p-5 flex flex-col gap-8 w-[600px] h-[400px] justify-center items-center bg-gray-800 border-2 rounded-xl shadow-lg border-none outline-none shadow-gray-500 m-auto'>
                <h2 className="text-white">Equally Split</h2>
                {members.map(member => (
                    <div key={member._id} className="flex items-center">
                        <input
                            type="checkbox"
                            id={`member-${member._id}`}
                            checked={selectedMembers.includes(member._id)}
                            onChange={() => handleMemberSelect(member._id)}
                            className="mr-2"
                        />
                        <label htmlFor={`member-${member._id}`} className="text-sm font-medium text-white">{member.name}</label>
                        <span className="ml-2">{selectedMembers.includes(member._id) ? `Owing: ${(amount / selectedMembers.length).toFixed(2)}` : ''}</span>
                    </div>
                ))}
                <button onClick={handleSubmit} className="mt-4 w-[150px] bg-indigo-600 text-white px-4 py-2 rounded-xl hover:bg-indigo-700">Submit</button>
            </div>
        </div>
    );
};

export default EquallySplit;
