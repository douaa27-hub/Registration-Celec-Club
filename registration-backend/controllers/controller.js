const User = require("../models/userModel");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// --- File Upload Setup ---
if (!fs.existsSync("uploads")) {
  fs.mkdirSync("uploads");
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); 
  },
  filename: (req, file, cb) => {
    
    const uniqueName = Date.now() + path.extname(file.originalname);
    cb(null, uniqueName);
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, 
  fileFilter: (req, file, cb) => {
    const allowed = [".pdf", ".jpg", ".jpeg", ".png"];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowed.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error("Only PDF, JPG, and PNG files are allowed"));
    }
  },
});

// --- Submit a new registration ---
const submitRegistration = async (req, res) => {
  try {
    const existing = await User.findOne({ email: req.body.email });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: "This email is already registered",
      });
    }

    
    const userData = {
      fullName:        req.body.fullName,
      dateOfBirth:     req.body.dateOfBirth,
      email:           req.body.email,
      phoneNumber:     req.body.phoneNumber,
      isMember:        req.body.isMember,
      isUsthbStudent:  req.body.isUsthbStudent,
      studentId:       req.body.studentId || null,
      studyLevel:      req.body.studyLevel || null,
      fieldOfStudy:    req.body.fieldOfStudy || null,
      department:      req.body.department || null,
      skills:          req.body.skills ? JSON.parse(req.body.skills) : [],
      areasOfInterest: req.body.areasOfInterest ? JSON.parse(req.body.areasOfInterest) : [],
      linkedin:        req.body.linkedin || null,
      github:          req.body.github || null,
      completedProjects: req.body.completedProjects ? JSON.parse(req.body.completedProjects) : [],
      motivation:      req.body.motivation,
    };

    
    if (req.files && req.files.schoolCert) {
      userData.schoolCertUrl = req.files.schoolCert[0].path;
    }
    if (req.files && req.files.cv) {
      userData.cvUrl = req.files.cv[0].path;
    }

   
    const newUser = await User.create(userData);

    res.status(201).json({
      success: true,
      message: "Registration submitted successfully!",
      data: {
        id:     newUser._id,
        name:   newUser.fullName,
        email:  newUser.email,
        status: newUser.status,
      },
    });

  } catch (error) {
    console.error("Error saving registration:", error.message);
    res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again.",
    });
  }
};


const getAllRegistrations = async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 }); // newest first
    res.status(200).json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Could not fetch registrations." });
  }
};

// --- Get one registration by ID ---
const getRegistrationById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: "Registration not found." });
    }
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: "Could not fetch registration." });
  }
};

// --- Update registration status ---
const updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const allowed = ["pending", "accepted", "rejected"];

    if (!allowed.includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid status." });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true } 
    );

    if (!user) {
      return res.status(404).json({ success: false, message: "Registration not found." });
    }

    res.status(200).json({ success: true, message: "Status updated.", data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: "Could not update status." });
  }
};

// --- Delete a registration ---
const deleteRegistration = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: "Registration not found." });
    }
    res.status(200).json({ success: true, message: "Registration deleted." });
  } catch (error) {
    res.status(500).json({ success: false, message: "Could not delete registration." });
  }
};

module.exports = {
  upload,
  submitRegistration,
  getAllRegistrations,
  getRegistrationById,
  updateStatus,
  deleteRegistration,
};