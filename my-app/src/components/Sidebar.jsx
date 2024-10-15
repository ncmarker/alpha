import React, { useState } from 'react';
import { FaHome, FaUser, FaCalendarAlt, FaCog, FaSignOutAlt, FaCheckSquare } from 'react-icons/fa'; // importing icons
import { IoSparkles } from "react-icons/io5"; // more icon
import { FaCircleNotch } from "react-icons/fa"; // temp logo icon
import { GiHamburgerMenu } from "react-icons/gi"; // menu icon
import { Link } from 'react-router-dom';

export default function Sidebar() {
    const [expanded, setExpanded] = useState(true);

    return (
    <div className={`h-screen w-64 bg-gray-100 border-r border-gray-300 flex flex-col ease-in-out duration-300 ${expanded ? 'w-64' : 'w-14'}`}>
        <div className="p-4">
            <div className={`flex items-center space-x-3 ${expanded ? 'block' : 'hidden'}`}>
                <FaCircleNotch className="h-6 w-6 text-blue-500"/>
                <span className="text-xl font-bold">TimeSpark</span>
                <GiHamburgerMenu className ="h-6 w-6 text-grey-500" onClick={()=>setExpanded(!expanded)}/>

            </div>
            <div className={`flex items-center space-x-3 ${!expanded ? 'block' : 'hidden'}`}>
                <GiHamburgerMenu className ="h-6 w-6 text-grey-500" onClick={()=>setExpanded(!expanded)}/>

            </div>
        </div>

        <nav className={`flex-grow flex flex-col mt-4 px-4 ${expanded ? 'block' : 'hidden'}`}>
            <MenuItem icon={<FaHome />} label="Dashboard" to="/dashboard" />
            <MenuItem icon={<IoSparkles />} label="Insights" to="/insights" />
            <MenuItem icon={<FaCheckSquare />} label="Manage Tasks" to="/manage-tasks" />
            <MenuItem icon={<FaUser />} label="Profile" to="/profile" />
        </nav>

        <div className={`p-4 ${expanded ? 'block' : 'hidden'}`}>
            <button className="flex items-center space-x-2 text-red-500 hover:text-red-700 px-4">
                <FaSignOutAlt />
                <span>Logout</span>
            </button>
        </div>
    </div>
  );
};


export function MenuItem({ icon, label, to }) {
    return (
        <Link to={to} className="p-4 hover:bg-gray-200 hover:rounded cursor-pointer flex items-center space-x-3">
            <div className="text-gray-600">{icon}</div>
            <span className="text-gray-600 font-medium">{label}</span>
        </Link>
    );
}

