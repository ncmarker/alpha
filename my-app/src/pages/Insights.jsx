import { ChartAnalysis } from '../components/Chart';
import React, { useState, useEffect } from "react";
export default function Insights() {

    const [tasks, setTasks] = useState([]);
    useEffect(() => {
        // Fetch tasks data on component mount
        const fetchTasks = async () => {
          try {
            const endpoint = "/api/reminders/24e5d878-8636-4f0e-b62b-a9587e6aa6bf" 
            const response = await fetch(`https://itp-460-backend-1bytsdine-nick-markers-projects.vercel.app${endpoint}`, {
                method: "GET",
                headers: { "Content-Type": "application/json" }
              });
            if (!response.ok) {
              throw new Error('Failed to fetch tasks');
            }
            const data = await response.json();
            setTasks(data);
            console.log('Fetched tasks:', data);
          } catch (err) {
            // setError(err.message);
          }
        };
    
        fetchTasks();
      }, []);


        // const [tasks, setTasks] = useState([]);
        const [missingStatuses, setMissingStatuses] = useState([]);
        
        // Define all possible statuses
        const possibleStatuses = ['Work', 'Sleep', 'Leisure','Fitness'];
      
        useEffect(() => {
          const fetchTasks = async () => {
            try {
              const endpoint = "/api/reminders/24e5d878-8636-4f0e-b62b-a9587e6aa6bf"; 
              const response = await fetch(`https://itp-460-backend-1bytsdine-nick-markers-projects.vercel.app${endpoint}`, {
                method: "GET",
                headers: { "Content-Type": "application/json" }
              });
      
              if (!response.ok) {
                throw new Error('Failed to fetch tasks');
              }
      
              const data = await response.json();
              setTasks(data); // Store fetched tasks
      
              // Check if any of the possible statuses are missing
              const presentStatuses = new Set(data.map(task => task.tag));
              const missing = possibleStatuses.filter(tag => !presentStatuses.has(tag));
      
              setMissingStatuses(missing); // Store missing statuses
            } catch (err) {
              console.error('Error fetching tasks:', err);
            }
          };
      
          fetchTasks();
        }, []);
      
        return (
            <div className="w-full min-w-[300px] mx-auto mb-8 p-4">
            <ChartAnalysis/>
            <h2 className="text-2xl font-medium mb-4">Suggestions</h2>
            <div className="h-[600px] bg-gray-100 p-4 rounded-lg border border-gray-300 flex flex-col items-center">
              {/* <h2>Missing Statuses</h2> */}
              {missingStatuses.length > 0 ? (
                <div>
                    <p>It seems like you haven't planned out time an important category of activity. Work/life balance is important for a healthy schedule!</p>
                    <p>Make sure you're scheduling time for:</p>
                <ul>
                  {missingStatuses.map((tag, index) => (
                    <li key={index}>{tag}</li>
                  ))}
                </ul>
                </div>
              ) : (
                <p>Good job! Your tasks indicate that you have a good balance between work, leisure, sleep and fitness! A mix of these types of activities is key for a healthy work/life balance!</p>
              )}
            </div>
          </div>
        );
    //   }
    // return (
    //   
    //         
            
    //         </div>
    //     </div>
    // );
}