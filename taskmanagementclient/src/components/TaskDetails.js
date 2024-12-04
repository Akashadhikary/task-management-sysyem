import React, { useEffect, useState } from "react";
import axios from "axios";
import CancelIcon from "@mui/icons-material/Cancel";
import Tooltip from "@mui/material/Tooltip";

const TaskDetails = ({ taskId, onClose }) => {
  const [task, setTask] = useState(null);

  useEffect(() => {
    const fetchTask = async () => {
        try {
          const response = await axios.get(`http://localhost:8000/tasks/${taskId}`);
          //console.log(response);
          setTask(response.data);
        } catch (err) {
          console.error(err);
        }
      };
  
      if (taskId) {
        fetchTask();
      }
    }, [taskId]);

  if (!task) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-4 border rounded bg-white shadow-md">
      <h2 className="text-lg font-bold">{task.title}</h2>
      <p className="text-sm text-gray-500">
        {new Date(task.dueDate).toLocaleDateString()}
      </p>
      <p className="mt-2">{task.description}</p>
      <p className="mt-2">
        <strong>Priority:</strong> {task.priority}
      </p>
      <p className="mt-2">
        <strong>Status:</strong> {task.status}
      </p>

      <div className="mt-4 flex justify-end">
        <Tooltip title="Cancel">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-500 text-white rounded"
          >
            <CancelIcon />
          </button>
        </Tooltip>
      </div>
    </div>
  );
};

export default TaskDetails;
