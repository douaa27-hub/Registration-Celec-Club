const express = require("express");
const router = express.Router();

const {
  upload,
  submitRegistration,
  getAllRegistrations,
  getRegistrationById,
  updateStatus,
  deleteRegistration,
} = require("../controllers/controller");

const { registrationRules, checkErrors } = require("../middlewares/validation");


router.post(
  "/register",
  upload.fields([
    { name: "schoolCert", maxCount: 1 },
    { name: "cv", maxCount: 1 },
  ]),
  registrationRules,
  checkErrors,
  submitRegistration
);


// Get all registrations
router.get("/registrations", getAllRegistrations);

// Get one registration
router.get("/registrations/:id", getRegistrationById);

//  Update status
router.patch("/registrations/:id/status", updateStatus);

// Delete a registration
router.delete("/registrations/:id", deleteRegistration);

module.exports = router;