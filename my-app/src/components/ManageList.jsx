import { React, useState } from "react";
import { useEffect } from "react";
import { FaPlus , FaMinus , FaPen} from 'react-icons/fa';

import AddTaskModal from "./AddTaskModal";
import EditTaskModal from "./EditTaskModal";
import SendEmailModal from "./SendEmailModal";

export default function ManageList() {
    const [addTaskModalOpen, setAddTaskModalOpen] = useState(false);
    
    const [prevTask, setPrevTask] = useState(null);

    const handleToggleModal = () => {
        setAddTaskModalOpen(!addTaskModalOpen);
        
    };

    const handleRemoveTask = (id) => {
        setTasks((tasks) => tasks.filter(task => task.id !== id));
    };


    const handleRemoveTaskFinish = (id) => {
        setFinish((finishedList) => finishedList.filter(finish => finish.id !== id));
    };
  

    // const { user_id, title, description, due_date, tag 

    
    // loading list based of user id from endpoint api
    // const entryList = ({userId}) => {
    //     const [entries, setEntries] = useState([]);
    //     const [load,setLoad] = useState(true);
    //     const [error, setError] = useState(null);

    //     useEffect(() => {
    //         const getList = async () => {
    //             try {
    //                 const userId = JSON.parse(sessionStorage.getItem("currentUser"));
    //                 const endpoint = `/api/reminders/${userId}`
    //                 const response = await fetch (`https://itp-460-backend.vercel.app${endpoint}`,
    //                     {method: "GET",
    //                      headers: {"Content-Type": "application/json"}   
    //                     });
    //                 if (!response.ok){
    //                     throw new Error ('Cannot get tasks');
    //                 }

    //                 const data = await response.json();

    //                 setEntries(data);
    //             } catch (err) {
    //                 setError(err.message);
    //             } finally {
    //                 setLoad(false);
    //             }
    //         };

    //         getList();


    //     }, [userId]);

    //     if (load){
    //         console.log(load); 
    //     }

    //     if (error) {
    //         console.log(error) 
    //     }
    // };


    // sample tasks data
    const[tasks,setTasks] =  useState([{ id: 1, title: "Finish project report", tags: ["work", "urgent"], dueDate: "2024-10-15"},
        { id: 2, title: "Morning workout", tags: ["fitness", "work"], dueDate: "2024-10-14" },
        { id: 3, title: "Read a book", tags: ["leisure"], dueDate: "2024-10-16" },
        { id: 4, title: "Read a book", tags: ["leisure"], dueDate: "2024-10-16" },
        { id: 5, title: "Read a book", tags: ["leisure"], dueDate: "2024-10-16" },
        { id: 6, title: "Read a book", tags: ["leisure"], dueDate: "2024-10-16" },
        { id: 7, title: "Read a book", tags: ["leisure"], dueDate: "2024-10-16" }]);

    
    // 
    const[finishedList,setFinish] =  useState([{ id: 1, title: "Finish project report", tags: ["work", "urgent"], dueDate: "2024-10-15"},
        { id: 2, title: "Morning workout", tags: ["fitness", "work"], dueDate: "2024-10-14" },
        { id: 3, title: "Read a book", tags: ["leisure"], dueDate: "2024-10-16" }
        ]);

    return (
        
        <div className="w-full min-w-[300px] mx-auto mb-8 p-4">
            {/* task breakdown */}
            <h2 className="text-2xl font-medium mb-4">Task Breakdown</h2>
            <div className="flex justify-between mb-4">
                <div className="flex w-1/2 mb-4 p-5 rounded 1-g border border-gray-500 bg-gray-100">
                    <div className="flex flex-wrap flex-col">
                        <p className="text-gray-500">Total Tasks</p>
                        <span className= "mb-5 pt-4 text-5xl">10</span>
                    </div>
                </div>
                <div className="flex rounded 1-g w-1/5 mb-4 p-5 border border-green-500 bg-green-200">
                    <div className="flex flex-wrap flex-col">
                        <p className="text-gray-500">Finished Tasks</p>
                        <span className= "mb-5 pt-4 text-5xl">3</span>
                    </div>
                </div>
                <div className="flex rounded 1-g w-1/5 mb-4 p-5 border border-red-500 bg-red-200">
                    <div className="flex flex-wrap flex-col">
                        <p className="text-gray-500">Unfinished Tasks</p>
                        <span className= "mb-5 pt-4 text-5xl">7</span>
                    </div>
                </div>
            </div>

            
            {/* show modal when add item clicked */}
            {addTaskModalOpen && <AddTaskModal isOpen={addTaskModalOpen} onClose={handleToggleModal}/> }
            
            <div className="flex justify-between gap-5">
                <div className="w-3/5">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-2xl font-medium">Upcoming Tasks</h2>
                        <button className="flex box-button rounded 1-g bg-blue-500 text-white items-center p-2 hover:text-blue-800">
                            <FaPlus className="h-5 w-5" />
                            <span className="ml-2" onClick={handleToggleModal}>Add Task</span>
                        </button>
                    </div>
                    <div className="max-h-[675px] overflow-y-auto bg-gray-100 p-4 rounded-lg border border-gray-300">
                        {tasks.map(task => (
                        <TaskItem key={task.id} task={task} handleRemoveTask={handleRemoveTask} item={task}/>
                        ))}
                        
                    </div>
                </div>

                <div className="w-2/5">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-2xl font-medium">Finished Tasks</h2>
                        
                    </div>
                    <div className="max-h-[675px] overflow-y-auto bg-gray-100 p-4 rounded-lg border border-gray-300">
                        {finishedList.map(finish => (
                        <FinishItem key={finish.id} finish={finish} handleRemoveTaskFinish={handleRemoveTaskFinish} />
                        ))}

                    
                    </div>
                </div>

            
               
            </div>

            
        </div>
    );
};


