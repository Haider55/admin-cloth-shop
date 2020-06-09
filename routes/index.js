const express = require("express");
const router = express.Router();
const {
  ensureEmployeeAuthenticated,
  forwardEmployeeAuthenticated
} = require("../config/auth");
const {
  ensureAdminAuthenticated,
  forwardAdminAuthenticated
} = require("../config/auth");

// Welcome Page
router.get("/", forwardEmployeeAuthenticated, (req, res) => res.render("welcome"));
router.get("/register", forwardEmployeeAuthenticated, (req, res) => res.render("register"));
router.get("/login", forwardEmployeeAuthenticated, (req, res) => res.render("login"));
//admin pages
router.get("/admin", forwardAdminAuthenticated, (req, res) => res.render("admin/welcome"));
router.get("/admin/login", forwardAdminAuthenticated, (req, res) => res.render("admin/login"));
router.get("/admin/register", forwardAdminAuthenticated, (req, res) => res.render("admin/register"));
router.get("/admin/add", forwardAdminAuthenticated, (req, res) => res.render("admin/productAdd"));
router.get("/admin/employee", forwardAdminAuthenticated, (req, res) => res.render("admin/employeeAdd"));
router.get("/admin/dashboard", ensureAdminAuthenticated, (req, res) =>
  res.render("admin/dashboard", {
    admin: req.admin
  })
);
// Dashboard
router.get("/dashboard", ensureEmployeeAuthenticated, (req, res) =>
  res.render("dashboard", {
    employee : req.employee
  })
);

// Logout
router.get("/logout", (req, res) => {
  req.logout();
  req.flash("success_msg", "You are logged out");
  res.redirect("/");
});

module.exports = router;
