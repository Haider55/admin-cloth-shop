const express = require("express");
const router = express.Router();
// Load Employee Controller
const employeeController = require("../controllers/employee.controller");
const { forwardEmployeeAuthenticated } = require("../config/auth");

const express = require("express");
const router = express.Router();

const employee_controller = require("../controllers/employee.controller");

router.get("/test", employee_controller.test);

router.get("/add",  employee_controller.add);
router.post("/add",  employee_controller.create);

router.get("/all", employee_controller.all);
router.get("/:id", employee_controller.details);
router.get("/update/:id", employee_controller.update);
router.post("/update/:id", employee_controller.updateEmployee);
router.get("/delete/:id",  employee_controller.delete);

router.get("/report/all", employee_controller.allReport);

module.exports = router;

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
