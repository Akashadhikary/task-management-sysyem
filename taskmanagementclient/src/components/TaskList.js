import React, { useState, useEffect } from "react";
import axios from "axios";
import TaskForm from "./TaskForm";
import TaskDetails from "./TaskDetails";
import SearchIcon from "@mui/icons-material/Search";
import AddBoxIcon from "@mui/icons-material/AddBox";
import CancelIcon from "@mui/icons-material/Cancel";
import VisibilityIcon from "@mui/icons-material/Visibility";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import DeleteIcon from "@mui/icons-material/Delete";
import DoneIcon from "@mui/icons-material/Done";
import Tooltip from "@mui/material/Tooltip";

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchTasks = async () => {
    try {
      const response = await axios.get("http://localhost:8000/tasks");
      //console.log(response);

      setTasks(response.data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const deleteTask = async (taskId) => {
    try {
      await axios.delete(`http://localhost:8000/tasks/${taskId}`);
      fetchTasks(); 
    } catch (err) {
      console.error('Error deleting task:', err);
    }
  };
  

  const markAsCompleted = async (taskId) => {
    try {
      await axios.patch(`http://localhost:8000/tasks/${taskId}/complete`);
      fetchTasks(); 
    } catch (err) {
      console.error('Error marking task as completed:', err);
    }
  };
  

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      alert("Please enter a search query.");
      return;
    }

    try {
      const response = await axios.get(
        `http://localhost:8000/tasks/search?query=${encodeURIComponent(
          searchQuery
        )}`
      );
      //console.log(response);

      setTasks(response.data);
    } catch (error) {
      console.error("Error searching tasks:", error);
      alert("Failed to perform search. Please try again.");
    }
  };

  const openTaskForm = (id = null) => {
    setSelectedTaskId(id);
    setIsFormOpen(true);
  };

  const openTaskDetails = (id) => {
    setSelectedTaskId(id);
    setIsDetailsOpen(true);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Task Management</h1>

      <div className="mb-4 flex gap-4">
        <div className="relative w-full flex">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tasks..."
            className="border p-2 rounded w-full pr-10"
          />
          {searchQuery && (
            <button
              onClick={() => {
                setSearchQuery("");
                fetchTasks();
              }}
              className="absolute right-2 top-1/2 mb-2 transform -translate-y-1/2 text-gray-500 hover:text-black"
            >
              <CancelIcon />
            </button>
          )}
        </div>
        <Tooltip title="Search task">
          <button
            onClick={handleSearch}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            <SearchIcon />
          </button>
        </Tooltip>
        <Tooltip title="Create new task">
          <button
            onClick={() => openTaskForm()}
            className="bg-green-500 text-white px-4 py-2 rounded"
          >
            <AddBoxIcon />
          </button>
        </Tooltip>
      </div>

      <ul className="space-y-4">
        {tasks.map((task) => (
          <li key={task._id} className="p-4 border rounded shadow">
            <div className="flex justify-between items-center">
              <div>
                <h2
                  className={`text-lg font-bold ${
                    task.status === "Completed"
                      ? "line-through text-gray-500"
                      : ""
                  }`}
                >
                  {task.title}
                </h2>
                <p className="text-sm text-gray-500">
                  Due: {new Date(task.dueDate).toLocaleDateString()}
                </p>
              </div>
              <div className="flex gap-2">
                <Tooltip title="View Task">
                  <button
                    onClick={() => openTaskDetails(task._id)}
                    className="bg-blue-500 text-white px-2 py-1 rounded"
                  >
                    <VisibilityIcon />
                  </button>
                </Tooltip>
                <Tooltip title="Edit Task">
                  <button
                    onClick={() => openTaskForm(task._id)}
                    className="bg-yellow-500 text-white px-2 py-1 rounded"
                  >
                    <ModeEditIcon />
                  </button>
                </Tooltip>
                <Tooltip title="Delete Task">
                  <button
                    onClick={() => deleteTask(task._id)}
                    className="bg-red-500 text-white px-2 py-1 rounded"
                  >
                    <DeleteIcon />
                  </button>
                </Tooltip>
                {task.status !== "Completed" && (
                  <Tooltip title="Mark as Completed">
                    <button
                      onClick={() => markAsCompleted(task._id)}
                      className="bg-green-500 text-white px-2 py-1 rounded"
                    >
                      <DoneIcon />
                    </button>
                  </Tooltip>
                )}
              </div>
            </div>
          </li>
        ))}
      </ul>

      {isFormOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-4 rounded shadow">
            <TaskForm
              taskId={selectedTaskId}
              onSave={() => {
                setIsFormOpen(false);
                fetchTasks();
              }}
              onCancel={() => setIsFormOpen(false)}
            />
          </div>
        </div>
      )}

      {isDetailsOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-4 rounded shadow">
            <TaskDetails
              taskId={selectedTaskId}
              onClose={() => setIsDetailsOpen(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskList;
