const express = require("express");
const router = express.Router();
// Load Employee Controller
const employeeController = require("../controllers/employee.controller");
const { forwardEmployeeAuthenticated } = require("../config/auth");

//Register Routes
// Login Page
router.get("/login", forwardEmployeeAuthenticated, employeeController.login);
// Register Page
router.get("/register", forwardEmployeeAuthenticated, employeeController.register);

// Register
router.post("/register", employeeController.registerEmployee);

// Login
router.post("/login", employeeController.loginEmployee);

// Logout
router.get("/logout", employeeController.logout);

module.exports = router;
