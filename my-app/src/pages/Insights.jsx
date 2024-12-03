import { ChartAnalysis } from '../components/Chart';
import React, { useState, useEffect } from "react";
export default function Insights() {

    const [tasks, setTasks] = useState([]);
    const [data, setData] = useState([]);
    const [tags, setTags] = useState([]);
    const [tagsList,setTagsList] = useState([]);
    const [possibleStatuses, setPossibleStatuses] = useState([])
    const [missingStatuses, setMissingStatuses] = useState([]);

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

        
        

      
        useEffect(() => {
          const fetchTasksAndCalculateMissing = async () => {
            try {
              // Fetch tasks
              // const userId = JSON.parse(sessionStorage.getItem("currentUser"));
              // const endpoint = `/api/reminders/${userId}`; 
              // const response = await fetch(`https://itp-460-backend.vercel.app${endpoint}`, {
              //   method: "GET",
              //   headers: { "Content-Type": "application/json" }
              // });
        
              // if (!response.ok) {
              //   throw new Error('Failed to fetch tasks');
              // }
        
              // const tasksData = await response.json();
              // setTasks(tasksData);
        
              // Map tags to indices
              const tagIndices = tags.map((_, index) => index);
        
              // Extract present tag_ids from tasks
              const presentTagIds = new Set(tasks.map(tasks => tasks.tag_id));
              // console.log("present:",presentTagIds)
        
              // Find missing tag indices
              const missingIndices = tagIndices.filter(index => !presentTagIds.has(index));
        
              // Map missing indices back to tag names
              const missingTagNames = missingIndices.map(index => tags[index]);
        
              setMissingStatuses(missingTagNames);
            } catch (err) {
              console.error('Error fetching tasks or calculating missing tags:', err);
            }
          };
        
          if (tags.length > 0) {
            fetchTasksAndCalculateMissing();
          }
        }, [tags, tasks]);
        
      
        return (
            <div className="w-full min-w-[300px] mx-auto mb-8 p-4">
            <ChartAnalysis tasks={tasks} tags = {tagsList}/>
            <h2 className="text-2xl font-medium mb-4">Suggestions</h2>
            <div className=" bg-gray-100 p-4 rounded-lg border border-gray-300 flex flex-col items-center">
              {missingStatuses.length > 0 ? (
                <div>
                    <p>It seems like you haven't planned out time for enough of the important categories of tags you have!. Work/life balance is important for a healthy schedule!</p>
                    <p>Make sure you're scheduling time for:</p>
                <ul>
                  {missingStatuses.map((tag, index) => (
                    <li key={index}>{tag}</li>
                  ))}
                </ul>
                </div>
              ) : (
                <p>Good job! Your tasks indicate that you have a good balance between different activity types! A mix of these types of activities is key for a healthy work/life balance!</p>
              )}
            </div>
          </div>
        );

}