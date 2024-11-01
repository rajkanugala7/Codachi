const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Student = require('../models/Student');
const Teacher = require('../models/Teacher');
const Admin = require('../models/Admin');

// Map role names to their respective models
const roleModelMap = {
  Student: Student,
  Teacher: Teacher,
  Admin: Admin,
};

// Backend: Controllers/AuthController.js
const loginUser = async (req, res) => {
  let { email, password, role } = req.body;
  try {
    let user;
    if (role === 'Student') {
      user = await Student.findOne({ email: new RegExp(`^${email}$`, 'i') });
    } else if (role === 'Teacher') {
      user = await Teacher.findOne({ email: new RegExp(`^${email}$`, 'i') });
    } else if (role === 'Admin') {
      user = await Admin.findOne({ email: new RegExp(`^${email}$`, 'i') });
    } else {
      return res.status(400).json({ error: "Invalid role provided" });
    }

    if (!user) return res.status(404).json({ error: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: "Invalid credentials" });

    const token = jwt.sign(
      { id: user._id, role },
      process.env.JWT_SECRET || "yourSecretKey",
      { expiresIn: "1h" }
    );

    res.status(200).json({ token, role, user });
  } catch (error) {
    res.status(500).json({ error: "Server error", details: error.message });
  }
};

// Middleware for verifying the presence and validity of the token
const verifyToken = (req, res, next) => {
  try {
    // Extract the token from the Authorization header
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(403).json({ error: "No token provided" });

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "yourSecretKey");

    // Attach user info to request object for use in subsequent handlers
    req.user = decoded; // Add the decoded user info to the request object
    next(); // Move to the next middleware or route handler
  } catch (error) {
    console.error("Token verification error:", error); // Log the error for debugging
    res.status(401).json({ error: "Invalid token", details: error.message });
  }
};

module.exports = {
  loginUser,
  verifyToken,
};
