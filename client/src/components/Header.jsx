import React, { useEffect, useState } from 'react';
import logo from '../assets/logo2.png';
import searchLogo from '../assets/magnifierGlass.png';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Header() {
    const [searchGroup, setSearchGroup] = useState('');
    const navigate = useNavigate()
    async function handelSearchGroup()
    {
        const response = await fetch(`url`, )
    }
    const [name, setName]= useState('');
    useEffect(()=>{
        // axios.get("http://localhost:8000/user/details",{ withCredentials: true })
        // .then((res)=>{
        //     console.log(res.data)
        //     setName(res.data.user.name);
        // })
        // .catch(err => console.log(err));
        
        getDetails()
    },[])

    function getCookie(name) {
        const nameEQ = name + "=";
        const ca = document.cookie.split(';');
        for(let i=0;i < ca.length;i++) {
            let c = ca[i];
            while (c.charAt(0)==' ') c = c.substring(1,c.length);
            if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
        }
        return null;
    }

    const getDetails = async () => {
        try{
            const response = await fetch(import.meta.env.VITE_REACT_APP_SERVER_BASE_URL+`user/details`, {
                method: 'GET',
                credentials: 'include'
            })
            const responseData = await response.json(); 
            // console.log(responseData);
            if(responseData.user){
                setName(responseData.user.name)
            }
            else{
                navigate('/')
            }
        }
        catch(err){
            console.log(err);
        }
    }
    return (
        <nav className="flex items-center justify-between p-4 bg-gray-800 border-b-2 border-white text-white">
            <div className="flex items-center">
                <img src={logo} alt="Bill Buddy" className="h-16 w-auto mr-2" />
                <h3 className="text-3xl">Hello {name}</h3>
            </div>
            <div className="flex items-center space-x-4">
                {/* <div className="flex items-center space-x-2">
                    <input
                        type="text"
                        value={searchGroup}
                        onChange={(e) => setSearchGroup(e.target.value)}
                        className="border-2 border-gray-300 rounded-md px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500 text-black"
                        placeholder="Search"
                    />
                    <button 
                    onClick={()=>handelSearchGroup()}
                    className="bg-green-700 hover:bg-green-900 text-white font-bold py-2 px-4 rounded">
                        <img src={searchLogo} alt="search" className="h-5 w-auto" />
                    </button>
                </div> */}
                <button 
                onClick={()=>navigate('/creategroup')}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                    Create Group
                </button>
                <button 
                onClick={()=>navigate('/logout')}
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
                    Log out
                </button>
            </div>
        </nav>
    );
}

export default Header;
