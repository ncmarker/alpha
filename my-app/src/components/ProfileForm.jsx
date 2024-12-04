// <<<<<<< Updated upstream
import React, { useState, useEffect } from 'react';

export function ProfileForm() {
  const [profileData, setProfileData] = useState({
    username: "",
    first_name: "",
    last_name: "",
    email: "",
    monthly_goal: "",
    goal: "",
  });

  useEffect(() => {
    // Fetch data when the component mounts
    const fetchData = async () => {
      try {
        const userId = JSON.parse(sessionStorage.getItem("currentUser"));
        const endpoint = `/api/users/${userId}`
        const response = await fetch(
          `https://itp-460-backend.vercel.app${endpoint}`,
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        

        const hold = await response.json();
        const data = hold[0]
        // console.log(letsgo)
        setProfileData({
          username: data.username || "",
          first_name: data.first_name || "",
          last_name: data.last_name || "",
          email: data.email || "",
          monthly_goal: data.monthly_goal || "",
          goal: data.goal || ""
        });

        // console.log(profileData)
      } catch (err) {
        // alert("Something went wrong: " + err.message);
      }
    };

    fetchData();
  }, []);

  const handleChange = (e) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    const userId = JSON.parse(sessionStorage.getItem("currentUser"));
    e.preventDefault();
    try {
      const userId = JSON.parse(sessionStorage.getItem("currentUser"));
        const endpoint = `/api/users/${userId}`
        console.log(JSON.stringify(profileData))
      const response = await fetch(
        `https://itp-460-backend.vercel.app${endpoint}`,
        {
          method: "PATCH", 
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(profileData)
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      alert("Profile updated successfully!");
    } catch (err) {
      // console.log(profileData)
      alert("Something went wrong: " + err.message);
    }
  };

  return (
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
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Email</label>
            <input
              type="email"
              name="email"
              value={profileData.email}
              onChange={handleChange}
              className="border border-gray-300 rounded p-2 w-full"
            />
          </div>
        </div>

        <h2 className="text-xl font-bold mb-4">Goals</h2>

        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Monthly Goal</label>
          <textarea
            value={profileData.monthly_goal}
            name="monthly_goal"
            onChange={handleChange}
            className="border border-gray-300 rounded p-2 w-full"
            rows="3"
          ></textarea>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Overall Goal</label>
          <input
            type="text"
            name="goal"
            value={profileData.goal}
            onChange={handleChange}
            className="border border-gray-300 rounded p-2 w-full"
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
}