//test material

// export function ReminderList(){
//     const [editTaskModalOpen, setEditTaskModalOpen] = useState(false);

//      const handleEditToggleModal = () => {
//         setEditTaskModalOpen(!editTaskModalOpen);
//     };

//     const handleEditOpenModal = (task) => {
//         setEditTaskModalOpen(!editTaskModalOpen);
//     };

//     const [reminder, setReminder] = useState()

//     useEffect(() => {
//         const fetchData = async () => {
//             const result = await fetch ('https://itp-460-backend-1bytsdine-nick-markers-projects.vercel.app//api/reminders/:userId')
//             const jsonResult  = await result.json();


//             setReminder(jsonResult)
//         }

//         fetchData()

//     }, [])

//     const submitReminder = async () => {


//     }

//     return(
//         <div className="bg-gray-50 border border-gray-300 rounded-lg p-4 mb-4">
//             {editTaskModalOpen && <EditTaskModal isOpen={editTaskModalOpen} onClose={handleEditToggleModal} reminder={reminder}/> }
//             <div className="flex flex-row justify-between">
//                 <div className="flex flex-col">
//                     <div className="text-lg font-semibold">{reminder.title}</div>
//                     <div className="text-left text-sm text-gray-400">
//                         {reminder.dueDate}
//                     </div>
//                     <div className="flex flex-wrap mt-1">
//                         {reminder.tags.map((tag, index) => (
//                         <span
//                             key={index}
//                             className={`text-sm mr-2 mb-1 px-2 py-1 rounded-full text-white ${
//                             tag === 'work' ? 'bg-blue-500' :
//                             tag === 'fitness' ? 'bg-green-500' :
//                             tag === 'sleep' ? 'bg-purple-500' :
//                             'bg-gray-400' // unknown tags
//                             }`}
//                         >
//                             {tag}
//                         </span>
//                         ))}
//                     </div>
//                 </div>
                
                
//                 <div className="text-sm text-gray-600 flex-col space-y-7">
//                     <div className="text-right">
//                         <input type="checkbox"></input>
//                     </div>
                    
//                     <div className="flex space-x-3 justify-end">
//                         <button className="flex items-center text-blue-600 hover:text-blue-800" onClick={() => [handleEditOpenModal(reminder), handleEditToggleModal]}>
//                             {/* <FaPen className="h-5 w-5" /> */}
//                             <span className="ml-2" >Edit Task</span>
//                         </button>
//                         <button className="flex items-center text-black-600 hover:text-blue-800" onClick={()=>handleRemoveTask(reminder.id)}>
//                             {/* <FaMinus className="h-5 w-5" /> */}
//                             <span className="ml-2" >Remove Task</span>
//                         </button>
                        
//                     </div>
//                 </div>
                

//             </div>
            
//         </div>    
//     )
// }


