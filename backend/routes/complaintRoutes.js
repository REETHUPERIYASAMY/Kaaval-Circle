// backend/routes/complaintRoutes.js
/*
const express = require("express");
const router = express.Router();
const multer = require("multer");
const {
  createComplaint,
  getComplaints,
  updateComplaintStatus,
} = require("../controllers/complaintController");
const { protect, authorize } = require("../middleware/auth");

// Multer setup
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // make sure 'uploads' folder exists
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage: storage });

// Apply multer middleware before createComplaint
router
  .route("/")
  .post(protect, authorize("citizen"), upload.array("evidence"), createComplaint)
  .get(protect, getComplaints);

router.route("/:id").put(protect, authorize("police"), updateComplaintStatus);

module.exports = router;
*/
const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const {
  createComplaint,
  getComplaints,
  updateComplaintStatus,
} = require("../controllers/complaintController");
const { protect, authorize } = require("../middleware/auth");

router
  .route("/")
  .post(protect, authorize("citizen"), upload.array("evidence"), createComplaint)
  .get(protect, getComplaints);

router.route("/:id").put(protect, authorize("police"), updateComplaintStatus);

module.exports = router;