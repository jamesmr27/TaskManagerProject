import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface Task {
  _id: string;
  title: string;
  description: string;
  completed: boolean; // Added completed property
}

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [completed, setCompleted] = useState(false); // New state for completed
  const [editing, setEditing] = useState(false);
  const [taskId, setTaskId] = useState('');

  useEffect(() => {
    // Fetch tasks from the server
    axios.get('http://localhost:5005/tasks')
      .then(response => setTasks(response.data));
  }, [tasks]);

  const createTask = () => {
    axios.post('http://localhost:5005/tasks', { title, description, completed }) // Include completed
      .then(response => {
        setTitle('');
        setDescription('');
        setCompleted(false); // Reset completed state
      });
  };

  const editTask = () => {
    axios.put(`http://localhost:5005/tasks/${taskId}`, { title, description, completed }) // Include completed
      .then(response => {
        setTitle('');
        setDescription('');
        setCompleted(false); // Reset completed state
        setEditing(false);
      });
  };

  const deleteTask = (id: string) => {
    axios.delete(`http://localhost:5005/tasks/${id}`)
      .then(response => console.log('Task Deleted'));
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

export default App;