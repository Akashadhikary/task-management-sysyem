import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CancelIcon from '@mui/icons-material/Cancel';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import Tooltip from '@mui/material/Tooltip';

const TaskForm = ({ taskId, onSave, onCancel }) => {
  const [task, setTask] = useState({
    title: '',
    description: '',
    dueDate: '',
    priority: '',
  });

  useEffect(() => {
    const fetchTask = async () => {
      try {
        if (taskId) {
          const response = await axios.get(`http://localhost:8000/tasks/${taskId}`);
          //console.log(response);
          setTask(response.data);
        }
      } catch (err) {
        console.error('Error fetching task:', err);
      }
    };

    fetchTask();
  }, [taskId]);

  const handleChange = (e) => {
    setTask({ ...task, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!task.title || !task.description || !task.dueDate || !task.priority) {
      alert("Please fill in all fields.");
      return; // Stop the submission process
    }

    try {
      let response;
      if (taskId) {
        response = await axios.put(`http://localhost:8000/tasks/${taskId}`, task);
        //console.log(response);
        
      } else {
        response = await axios.post('http://localhost:8000/tasks', task);
        //console.log(response);
      }
      onSave(response.data);
    } catch (err) {
      console.error('Error submitting task:', err);
    }
  };
  

  if (!task) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-4 border rounded bg-gray-100">
      <h2 className="text-lg font-bold mb-4">{taskId ? 'Edit Task' : 'Create Task'}</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium">Title</label>
          <input
            type="text"
            name="title"
            value={task.title}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium">Description</label>
          <textarea
            name="description"
            value={task.description}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          ></textarea>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium">Due Date</label>
          <input
            type="date"
            name="dueDate"
            value={task.dueDate}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium">Priority</label>
          <select
            name="priority"
            value={task.priority}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          >
            <option>Select one</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>

        <div className="flex justify-end gap-2">
          {/* Cancel Button */}
          <Tooltip title="Cancel" placement="top">
            <button type="button" onClick={onCancel} className="px-4 py-2 bg-gray-500 text-white rounded">
              <CancelIcon />
            </button>
          </Tooltip>

          {/* Save Button */}
          <Tooltip title="Save Task" placement="top">
            <button type="submit" onClick={handleSubmit} className="px-4 py-2 bg-blue-500 text-white rounded">
              <BookmarkIcon />
            </button>
          </Tooltip>
        </div>
      </form>
    </div>
  );
};

export default TaskForm;
