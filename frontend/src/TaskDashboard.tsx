import React, { useState, useEffect } from 'react';
import axios from 'axios';

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
    <div>
      <button onClick={handleLogout}>Logout</button> {/* Logout button */}
      <h1>Task Manager</h1>
      <input
        type="text"
        placeholder="Task Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <input
        type="text"
        placeholder="Task Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <label>
        <input
          type="checkbox"
          checked={completed}
          onChange={(e) => setCompleted(e.target.checked)} // Toggle completed state
        />
        Completed
      </label>
      <button onClick={editing ? editTask : createTask}>
        {editing ? 'Update Task' : 'Create Task'}
      </button>

      <ul>
        {tasks.map(task => (
          <li key={task._id}>
            <h3>{task.title}</h3>
            <p>{task.description}</p>
            <p>Status: {task.completed ? 'Completed' : 'Incomplete'}</p> {/* Display completed status */}
            <button onClick={() => startEdit(task)}>Edit</button>
            <button onClick={() => deleteTask(task._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TaskDashboard;