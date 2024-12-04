import { ChartAnalysis } from '../components/Chart';
import React, { useState, useEffect } from "react";

export default function Insights() {

  const [tasks, setTasks] = useState([]);
  const [tags, setTags] = useState([]);
  const [tagsList, setTagsList] = useState([]);
  const [missingStatuses, setMissingStatuses] = useState([]);

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
        console.log('Fetched tasks:', first);
      } catch (err) {
        console.error('Error fetching tasks:', err);
      }
    };
    
    fetchTasks();
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

  useEffect(() => {
    const fetchTasksAndCalculateMissing = () => {
      try {
        // Extract the tag_ids associated with the tasks
        const presentTagIds = new Set(tasks.map(task => task.tag_id));
        
        // Identify missing tags (tags that are in tagsList but not in presentTagIds)
        const missingTagNames = tagsList
          .filter(tag => !presentTagIds.has(tag.id))  // Compare by tag.id
          .map(tag => tag.name);  // Get the names of missing tags
        
        setMissingStatuses(missingTagNames);
        
      } catch (err) {
        console.error('Error calculating missing tags:', err);
      }
    };

    if (tasks.length > 0 && tagsList.length > 0) {
      fetchTasksAndCalculateMissing();
    }
  }, [tasks, tagsList]);

  return (
    <div className="w-full min-w-[300px] mx-auto mb-8 p-4">
      <ChartAnalysis tasks={tasks} tags={tagsList} />
      <h2 className="text-2xl font-medium mb-4">Suggestions</h2>
      <div className="bg-gray-100 p-4 rounded-lg border border-gray-300 flex flex-col items-center">
        {missingStatuses.length > 0 ? (
          <div>
            <p>It seems like you haven't planned out time for enough of the important categories of tags you have! Work/life balance is important for a healthy schedule!</p>
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
