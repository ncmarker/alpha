import React, { useState } from "react";

function SearchTasks() {
  const [filter, setFilter] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);

  const tasks = [
    { id: 1, name: "Finish pitch deck", date: "Today" },
    { id: 2, name: "Weekly standup", date: "Today" },
    { id: 3, name: "Leg day!", date: "Today" },
    { id: 4, name: "Log hours", date: "Tomorrow, Oct 16" },
    { id: 5, name: "Conduct user interviews", date: "Tomorrow, Oct 16" },
    { id: 6, name: "Prototype mockups", date: "Tomorrow, Oct 16" },
    { id: 7, name: "Meal prep", date: "Tomorrow, Oct 16" },
    { id: 8, name: "Create vacation itinerary", date: "Oct 18, 2024" },
  ];

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch = task.name.toLowerCase().includes(searchText.toLowerCase());
    const matchesFilter = filter ? task.date === filter : true;
    return matchesSearch && matchesFilter;
  });

  const handleFilterSelect = (selectedFilter) => {
    setFilter(selectedFilter);
    setShowFilterDropdown(false);
  };

  return (
    <div className="flex flex-col p-6 bg-white h-full">
      <h1 className="text-2xl font-bold mb-4">Search Tasks</h1>
      <div className="flex gap-4 items-center mb-4">
        <input
          type="text"
          placeholder="Search"
          className="border border-gray-300 rounded-lg p-2 flex-1"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
        <button
          onClick={() => setShowFilterDropdown(!showFilterDropdown)}
          className="relative bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center"
        >
          Filters
          <svg
            className="ml-2 w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
          </svg>
        </button>
        {showFilterDropdown && (
          <div className="absolute mt-2 right-4 bg-white border border-gray-200 rounded-lg shadow-lg z-10 w-48">
            <button
              onClick={() => handleFilterSelect("Category")}
              className="block w-full text-left px-4 py-2 hover:bg-gray-100"
            >
              Category
            </button>
            <button
              onClick={() => handleFilterSelect("Date")}
              className="block w-full text-left px-4 py-2 hover:bg-gray-100"
            >
              Date
            </button>
            <button
              onClick={() => handleFilterSelect("Time")}
              className="block w-full text-left px-4 py-2 hover:bg-gray-100"
            >
              Time
            </button>
            <button
              onClick={() => handleFilterSelect("Location")}
              className="block w-full text-left px-4 py-2 hover:bg-gray-100"
            >
              Location
            </button>
          </div>
        )}
      </div>
      <div>
        {filteredTasks.map((task) => (
          <div key={task.id} className="border-b py-2">
            <div className="font-semibold">{task.name}</div>
            <div className="text-sm text-gray-500">{task.date}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SearchTasks;
