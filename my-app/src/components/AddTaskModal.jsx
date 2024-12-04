import React, { useState, useEffect } from 'react';

export default function AddTaskModal ({ isOpen, onClose }) {
    const [taskName, setTaskName] = useState('');
    const [availableLabels, setAvailableLabels] = useState([]); // change when DB added
    const [selectedLabels, setSelectedLabels] = useState([]);
    const [newLabel, setNewLabel] = useState(''); 
    const[newLabelSubmit,setNewLabelSubmit] = useState({name: "",
        color: "grey",
      })
    const [dueDate, setDueDate] = useState('');
    const [dueTime, setDueTime] = useState('');
    const [comments, setComments] = useState('');
    const [tags, setTags] = useState([]);
    const [newTask,setNewTask] =  useState({
        user_id: "",
        title: "",
        tag_id: "",
        description: "",
        due_date: ""})

    useEffect(() => {
        const fetchTags = async () => {
          try {
            const endpoint = "/api/tags"; 
            const response = await fetch(`https://itp-460-backend.vercel.app${endpoint}`, {
              method: "GET",
              headers: { "Content-Type": "application/json" }
            });
        
            if (!response.ok) {
              throw new Error('Failed to fetch tags');
            }
        
            const receivedTags = await response.json();
            // setTagsList(receivedTags);
            
            const tagNames = receivedTags.map(tag => tag.name);
            setTags(tagNames);  // Store tag names for comparison
            
          } catch (err) {
            console.error('Error fetching tags:', err);
          }
        };
      
        fetchTags();
      }, []);

    // creating a new label
    const handleAddLabel = async (e) => {
    if (newLabel && !availableLabels.includes(newLabel)) {
        setNewLabelSubmit({name:newLabel, color:"grey"});
    e.preventDefault();
        try {
            const endpoint = `/api/tags`
            console.log(JSON.stringify(newLabelSubmit))
            const response = await fetch(
            `https://itp-460-backend.vercel.app${endpoint}`,
            {
            method: "POST", 
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newLabelSubmit)
            }
        );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      alert("Tags updated successfully!");
    } catch (err) {
      // console.log(profileData)
      alert("Something went wrong: " + err.message);
    }
        setNewLabel(''); 
    }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        const due = `${dueDate} ${dueTime}`;
        const userId = JSON.parse(sessionStorage.getItem("currentUser"));
    
        // Construct the task object locally
        const taskToSubmit = {
            user_id: userId,
            title: taskName,
            tag_id: selectedLabels + 1, // Adjust based on how tag_id is determined
            description: comments,
            due_date: due,
        };
    
        console.log("Submitting task:", taskToSubmit);
    
        try {
            const endpoint = `/api/reminders`;
            const response = await fetch(
                `https://itp-460-backend.vercel.app${endpoint}`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(taskToSubmit),
                }
            );
    
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
    
            alert("Task added successfully!");
        } catch (err) {
            alert("Something went wrong: " + err.message);
        }
    
        onClose(); // Close the modal
    };
    

    if (!isOpen) return null;

    return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
        <div className="bg-white rounded-lg p-6 shadow-lg w-96">
        <h2 className="text-xl font-bold mb-4">Add a Task</h2>
        <form onSubmit={handleSubmit}>
            <div className="mb-4">
            <label className="block text-gray-700 mb-2">Task Name</label>
            <input
                type="text"
                value={taskName}
                onChange={(e) => setTaskName(e.target.value)}
                className="border border-gray-300 rounded p-2 w-full"
                required
            />
            </div>

            <div className="mb-4">
  <label className="block text-gray-700 mb-2">Labels</label>
  <div
    className="grid grid-cols-2 max-h-32 overflow-auto mb-2"
    style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))' }}
  >
    {tags.map((label, index) => (
      <label key={index} className="flex items-center mb-2">
        <input
          type="radio"
          name="task-label"
          checked={selectedLabels === index} // Compare against the index
          onChange={() => setSelectedLabels(index)} // Set the selected index
          className="mr-2"
        />
        <span className="text-gray-600">{label}</span>
      </label>
    ))}
  </div>

            <div className="flex items-center">
                <input
                type="text"
                value={newLabel}
                onChange={(e) => setNewLabel(e.target.value)}
                placeholder="Add a new label"
                className="border border-gray-300 rounded p-2 flex-grow mr-2"
                />
                <button
                type="button"
                onClick={handleAddLabel}
                className="bg-blue-500 text-white rounded px-4 py-2"
                >
                Add
                </button>
            </div>
            </div>

            <div className="mb-4">
            <label className="block text-gray-700 mb-2">Due Date</label>
            <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="border border-gray-300 rounded p-2 w-full"
            />
            </div>

            <div className="mb-4">
            <label className="block text-gray-700 mb-2">Due Time</label>
            <input
                type="time"
                value={dueTime}
                onChange={(e) => setDueTime(e.target.value)}
                className="border border-gray-300 rounded p-2 w-full"
            />
            </div>

            <div className="mb-4">
            <label className="block text-gray-700 mb-2">Description</label>
            <textarea
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                className="border border-gray-300 rounded p-2 w-full"
                rows="3"
            ></textarea>
            </div>

            <div className="flex justify-end">
            <button
                type="button"
                onClick={onClose} // Close modal on cancel
                className="bg-gray-300 text-gray-700 rounded px-4 py-2 mr-2"
            >
                Cancel
            </button>
            <button
                type="submit"
                className="bg-blue-500 text-white rounded px-4 py-2"
            >
                Add
            </button>
            </div>
        </form>
        </div>
    </div>
    );
};
