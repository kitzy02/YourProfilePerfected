require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log("MongoDB Connection Error:", err));

// Define Mongoose Schema
const userSchema = new mongoose.Schema({
  firstName: String,
  middleName: String,
  lastName: String,
  phone: String,
  email: String,
  location: String,
  linkedin: String,
  github: String,
  summary: String,
  education: [
    {
      school: String,
      degree: String,
      field: String,
      graduationYear: String,
    },
  ],
  experience: [
    {
      jobTitle: String,
      company: String,
      duration: String,
    },
  ],
  projects: [
    {
      projectName: String,
      description: String,
    },
  ],
  hobbies: String,
  languages: String,
  activities: String,
});

const User = mongoose.model("User", userSchema);

// API Route to Save Data
app.post("/save-profile", async (req, res) => {
  try {
    const newUser = new User(req.body);
    await newUser.save();
    res.status(201).json({ message: "Profile Saved Successfully!" });
  } catch (error) {
    res.status(500).json({ error: "Failed to save profile" });
  }
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
