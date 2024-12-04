import { React, useState } from "react";
import { useEffect } from "react";
import { FaPlus , FaMinus , FaPen} from 'react-icons/fa';

import AddTaskModal from "./AddTaskModal";
import EditTaskModal from "./EditTaskModal";
import SendEmailModal from "./SendEmailModal";


export default function ManageList() {
    const [addTaskModalOpen, setAddTaskModalOpen] = useState(false);
    
    const [tasks, setTasks] = useState([]);
    const [finishedTasks, setFinishedTasks] = useState([]);
    

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
            setTasks(first.filter((task) => !task.is_complete));
            setFinishedTasks(first.filter((task) => task.is_complete));
            // console.log('Fetched tasks:', tasks);
            // console.log(finishedTasks);
          } catch (err) {
            console.error('Error fetching tasks:', err);
          }
        };
        
        fetchTasks();
      }, []);


    const handleRemoveTaskFinish = (id) => {
        setFinishedTasks((finishedList) => finishedList.filter(finish => finish.id !== id));
        deleteTask(id);
    };

    async function deleteTask(id) {
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
    }


    // sample tasks data
    // const[tasks,setTasks] =  useState([{ id: 1, title: "Finish project report", tags: []);

    return (
        <>  
            {/* task breakdown */}
            <div className="w-full min-w-[300px] mx-auto mb-4 p-4">
                <h2 className="text-2xl font-medium mb-4">Task Breakdown</h2>
                <div className="flex justify-between mb-4">
                    <div className="flex w-1/2 mb-4 p-5 rounded 1-g border border-gray-500 bg-gray-100">
                        <div className="flex flex-wrap flex-col">
                            <p className="text-gray-500">Total Tasks</p>
                            <span className= "mb-5 pt-4 text-5xl">{tasks.length + finishedTasks.length}</span>
                        </div>
                    </div>
                    <div className="flex rounded 1-g w-1/5 mb-4 p-5 border border-green-500 bg-green-200">
                        <div className="flex flex-wrap flex-col">
                            <p className="text-gray-500">Finished Tasks</p>
                            <span className= "mb-5 pt-4 text-5xl">{finishedTasks.length}</span>
                        </div>
                    </div>
                    <div className="flex rounded 1-g w-1/5 mb-4 p-5 border border-red-500 bg-red-200">
                        <div className="flex flex-wrap flex-col">
                            <p className="text-gray-500">Unfinished Tasks</p>
                            <span className= "mb-5 pt-4 text-5xl">{tasks.length}</span>
                        </div>
                    </div>
                </div>
             </div>
            {/* list of upcoming tasks */}
            <div className="w-1/2 mx-auto mb-4 p-4">
                
                {addTaskModalOpen && <AddTaskModal isOpen={addTaskModalOpen} onClose={handleToggleModal}/> }
                
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-medium">Upcoming Tasks</h2>
                    <button className="flex items-center text-blue-600 hover:text-blue-800">
                        <FaPlus className="h-5 w-5" />
                        <span className="ml-2" onClick={handleToggleModal}>Add Task</span>
                    </button>
                </div>
                <div className="max-h-[400px] overflow-y-auto bg-gray-100 p-4 rounded-lg border border-gray-300">
                    {tasks.map(task => (
                    <TaskItem key={task.id} task={task} handleRemoveTask={handleRemoveTask} />
                    ))}
                </div>
            </div>
            {/* finish task list */}
            <div className="w-1/2">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-medium">Finished Tasks</h2>
                    
                </div>
                <div className="max-h-[675px] overflow-y-auto bg-gray-100 p-4 rounded-lg border border-gray-300">
                    {finishedTasks.map(task => (
                        <TaskItem key={task.id} task={task} handleRemoveTask={handleRemoveTask} />
                    ))}
                </div>
            </div>
        </>
    );
};



export function TaskItem({task, handleRemoveTask}) {

    // email modal 
    const [sendEmailModalOpen, setEmailModalOpen] = useState(false);

    const openEmailModal = () => {
        setEmailModalOpen(!sendEmailModalOpen);
    }

    const closeEmailModal = (item) => {
        setEmailModalOpen(!sendEmailModalOpen);
    }

    // edit modal
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
        {sendEmailModalOpen && <SendEmailModal isOpen={sendEmailModalOpen} onClose={closeEmailModal} task={task}/>}
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
                    <button className="flex items-center text-black-600 hover:text-blue-800" onClick={() => [openEmailModal(task), closeEmailModal]}>
                        {/* <FaMinus className="h-5 w-5" /> */}
                        <span className="ml-2" >Email Task</span>
                    </button>
                    
                </div>
            </div>
            

        </div>
        
    </div>
  );
};
