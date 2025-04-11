import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

interface Task {
  _id: string;
  title: string;
  description: string;
  completed: boolean; // Added completed property
}

interface TaskDashboardProps {
  setToken: (token: string | null) => void;
}

function TaskDashboard({ setToken }: TaskDashboardProps) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [completed, setCompleted] = useState(false); // New state for completed
  const [editing, setEditing] = useState(false);
  const [taskId, setTaskId] = useState('');

  useEffect(() => {
    // Fetch tasks from the server
    axios.get('http://localhost:5005/tasks', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } // Include token
    })
    .then(response => setTasks(response.data));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token'); // Remove token from localStorage
    setToken(null); // Reset token state in App
  };

  const createTask = () => {
    axios.post('http://localhost:5005/tasks', { title, description, completed }, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } // Include token
    })
    .then((response) => {
      setTasks((prevTasks) => [...prevTasks, response.data]); // Add the new task to the existing tasks
      setTitle('');
      setDescription('');
      setCompleted(false);
    })
    .catch((err) => {
      console.error('Error creating task:', err);
      alert('Failed to create task.');
    });
  };

  const editTask = () => {
    axios.put(`http://localhost:5005/tasks/${taskId}`, { title, description, completed }, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } // Include token
    })
    .then((response) => {
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task._id === taskId ? response.data : task // Replace the edited task with the updated one
        )
      );
      setTitle('');
      setDescription('');
      setCompleted(false);
      setEditing(false);
    })
    .catch((err) => {
      console.error('Error editing task:', err);
      alert('Failed to edit task.');
    });
  };

  const deleteTask = (id: string) => {
    axios.delete(`http://localhost:5005/tasks/${id}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } // Include token
    })
    .then(() => {
      setTasks((prevTasks) => prevTasks.filter((task) => task._id !== id)); // Remove the deleted task
      console.log('Task Deleted');
    })
    .catch((err) => {
      console.error('Error deleting task:', err);
      alert('Failed to delete task.');
    });
  };

  const startEdit = (task: Task) => {
    setTitle(task.title);
    setDescription(task.description);
    setCompleted(task.completed); // Set completed state
    setTaskId(task._id);
    setEditing(true);
  };

  return (
    <div className="min-h-screen bg-[#003135]">
      <div className="max-w-4xl mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-[#AFDDE5]">Task Manager</h1>
          <button
            onClick={handleLogout}
            className="px-4 py-2 text-gray-900 bg-[#964734] rounded-lg hover:bg-[#024950] focus:outline-none focus:ring focus:ring-[#964734]"
          >
            Logout
          </button>
        </div>
        <div className="bg-[#AFDDE5] p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold text-[#024950] mb-4">{editing ? 'Edit Task' : 'Create Task'}</h2>
          <input
            type="text"
            placeholder="Task Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-2 mb-4 border border-[#024950] rounded-lg focus:outline-none focus:ring focus:ring-[#0FA4AF]"
          />
          <input
            type="text"
            placeholder="Task Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-4 py-2 mb-4 border border-[#024950] rounded-lg focus:outline-none focus:ring focus:ring-[#0FA4AF]"
          />
          <label className="flex items-center mb-4">
            <input
              type="checkbox"
              checked={completed}
              onChange={(e) => setCompleted(e.target.checked)}
              className="mr-2"
            />
            <span className="text-[#024950]">Completed</span>
          </label>
          <button
            onClick={editing ? editTask : createTask}
            className="w-full px-4 py-2 text-gray-900 bg-[#0FA4AF] rounded-lg hover:bg-[#024950] focus:outline-none focus:ring focus:ring-[#0FA4AF]"
          >
            {editing ? 'Update Task' : 'Create Task'}
          </button>
        </div>
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {tasks.map((task) => (
            <li key={task._id} className="bg-[#AFDDE5] p-4 rounded-lg shadow-md">
              <h3 className="text-lg font-bold text-[#024950]">{task.title}</h3>
              <p className="text-[#024950]">{task.description}</p>
              <p className="text-sm text-[#964734]">Status: {task.completed ? 'Completed' : 'Incomplete'}</p>
              <div className="flex space-x-4 mt-4">
                <button
                  onClick={() => startEdit(task)}
                  className="px-4 py-2 text-gray-900 bg-[#0FA4AF] rounded-lg hover:bg-[#024950] focus:outline-none focus:ring focus:ring-[#0FA4AF]"
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteTask(task._id)}
                  className="px-4 py-2 text-gray-900 bg-[#964734] rounded-lg hover:bg-[#024950] focus:outline-none focus:ring focus:ring-[#964734]"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default TaskDashboard;