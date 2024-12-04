import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Pie, Line } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement);

const Dashboard = () => {
  const [taskData, setTaskData] = useState({
    total: 0,
    completed: 0,
    pending: 0,
    priorityDistribution: {},
    deadlines: [],
  });

  useEffect(() => {
    const fetchTaskData = async () => {
      try {
        const response = await axios.get('http://localhost:8000/tasks');
        //console.log(response);
        
        const tasks = response.data;
        const completed = tasks.filter(task => task.status === 'Completed').length;
        const pending = tasks.length - completed;
  
        const priorityDistribution = tasks.reduce((acc, task) => {
          acc[task.priority] = (acc[task.priority] || 0) + 1;
          return acc;
        }, {});
  
        const deadlines = tasks
          .filter(task => task.dueDate)
          .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
          .slice(0, 5);
  
        setTaskData({
          total: tasks.length,
          completed,
          pending,
          priorityDistribution,
          deadlines,
        });
      } catch (err) {
        console.error('Error fetching tasks:', err);
      }
    };
  
    fetchTaskData();
  }, []);
  
  const pieData = {
    labels: Object.keys(taskData.priorityDistribution),
    datasets: [{
      data: Object.values(taskData.priorityDistribution),
      backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
    }],
  };

  const lineData = {
    labels: ['Completed', 'Pending'],
    datasets: [{
      label: 'Tasks Status',
      data: [taskData.completed, taskData.pending],
      backgroundColor: ['#4CAF50', '#FFC107'],
      borderColor: '#ccc',
      borderWidth: 1,
    }],
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Task Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-4 shadow rounded">
          <h2 className="text-lg font-bold mb-2">Task Priority Distribution</h2>
          <Pie data={pieData} />
        </div>

        <div className="bg-white p-4 shadow rounded">
          <h2 className="text-lg font-bold mb-2">Completion Status</h2>
          <Line data={lineData} />
        </div>
      </div>

      <div className="mt-6 bg-white p-4 shadow rounded">
        <h2 className="text-lg font-bold mb-2">Upcoming Deadlines</h2>
        <ul>
          {taskData.deadlines.map((task) => (
            <li key={task._id} className="border-b py-2">
              <span className="font-bold">{task.title}</span> - Due: {new Date(task.dueDate).toLocaleDateString()}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;
