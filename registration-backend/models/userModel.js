const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    // --- Personal Info ---
    fullName: {
      type: String,
      required: true,
      trim: true,
    },

    dateOfBirth: {
      type: Date,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,    // no duplicate emails
      lowercase: true,
      trim: true,
    },

    phoneNumber: {
      type: String,
      required: true,
      trim: true,
    },

    // --- Membership ---
    isMember: {
      type: Boolean,
      default: false,
    },

    isUsthbStudent: {
      type: Boolean,
      default: false,
    },

    studentId: {
      type: String,
      default: null,
    },

    // --- Academic Info ---
    studyLevel: {
      type: String,
      enum: ["L1", "L2", "L3", "M1", "M2", "Engineer", "PhD", "Other"],
      default: null,
    },

    fieldOfStudy: {
      type: String,
      default: null,
    },

    department: {
      type: String,
      default: null,
    },

    // --- Skills & Interests ---
    skills: {
      type: [String],
      default: [],
    },

    areasOfInterest: {
      type: [String],
      default: [],
    },

    // --- Links ---
    linkedin: {
      type: String,
      default: null,
    },

    github: {
      type: String,
      default: null,
    },

    // --- Projects ---
    completedProjects: {
      type: [
        {
          title: String,
          description: String,
          url: String,
        },
      ],
      default: [],
    },

    // --- Motivation ---
    motivation: {
      type: String,
      required: true,
    },

    // --- File Uploads ---
    schoolCertUrl: {
      type: String,
      default: null,
    },

    cvUrl: {
      type: String,
      default: null,
    },

    // --- Admin Status ---
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },
  },
  {
    timestamps: true, // adds createdAt and updatedAt automatically
  }
);

const User = mongoose.model("User", userSchema);

module.exports = User;