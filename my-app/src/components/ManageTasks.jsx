import { React, useState } from "react";
import { useEffect } from "react";
import { FaPlus , FaMinus , FaPen} from 'react-icons/fa';
import AddTaskModal from "./AddTaskModal";
import EditTaskModal from "./EditTaskModal";

export default function ManageList() {
    const [addTaskModalOpen, setAddTaskModalOpen] = useState(false);
    
    const [prevTask, setPrevTask] = useState(null);
    const [tasks, setTasks] = useState([]);
    

    const handleToggleModal = () => {
        setAddTaskModalOpen(!addTaskModalOpen);
    };

    const handleRemoveTask = async (id) => {
        // setTasks((tasks) => tasks.filter(task => task.id !== id));

        try {
          const endpoint = `/api/reminders/${id}`;
          const response = await fetch(
              `https://itp-460-backend.vercel.app${endpoint}`,
              {
                  method: "DELETE",
                  headers: { "Content-Type": "application/json" }
              }
          );
  
          if (!response.ok) {
              throw new Error(`HTTP error! Status: ${response.status}`);
          }
  
          alert("Task removed successfully!");
      } catch (err) {
          alert("Something went wrong: " + err.message);
      }
    };

    useEffect(() => {
        // Fetch tasks data on component mount
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
            const first = await response.json();
            setTasks(first);
            console.log('Fetched tasks:', tasks);
          } catch (err) {
            console.error('Error fetching tasks:', err);
          }
        };
        
        fetchTasks();
      }, []);


    // sample tasks data
    // const[tasks,setTasks] =  useState([{ id: 1, title: "Finish project report", tags: []);

    return (
        <div className="w-full min-w-[300px] mx-auto mb-8 p-4">
            
            {/* show modal when add item clicked */}
            {addTaskModalOpen && <AddTaskModal isOpen={addTaskModalOpen} onClose={handleToggleModal}/> }
            

            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-medium">Upcoming Tasks</h2>
                <button className="flex items-center text-blue-600 hover:text-blue-800">
                    <FaPlus className="h-5 w-5" />
                    <span className="ml-2" onClick={handleToggleModal}>Add Task</span>
                </button>
            </div>
            <div className="max-h-[675px] overflow-y-auto bg-gray-100 p-4 rounded-lg border border-gray-300">
                {tasks.map(task => (
                <TaskItem key={task.id} task={task} handleRemoveTask={handleRemoveTask} />
                ))}
            </div>
        </div>
    );
};

export function TaskItem({task, handleRemoveTask}) {
    const [editTaskModalOpen, setEditTaskModalOpen] = useState(false);

     const handleEditToggleModal = () => {
        setEditTaskModalOpen(!editTaskModalOpen);
    };

    const handleEditOpenModal = (task) => {
        setEditTaskModalOpen(!editTaskModalOpen);
        console.log(task)
    };

    const [tagsList, setTagsList] = useState([]);
    const [tags, setTags] = useState([]);
    const taskTag = tagsList.find(tag => tag.id === task.tag_id)?.name;


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
            setTagsList(receivedTags);
            
            const tagNames = receivedTags.map(tag => tag.name);
            setTags(tagNames);  // Store tag names for comparison
            
          } catch (err) {
            console.error('Error fetching tags:', err);
          }
        };
      
        fetchTags();
      }, []);
  return (
    <div className="bg-gray-50 border border-gray-300 rounded-lg p-4 mb-4">
        {editTaskModalOpen && <EditTaskModal isOpen={editTaskModalOpen} onClose={handleEditToggleModal} task={task}/> }
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
            
            
            <div className="text-sm text-gray-600 flex-col space-y-7">
                <div className="text-right">
                    {task.dueDate}
                </div>
                <div className="flex space-x-3 justify-end">
                    <button className="flex items-center text-blue-600 hover:text-blue-800" onClick={() => [handleEditOpenModal(task), handleEditToggleModal]}>
                        <FaPen className="h-5 w-5" />
                        <span className="ml-2" >Edit Task</span>
                    </button>
                    <button className="flex items-center text-blue-600 hover:text-blue-800" onClick={()=>handleRemoveTask(task.id)}>
                        <FaMinus className="h-5 w-5" />
                        <span className="ml-2" >Remove Task</span>
                    </button>
                    
                </div>
            </div>
            

        </div>
        
    </div>
  );
};
