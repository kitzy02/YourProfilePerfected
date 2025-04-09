const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');
const User = require('./models/User');
const Profile = require('./models/Profile'); 

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log("✅ Connected to MongoDB");
}).catch(err => {
  console.error("❌ MongoDB connection error:", err);
});

app.get('/api/get-user', async (req, res) => {
    if (!req.userId) {
        return res.status(401).json({ message: 'Not logged in' });
    }

    const user = await User.findById(req.userId);
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    res.json({ username: user.username });
});

app.post('/api/saveProfile', async (req, res) => {
  try {
    const profile = new Profile(req.body);
    await profile.save();
    res.json({ success: true, message: 'Profile saved successfully!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Error saving profile' });
  }
});


// Signup route
app.post('/api/signup', async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.json({ success: false, message: 'All fields are required' });
  }

  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.json({ success: false, message: 'Username already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, email, password: hashedPassword });

    await newUser.save();
    res.json({ success: true, message: 'User created successfully' });
  } catch (err) {
    console.error(err);
    res.json({ success: false, message: 'Failed to create user' });
  }
});

// Login route
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.json({ success: false, message: 'All fields required' });
  }

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.json({ success: false, message: 'User not found' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.json({ success: false, message: 'Invalid password' });
    }

    res.json({ success: true, username: user.username, email: user.email });
  } catch (err) {
    console.error(err);
    res.json({ success: false, message: 'Login failed' });
  }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

