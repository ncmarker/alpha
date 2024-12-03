import React, { useState, useEffect } from "react";

function SearchTasks() {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState(null);
  const [searchText, setSearchText] = useState("");
  // const tasks = [
  //   { id: 1, name: "Finish pitch deck", date: "Today" },
  //   { id: 2, name: "Weekly standup", date: "Today" },
  //   { id: 3, name: "Leg day!", date: "Today" },
  //   { id: 4, name: "Log hours", date: "Tomorrow, Oct 16" },
  //   { id: 5, name: "Conduct user interviews", date: "Tomorrow, Oct 16" },
  //   { id: 6, name: "Prototype mockups", date: "Tomorrow, Oct 16" },
  //   { id: 7, name: "Meal prep", date: "Tomorrow, Oct 16" },
  //   { id: 8, name: "Create vacation itinerary", date: "Oct 18, 2024" },
  // ];

  useEffect(() => {
    // Fetch tasks data on component mount
    const fetchfirst = async () => {
      try {
        const userId = JSON.parse(sessionStorage.getItem("currentUser"));
        const endpoint = `/api/reminders/${userId}`
        const response = await fetch(`https://itp-460-backend.vercel.app${endpoint}`, {
            method: "GET",
            headers: { "Content-Type": "application/json" }
          });
        if (!response.ok) {
          throw new Error('Failed to fetch tasks');
        }
        const data = await response.json();
        // console.log(first)
        // const data = first[0]
        // console.log(data)
        // setData(first);
        setTasks(data);
        // console.log('Fetched tasks:', data);
        // console.log('Fetched tasks:', data);
      } catch (err) {
        // setError(err.message);
      }
    };

    fetchfirst();
  }, []);

  const formatDate = (isoDate) => {
    const date = new Date(isoDate);
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch = task.title.toLowerCase().includes(searchText.toLowerCase());
    const matchesFilter = filter ? task.due_date === filter : true;
    return matchesSearch && matchesFilter;
  });

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
          onClick={() => setFilter(null)}
          className={`px-4 py-2 rounded-lg ${filter === null ? "bg-blue-500 text-white" : "bg-gray-100"}`}
        >
          Date
        </button>
        <button className="bg-blue-500 text-white px-4 py-2 rounded-lg">Filters</button>
      </div>
      <div>
        {filteredTasks.map((task) => (
          <div key={task.id} className="border-b py-2">
            <div className="font-semibold">{task.title}</div>
            <div className="text-sm text-gray-500">{formatDate(task.due_date)}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SearchTasks;
