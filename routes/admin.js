const express = require("express");
const router = express.Router();
// Load User Controller
const adminController = require("../controllers/admin.controller");
const {
  forwardAdminAuthenticated,
  ensureAdminAuthenticated
} = require("../config/auth");

//Register Routes
// Dashboard
router.get("/dashboard", ensureAdminAuthenticated, (req, res) =>
  res.render("admin/dashboard", {
    user: req.user
  })
);

// Login Page
router.get("/login", forwardAdminAuthenticated, adminController.login);

// Register Page
router.get("/register", forwardAdminAuthenticated, adminController.register);

// Register
router.post("/register", adminController.registerAdmin);

// Login
router.post("/login", adminController.loginAdmin);

// Logout
router.get("/logout", adminController.logout);

module.exports = router;
