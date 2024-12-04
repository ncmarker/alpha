import { React, useState, useEffect } from "react";
import { FaPlus } from 'react-icons/fa';
import AddTaskModal from "./AddTaskModal";

export default function TaskList() {
    const [addTaskModalOpen, setAddTaskModalOpen] = useState(false);
    const [tasks, setTasks] = useState([]);
    const [tagsList, setTagsList] = useState([]); // Holds the list of tags

    const handleToggleModal = () => {
        setAddTaskModalOpen(!addTaskModalOpen);
    };

    // Fetch tasks from API
    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const userId = JSON.parse(sessionStorage.getItem("currentUser"));
                const endpoint = `/api/reminders/${userId}`;
                const response = await fetch(`https://itp-460-backend.vercel.app${endpoint}`, {
                    method: "GET",
                    headers: { "Content-Type": "application/json" }
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch tasks');
                }

                const data = await response.json();
                setTasks(data);
            } catch (err) {
                console.error('Error fetching tasks:', err);
            }
        };

        fetchTasks();
    }, []);

    // Fetch tags from API
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
                setTagsList(receivedTags); // Store full tag objects
            } catch (err) {
                console.error('Error fetching tags:', err);
            }
        };

        fetchTags();
    }, []);

    return (
        <div className="w-1/2 min-w-[300px] mx-auto mb-8 p-4">
            {/* Show modal when add item clicked */}
            {addTaskModalOpen && <AddTaskModal isOpen={addTaskModalOpen} onClose={handleToggleModal} />}

            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-medium">Upcoming Tasks</h2>
                <button className="flex items-center text-blue-600 hover:text-blue-800">
                    <FaPlus className="h-5 w-5" />
                    <span className="ml-2" onClick={handleToggleModal}>Add Task</span>
                </button>
            </div>

            <div className="max-h-[675px] overflow-y-auto bg-gray-100 p-4 rounded-lg border border-gray-300">
                {tasks.map(task => (
                    <TaskItem key={task.id} task={task} tagsList={tagsList} />
                ))}
            </div>
        </div>
    );
}

// TaskItem Component
export function TaskItem({ task, tagsList }) {
    // Find the tag name corresponding to task.tag_id
    const taskTag = tagsList.find(tag => tag.id === task.tag_id)?.name;

    return (
        <div className="bg-gray-50 border border-gray-300 rounded-lg p-4 mb-4">
            <div className="flex flex-row justify-between">
                <div className="flex flex-col">
                    <div className="text-lg font-semibold">{task.title}</div>
                    <div className="flex flex-wrap mt-1">
                        {taskTag ? (
                            <span
                                className={`text-sm mr-2 mb-1 px-2 py-1 rounded-full text-white bg-gray-400`}
                            >
                                {taskTag}
                            </span>
                        ) : (
                            <span className="text-sm text-gray-500">No tag</span>
                        )}
                    </div>
                </div>
                <div className="text-sm text-gray-600 mt-2">
                    {new Date(task.due_date).toLocaleString()}
                </div>
            </div>
        </div>
    );
};
