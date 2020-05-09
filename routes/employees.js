const express = require("express");
const router = express.Router();
// Load Employee Controller
const employeeController = require("../controllers/employee.controller");
const { forwardEmployeeAuthenticated } = require("../config/auth");

router.get("/test", employeeController.test);

router.get("/add",  employeeController.add);
router.post("/add",  employeeController.create);

router.get("/all", employeeController.all);
router.get("/:id", employeeController.details);
router.get("/update/:id", employeeController.update);
router.post("/update/:id", employeeController.updateEmployee);
router.get("/delete/:id",  employeeController.delete);

router.get("/report/all", employeeController.allReport);

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