export function FinishItem({finish, handleRemoveTaskFinish}) {
    const [editTaskModalOpen, setEditTaskModalOpen] = useState(false);

     const handleEditToggleModal = () => {
        setEditTaskModalOpen(!editTaskModalOpen);
    };

    const handleEditOpenModal = (finish) => {
        setEditTaskModalOpen(!editTaskModalOpen);
        console.log(finish)
    };


  return (
    
    <div className="bg-gray-50 border border-gray-300 rounded-lg p-4 mb-4">
        {editTaskModalOpen && <EditTaskModal isOpen={editTaskModalOpen} onClose={handleEditToggleModal} finish={finish}/> }
        <div className="flex flex-row justify-between">
            <div className="flex flex-col">
                <div className="text-lg font-semibold">{finish.title}</div>
                <div className="flex flex-wrap mt-1">
                    {finish.tags.map((tag, index) => (
                    <span
                        key={index}
                        className={`text-sm mr-2 mb-1 px-2 py-1 rounded-full text-white ${
                        tag === 'work' ? 'bg-blue-500' :
                        tag === 'fitness' ? 'bg-green-500' :
                        tag === 'sleep' ? 'bg-purple-500' :
                        'bg-gray-400' // unknown tags
                        }`}
                    >
                        {tag}
                    </span>
                    ))}
                </div>
            </div>
            
   
            

        </div>
        
    </div>

    

    

    
  );
};


export function TaskItem({task, handleRemoveTask, item}) {
    const [editTaskModalOpen, setEditTaskModalOpen] = useState(false);

     const handleEditToggleModal = () => {
        setEditTaskModalOpen(!editTaskModalOpen);
    };

    const handleEditOpenModal = (task) => {
        setEditTaskModalOpen(!editTaskModalOpen);
        console.log(task)
    };

    const [sendEmailModalOpen, setEmailModalOpen] = useState(false);

    const openEmailModal = () => {
        setEmailModalOpen(!sendEmailModalOpen);
    }

    const closeEmailModal = (item) => {
        setEmailModalOpen(!sendEmailModalOpen);
    }


  return (
    
    <div className="bg-gray-50 border border-gray-300 rounded-lg p-4 mb-4">
        {editTaskModalOpen && <EditTaskModal isOpen={editTaskModalOpen} onClose={handleEditToggleModal} task={task}/> }
        {sendEmailModalOpen && <SendEmailModal isOpen={sendEmailModalOpen} onClose={closeEmailModal} task={task}/>}
        
        <div className="flex flex-row justify-between">
            <div className="flex flex-col">
                <div className="text-lg font-semibold">{task.title}</div>
                <div className="text-left text-sm text-gray-400">
                    {task.dueDate}
                </div>
                <div className="flex flex-wrap mt-1">
                    {task.tags.map((tag, index) => (
                    <span
                        key={index}
                        className={`text-sm mr-2 mb-1 px-2 py-1 rounded-full text-white ${
                        tag === 'work' ? 'bg-blue-500' :
                        tag === 'fitness' ? 'bg-green-500' :
                        tag === 'sleep' ? 'bg-purple-500' :
                        'bg-gray-400' // unknown tags
                        }`}
                    >
                        {tag}
                    </span>
                    ))}
                </div>
            </div>
            
            
            <div className="text-sm text-gray-600 flex-col space-y-7">
                <div className="text-right">
                    <input type="checkbox"></input>
                </div>
                
                <div className="flex space-x-3 justify-end">
                    <button className="flex items-center text-blue-600 hover:text-blue-800" onClick={() => [handleEditOpenModal(task), handleEditToggleModal]}>
                        {/* <FaPen className="h-5 w-5" /> */}
                        <span className="ml-2" >Edit Task</span>
                    </button>
                    <button className="flex items-center text-black-600 hover:text-blue-800" onClick={()=>handleRemoveTask(task.id)}>
                            {/* <FaMinus className="h-5 w-5" /> */}
                            <span className="ml-2" >Remove Task</span>
                    
                    </button>

                    <button className="flex items-center text-black-600 hover:text-blue-800" onClick={() => [openEmailModal(item), closeEmailModal]}>
                        {/* <FaMinus className="h-5 w-5" /> */}
                        <span className="ml-2" >Email Task</span>
                    </button>
                    
                    
                </div>
            </div>
            

        </div>
        
    </div>

    

    

    
  );
};
