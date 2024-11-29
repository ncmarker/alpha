import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";

export function ProfileForm({}){

    const handleChange = (e) => {
        setProfileData({ ...profileData, [e.target.name]: e.target.value });
      };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        try {
          const endpoint = "api/profile";
          const backendUrl = process.env.REACT_APP_BACKEND_URL;
          const response = await fetch(`${backendUrl}${endpoint}`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(profileData),
          });
    
          const data = await response.json();
    
          if (response.ok) {
            const [profileData, setProfileData] = useState({ username: data.username, first_name: data.first_name, last_name: data.last_name, email: data.email, month_goal: data.month_goal, overall_goal: data.overall_goal});
          } else {
            alert(data.error);
          }
        } catch (err) {
          alert("Something went wrong: " + err.message);
        }
      };
    // console.log(task.tags)


    return(
        <div className="bg-white rounded-lg p-6 w-full">
        <h2 className="text-xl font-bold mb-4">Personal Information</h2>
        <form onSubmit={handleSubmit}>
            <div className="mb-4">
            <label className="block text-gray-700 mb-2">Username</label>
            <input
                type="text"
                name="username"
                value={profileData.username}
                onChange={handleChange}
                className="border border-gray-300 rounded p-2 w-full"
                // required
            />
            </div>

            <div className="grid grid-cols-2 gap-x-6">
            <div className="mb-4">
            <label className="block text-gray-700 mb-2">First Name</label>
            <input
                type="text"
                name="first_name"
                value={profileData.first_name}
                onChange={handleChange}
                className="border border-gray-300 rounded p-2 w-full"
                // required
            />
            </div>

            <div className="mb-4">
            <label className="block text-gray-700 mb-2">Last Name</label>
            <input
                type="text"
                name="last_name"
                value={profileData.last_name}
                onChange={handleChange}
                className="border border-gray-300 rounded p-2 w-full"
                // required
            />
            </div>

            <div className="mb-4">
            <label className="block text-gray-700 mb-2">Email</label>
            <input
                type="text"
                name="email"
                value={profileData.email}
                onChange={handleChange}
                className="border border-gray-300 rounded p-2 w-full"
                // required
            />
            </div>

            </div>

            

            

         <h2 className="text-xl font-bold mb-4">Goals</h2>


            <div className="mb-4">
            <label className="block text-gray-700 mb-2">Monthly Goal</label>
            <textarea
                value={profileData.month_goal}
                name="month_goal"
                onChange={handleChange}
                className="border border-gray-300 rounded p-2 w-full"
                rows="3"
            ></textarea>
            </div>

            <div className="mb-4">
            <label className="block text-gray-700 mb-2">Overall Goal</label>
            <input
                type="text"
                name="overall_goal"
                value={profileData.overall_goal}
                onChange={handleChange}
                className="border border-gray-300 rounded p-2 w-full"
                // required
            />
            </div>

            <div className="flex justify-end">
            <button
                type="submit"
                className="bg-blue-500 text-white rounded px-4 py-2"
            >
                Save Changes
            </button>
            </div>
        </form>
        </div>

);
};