import React, { useState, useEffect } from 'react';

export default function EditTaskModal({ isOpen, onClose, task }) {
    const [taskName, setTaskName] = useState('');
    const [id, setId] = useState('');
    const [availableLabels, setAvailableLabels] = useState(['Urgent', 'Home', 'Work']); // Example labels
    const [selectedLabel, setSelectedLabel] = useState(''); // Store the actual label ID
    const [newLabel, setNewLabel] = useState('');
    const [tags, setTags] = useState([]); // Now stores { id, name }
    const [dueDate, setDueDate] = useState('');
    const [dueTime, setDueTime] = useState('');
    const [comments, setComments] = useState('');
    const[newLabelSubmit,setNewLabelSubmit] = useState({name: "",
        color: "grey",
      });
    const [newTask, setNewTask] = useState({
        user_id: "",
        title: "",
        tag_id: "",
        description: "",
        due_date: ""});

    // Populate the state with the task's data on mount or task change
    useEffect(() => {
        if (task) {
            setTaskName(task.title || '');
            setId(task.id || '');
            setDueDate(task.due_date ? task.due_date.split('T')[0] : ''); // Extract date
            setDueTime(task.due_date ? task.due_date.split('T')[1]?.substring(0, 5) : ''); // Extract time in HH:mm
            setComments(task.description || '');
            // Set the selected label ID based on the task's tag_id
            setSelectedLabel(task.tag_id || ''); // Assuming task.tag_id is the ID of the selected label
        }
    }, [task]);

    // fetch tags from database
    const fetchTags = async () => {
        try {
            const endpoint = '/api/tags';
            const response = await fetch(`https://itp-460-backend.vercel.app${endpoint}`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            });

            if (!response.ok) {
                throw new Error('Failed to fetch tags');
            }

            const receivedTags = await response.json();
            const tagObjects = receivedTags.map((tag) => ({
                id: tag.id,
                name: tag.name,
            }));
            setTags(tagObjects);
        } catch (err) {
            console.error('Error fetching tags:', err);
        }
    };

    // Fetch available tags on load
    useEffect(() => {
        fetchTags();
    }, []);

    // add label to possible labels for reminder
    const handleAddLabel = async (e) => {
        if (newLabel && !availableLabels.includes(newLabel)) {
            e.preventDefault();
            try {
                const endpoint = `/api/tags`
                const response = await fetch(
                    `https://itp-460-backend.vercel.app${endpoint}`,
                    {
                        method: "POST", 
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({name: newLabel, color:"grey"})
                    }
                );
            
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
            
                alert("Tags updated successfully!");
            } catch (err) {
                alert("Something went wrong: " + err.message);
            }
            setNewLabel(''); 
            fetchTags();
        }
    };

    // marks task as complete 
    async function handleMarkAsCompelte(id) {
        try {
            const endpoint = `/api/reminders/${id}`;
            const response = await fetch(`https://itp-460-backend.vercel.app${endpoint}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    is_complete: true,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to update task');
            }
        } catch (err) {
            console.error('Error updating reminder:', err);
        }
        onClose();
        window.location.reload();
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        const userId = JSON.parse(sessionStorage.getItem("currentUser"));

        const selectedTag = tags.find(tag => tag.id === selectedLabel);
        const tagName = selectedTag ? selectedTag.name : '';
        

        const taskData = {
            user_id: userId,
            title: taskName,
            due_date: `${dueDate}T${dueTime}`,
            description: comments,
            tag: tagName, // Send the tag ID (not name)
        };

        console.log('Updated Task:', taskData);
        try {
            const endpoint = `/api/reminders/${id}`;
            const response = await fetch(
                `https://itp-460-backend.vercel.app${endpoint}`,
                {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(taskData),
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
        window.location.reload();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
            <div className="bg-white rounded-lg p-6 shadow-lg w-96">
                <h2 className="text-xl font-bold mb-4">Edit Task</h2>
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
                        <div className="grid grid-cols-2 max-h-32 overflow-auto mb-2">
                            {tags.map((tag) => (
                                <label key={tag.id} className="flex items-center mb-2">
                                    <input
                                        type="radio"
                                        name="task-label"
                                        value={tag.id}
                                        checked={selectedLabel === tag.id} // Compare tag ID
                                        onChange={() => setSelectedLabel(tag.id)} // Set selected tag ID
                                        className="mr-2"
                                    />
                                    <span className="text-gray-600">{tag.name}</span>
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
                        <label className="block text-gray-700 mb-2">Comments</label>
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
                            className="bg-gray-300 text-gray-700 rounded px-4 py-2 mr-2"
                            onClick={() => handleMarkAsCompelte(task.id)}
                        >Mark as complete</button>
                        <button
                            type="button"
                            onClick={onClose}
                            className="bg-gray-300 text-gray-700 rounded px-4 py-2 mr-2"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="bg-blue-500 text-white rounded px-4 py-2"
                        >
                            Save
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
