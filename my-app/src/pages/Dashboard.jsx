import TaskList from '../components/TaskList';
import { ChartAnalysis } from '../components/Chart';
import AddTaskModal from '../components/AddTaskModal';
import React, { useState, useEffect } from "react";

export default function Dashboard() {

    const [tasks, setTasks] = useState([]);
    const [data, setData] = useState([]);
    const [tags, setTags] = useState([]);
    const [tagsList,setTagsList] = useState([]);

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
        const first = await response.json();
        // const data = first[0]
        // setData(first);
        setTasks(first);
        console.log('Fetched tasks:', tasks);
        // console.log('Fetched tasks:', data);
      } catch (err) {
        // setError(err.message);
      }
    };

    fetchfirst();
  }, []);

    

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
  
          const recieved = await response.json();
          setTagsList(recieved)
          // const possibleStatuses = new Set(recieved.map(tag => tag.name));
          // setTags(recieved); // Store fetched tasks
          console.log(recieved)
          const data = recieved.map(recieved => recieved.name);
          
          setTags(data);
          console.log("tags:",tags);
  
  
          // setMissingStatuses(possibleStatuses); 
        } catch (err) {
          console.error('Error fetching tasks:', err);
        }
      };
  
      fetchTags();
    }, []);

    return (
        <div className="flex flex-col w-full">
            <h1 className="mx-8 mt-4 text-4xl font-medium text-blue-600">Dashboard</h1>
            <div className="flex-grow flex flex-row flex-wrap p-4"> 
            <ChartAnalysis tasks={tasks} tags = {tagsList}/>

                <TaskList /> 
            </div>
      </div>
    );
}