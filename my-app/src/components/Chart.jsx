import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

export function ChartAnalysis({ tasks }) {
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
