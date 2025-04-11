// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch((err) => console.log(err));

// Task Schema
const taskSchema = new mongoose.Schema({
    title: String,
    description: String,
    completed: { type: Boolean, default: false },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true } // Associate with user
});

const Task = mongoose.model('Task', taskSchema);

const userSchema = new mongoose.Schema({
    name: { type: String, required: true }, // Add name field
    userName: { type: String, required: true, unique: true },
    password: { type: String, required: true },
});
const User = mongoose.model('User', userSchema);


const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';


// CRUD API routes
// Create Task (protected route)
app.post('/tasks', async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'No token, authorization denied' });
  
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      //const task = new Task(req.body);
      const task = new Task({ ...req.body, userId: decoded.userId }); // Add userId to the task
      await task.save();
      res.json(task);
    } catch (err) {
      res.status(401).json({ message: 'Invalid token' });
    }
  });

// Get all Tasks
app.get('/tasks', async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'No token, authorization denied' });

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        const tasks = await Task.find({ userId: decoded.userId }); // Filter tasks by userId
        res.json(tasks);
    } catch (err) {
        res.status(401).json({ message: 'Invalid token' });
    }
});

// Update Task
app.put('/tasks/:id', async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'No token, authorization denied' });

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        const task = await Task.findOneAndUpdate(
            { _id: req.params.id, userId: decoded.userId }, // Ensure the task belongs to the user
            req.body,
            { new: true }
        );
        if (!task) return res.status(404).json({ message: 'Task not found or unauthorized' });
        res.json(task);
    } catch (err) {
        res.status(401).json({ message: 'Invalid token' });
    }
});

// Delete Task
app.delete('/tasks/:id', async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'No token, authorization denied' });

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        const task = await Task.findOneAndDelete({ _id: req.params.id, userId: decoded.userId }); // Ensure the task belongs to the user
        if (!task) return res.status(404).json({ message: 'Task not found or unauthorized' });
        res.json({ message: 'Task deleted' });
    } catch (err) {
        res.status(401).json({ message: 'Invalid token' });
    }
});




// Signup Route (User Registration)
app.post('/signup', async (req, res) => {
    const { name, userName, password } = req.body; // Include name
    const existingUser = await User.findOne({ userName });
    if (existingUser) return res.status(400).json({ message: 'User already exists' });

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const newUser = new User({ name, userName, password: hashedPassword }); // Save name
    await newUser.save();
    res.status(201).json({ message: 'User created successfully' });
});
  
// Login Route (User Authentication)
app.post('/login', async (req, res) => {
    const { userName, password } = req.body;
    const user = await User.findOne({ userName });
    if (!user) return res.status(400).json({ message: 'User not found' });
  
    // Check if password matches
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });
  
    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  });


// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
