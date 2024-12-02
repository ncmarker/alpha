import React from 'react';
import { Doughnut, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale } from 'chart.js';
import Chart from "chart.js/auto";

Chart.register(CategoryScale);

ChartJS.register(ArcElement, Tooltip, Legend);

export function ChartAnalysis({ tasks }) {
  const taskData = tasks || [];

  const totalTasks = taskData.reduce((sum, task) => sum + task.count, 0);

  const data = {
    labels: taskData.map(task => task.name),
    datasets: [
      {
        data: taskData.map(task => (task.count / totalTasks) * 100),
        backgroundColor: taskData.map(task => task.color),
        hoverBackgroundColor: taskData.map(task => `${task.color}80`),
      },
    ],
  };

  const options = {
    responsive: true, 
    maintainAspectRatio: false, 
    plugins: {
      tooltip: {
        callbacks: {
          label: (tooltipItem) => {
            const taskName = data.labels[tooltipItem.dataIndex];
            const percentage = Math.round(tooltipItem.raw);
            return `${taskName}: ${percentage.toFixed(2)}%`;
          },
        },
      },
    },
  };

  return (
    <div className="w-1/2 min-w-[300px] mx-auto mb-8 p-4">
        <h2 className="text-2xl font-medium mb-4">Task Distribution</h2>
        <div className="h-[400px] bg-gray-100 p-4 rounded-lg border border-gray-300 flex flex-col items-center">
            <div className="flex justify-center items-center h-full w-full p-4">
            <div className="h-full w-full">
                        <Doughnut data={data} options={options} />
                    </div>
            </div>
        </div>
    </div>

  );
}

export function FullChartAnalysis({ tasks }) {
  const taskData = tasks || [
    { name: 'Work', count: 5, color: '#ff6384' },
    { name: 'Fitness', count: 3, color: '#36a2eb' },
    { name: 'Sleep', count: 2, color: '#ffce56' },
    { name: 'Leisure', count: 4, color: '#4bc0c0' },
  ];

  const totalTasks = taskData.reduce((sum, task) => sum + task.count, 0);

  const data = {
    labels: taskData.map(task => task.name),
    datasets: [
      {
        data: taskData.map(task => (task.count / totalTasks) * 100),
        backgroundColor: taskData.map(task => task.color),
        hoverBackgroundColor: taskData.map(task => `${task.color}80`),
      },
    ],
  };

  const options = {
    responsive: true, 
    maintainAspectRatio: false, 
    plugins: {
      tooltip: {
        callbacks: {
          label: (tooltipItem) => {
            const taskName = data.labels[tooltipItem.dataIndex];
            const percentage = Math.round(tooltipItem.raw);
            return `${taskName}: ${percentage.toFixed(2)}%`;
          },
        },
      },
    },
  };

  const barOptions = {
    responsive: true, 
    maintainAspectRatio: false, 
    plugins: {
      tooltip: {
        callbacks: {
          label: (tooltipItem) => {
            const taskName = data.labels[tooltipItem.dataIndex];
            const percentage = Math.round(tooltipItem.raw);
            return `${taskName}: ${percentage.toFixed(2)}%`;
          },
        },
      }, 
      legend: {
        display: false
      }
    },
  };

  return (
    <div className="w-full min-w-[300px] mx-auto mb-8 p-4">
        <h2 className="text-2xl font-medium mb-4">Task Distribution</h2>
        <div className="h-[600px] bg-gray-100 p-4 rounded-lg border border-gray-300 flex flex-col items-center">
            <div className="flex justify-center items-center h-full w-full p-4 flex-col space-y-3">
              <div className="h-full w-full">
                          <Doughnut data={data} options={options} />
                          
              </div>
              <div className="w-full h-full">
                <Bar data={data} options={barOptions} />
              </div>
            </div>
             
        </div>
    </div>

  );
}

export function InsightBar({ tasks }) {
<<<<<<< Updated upstream
  const taskData = tasks || [
    { name: 'Work', count: 5, color: '#ff6384' },
    { name: 'Fitness', count: 3, color: '#36a2eb' },
    { name: 'Sleep', count: 2, color: '#ffce56' },
    { name: 'Leisure', count: 4, color: '#4bc0c0' },
  ];
  
  async function findMissingKeys(tableA, primaryKeyColumnA, tableB, foreignKeyColumnB) {
    // Fetch all primary keys from Table A
    const { data: primaryKeys, error: errorA } = await supabase
        .from(tableA)
        .select(primaryKeyColumnA);
        

    if (errorA) {
        console.error('Error fetching keys:', errorA);
        return null;
    }

    const allPrimaryKeys = primaryKeys.map(record => record[primaryKeyColumnA]);

    const { data: foreignKeys, error: errorB } = await supabase
        .from(tableB)
        .select(foreignKeyColumnB);

    if (errorB) {
        console.error('Error fetching keys:', errorB);
        return null;
    }

    // Extract the list of keys from Table B
    const presentKeys = foreignKeys.map(record => record[foreignKeyColumnB]);

    // Find keys in Table A that are not in Table B
    const missingKeys = allPrimaryKeys.filter(key => !presentKeys.includes(key));

    return missingKeys;
}



  const tableA = 'tags'; 
  const primaryKeyColumnA = 'tag_id'; 
  const tableB = 'reminders'; 
  const foreignKeyColumnB = 'tag_id'; 

  findMissingKeys(tableA, primaryKeyColumnA, tableB, foreignKeyColumnB).then(missingKeys => {
      console.log('Missing keys:', missingKeys);
  });

  if (!missingKeys) {
    const insightMessage = "Good job! You've logged tasks in all your listed categories! Balance is an important part of health work/life scheduling!"
} else {
  const insightMessage = "It seems like you're missing any tasks for "+ missingKeys+"Remember, balance is an important part of health work/life scheduling!"
}

  // const totalTasks = taskData.reduce((sum, task) => sum + task.count, 0);
=======
  // import React, { useState, useEffect } from 'react';



>>>>>>> Stashed changes

  return (
    <div className="w-full min-w-[300px] mx-auto mb-8 p-4">
        <h2 className="text-2xl font-medium mb-4">Task Distribution</h2>
        <div className="h-[600px] bg-gray-100 p-4 rounded-lg border border-gray-300 flex flex-col items-center">
            <div className="flex justify-center items-center h-full w-full p-4 flex-col space-y-3">
          <p>Hi!</p>
             
        </div>
    </div>
    </div>

  );
}