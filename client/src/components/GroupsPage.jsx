import React from 'react'
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
function GroupsPage() {
    const [groups, setGroups] = useState([])

    useEffect(() => {

        handelFetchGroups();

    }, [])

    const handelFetchGroups = async () => {
        try {
            const response = await fetch(import.meta.env.VITE_REACT_APP_SERVER_BASE_URL+`user/fetchGroups`, {
                method: 'GET',
                credentials: 'include'
            })
            const responseData = await response.json();
            // console.log(responseData);
            // console.log(responseData.user.groups)
            setGroups(responseData.user.groups);

        }
        catch (err) {
            console.log(err)
        }
    }


    if (groups.length == 0) {
        return <div className='bg-gradient-to-r from-gray-600 to-gray-800'>No groups found. You can create a group by clicking 'Add group' button.</div>
    }
    else {
        return (
            <div className='bg-gradient-to-r from-gray-600 to-gray-800 h-screen'>
                <div className='pl-10 pt-10'>

                    <h1 className='text-3xl font-bold font-serif mb-6 text-white'>Your Groups :-</h1>
                    {groups.map(group => (
                        <Link to={'/group/' + group._id} key={group._id}>
                            <h2 
                            className={`bg-gradient-to-r from-indigo-500 to-indigo-800 text-white mb-4 text-2xl w-[300px] p-3 rounded-2xl font-serif inline-block mr-4  hover:bg-blue-9000`}>{group.name}</h2>
                        </Link>
                    ))}
                </div>
            </div>
        );
    }
}

export default GroupsPage
