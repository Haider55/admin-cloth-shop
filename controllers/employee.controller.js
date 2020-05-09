const bcrypt = require("bcryptjs");
const passport = require("passport");
// Load Employee model
const Employee = require("../models/Employee");

//Login Function
exports.login = (req, res) => res.render("login");

//Register Funcion
exports.register = (req, res) => res.render("register");

//Handle Post Request to add a new employee
exports.registerEmployee = (req, res) => {
  const { name, email, password, password2 } = req.body;
  let errors = [];

  if (!name || !email || !password || !password2) {
    errors.push({ msg: "Please enter all fields" });
  }

  if (password != password2) {
    errors.push({ msg: "Passwords do not match" });
  }

  if (password.length < 6) {
    errors.push({ msg: "Password must be at least 6 characters" });
  }

  if (errors.length > 0) {
    res.render("register", {
      errors,
      name,
      email,
      password,
      password2
    });
  } else {
    Employee.findOne({ email: email }).then(employee => {
      if (employee) {
        errors.push({ msg: "Email already exists" });
        res.render("register", {
          errors,
          name,
          email,
          password,
          password2
        });
      } else {
        const newEmployee = new Employee({
          name,
          email,
          password
        });

        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newEmployee.password, salt, (err, hash) => {
            if (err) throw err;
            newEmployee.password = hash;
            newEmployee
              .save()
              .then(employee => {
                req.flash(
                  "success_msg",
                  "You are now registered and can log in"
                );
                res.redirect("/login");
              })
              .catch(err => console.log(err));
          });
        });
      }
    });
  }
};

//Handle post request to Login a Employee
exports.loginEmployee = (req, res, next) => {
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true
  })(req, res, next);
};

// Logout already logined employee
exports.logout = (req, res) => {
  req.logout();
  req.flash("success_msg", "You are logged out");
  res.redirect("/");
};

//create update delete

const pdf = require("html-pdf");
const fs = require("fs");
const options = { format: "A4" };

// test function
exports.test = function A(req, res) {
  res.render("test");
};

// Add new Employee function
exports.add = function A(req, res) {
  res.render("admin/employeeAdd");
};

exports.update = async function(req, res) {
  let employee = await Employee.findOne({ _id: req.params.id });
  res.render("admin/employeeUpdate", {
    employee
  });
};

exports.create = (req, res) => {
  let employee = new Employee({
    name: req.body.email,
    name: req.body.password,
    name: req.body.name,
    city: req.body.city,
    mobile: req.body.mobile
  });

  employee.save(function(err) {
    if (err) {
      return res
        .status(400)
        .json({ err: "Oops something went wrong! Cannont insert employee .." });
    }
    req.flash("employee_add_success_msg", "New  employee added successfully");
    res.redirect("/employee/all");
  });
};

exports.details = (req, res) => {
  Employee.findById(req.params.id, function(err, employee) {
    if (err) {
      return res.status(400).json({
        err: `Oops something went wrong! Cannont find employee with ${req.params.id}.`
      });
    }
    res.render("admin/employeeDetail", {
      employee
    });
  });
};

exports.all = (req, res) => {
  Employee.find(function(err,employees) {
    if (err) {
      return res
        .status(400)
        .json({ err: "Oops something went wrong! Cannont find employees." });
    }
    res.status(200).render("admin/employeeAll", {
      employees,
    });
    //res.send(employees);
  });
};

// Post Update to insert data in database
exports.updateEmployee = async (req, res) => {
  let result = await Employee.updateOne(
    { _id: req.params.id },
    { $set: req.body }
  );
  if (!result)
    return res.status(400).json({
      err: `Oops something went wrong! Cannont update employee with ${req.params.id}.`
    });
  req.flash("employee_update_success_msg", "employee updated successfully");
  res.redirect("/employee/all");
};

exports.delete = async (req, res) => {
  let result = await Employee.deleteOne({ _id: req.params.id });
  if (!result)
    return res.status(400).json({
      err: `Oops something went wrong! Cannont delete Employee with ${req.params.id}.`
    });
  req.flash("employee_del_success_msg", "Employee has been deleted successfully");
  res.redirect("/employee/all");
};

exports.allReport = (req, res) => {
  Employee.find(function(err, employees) {
    if (err) {
      return res
        .status(400)
        .json({ err: "Oops something went wrong! Cannont find employees." });
    }
    res.status(200).render(
      "reports/employee/allEmployee",
      {
        employees
       
      },
      function(err, html) {
        pdf
          .create(html, options)
          .toFile("uploads/allEmployees.pdf", function(err, result) {
            if (err) return console.log(err);
            else {
              var datafile = fs.readFileSync("uploads/allEmployees.pdf");
              res.header("content-type", "application/pdf");
              res.send(datafile);
            }
          });
      }
    );
  });
};

