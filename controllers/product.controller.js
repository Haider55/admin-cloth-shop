const Product = require("../models/product.model");
const pdf = require("html-pdf");
const fs = require("fs");
const options = { format: "A4" };

// test function
exports.test = function A(req, res) {
  res.render("test");
};

// Add new product function
exports.add = function A(req, res) {
  res.render("admin/productAdd");
};

exports.update = async function(req, res) {
  let product = await Product.findOne({ _id: req.params.id });
  res.render("admin/productUpdate", {
    product
  });
};

exports.create = (req, res) => {
  let product = new Product({
    
    title: req.body.title,
    imageURL: req.body.imageURL,
    price: req.body.price,
    description: req.body.description
  });

  product.save(function(err) {
    if (err) {
      return res
        .status(400)
        .json({ err: "Oops something went wrong! Cannont insert product .." });
    }
    req.flash("product_add_success_msg", "New  product added successfully");
    res.redirect("/product/all");
  });
};

exports.details = (req, res) => {
  Product.findById(req.params.id, function(err, product) {
    if (err) {
      return res.status(400).json({
        err: `Oops something went wrong! Cannont find product with ${req.params.id}.`
      });
    }
    res.render("admin/productDetail", {
      product
    });
  });
};

exports.all = (req, res) => {
  Product.find(function(err,products) {
    if (err) {
      return res
        .status(400)
        .json({ err: "Oops something went wrong! Cannont find products." });
    }
    res.status(200).render("admin/productAll", {
      products,
    });
    //res.send(products);
  });
};

// Post Update to insert data in database
exports.updateProduct = async (req, res) => {
  let result = await Product.updateOne(
    { _id: req.params.id },
    { $set: req.body }
  );
  if (!result)
    return res.status(400).json({
      err: `Oops something went wrong! Cannont update product with ${req.params.id}.`
    });
  req.flash("product_update_success_msg", "product updated successfully");
  res.redirect("/product/all");
};

exports.delete = async (req, res) => {
  let result = await Product.deleteOne({ _id: req.params.id });
  if (!result)
    return res.status(400).json({
      err: `Oops something went wrong! Cannont delete product with ${req.params.id}.`
    });
  req.flash("product_del_success_msg", "product has been deleted successfully");
  res.redirect("/product/all");
};

exports.allReport = (req, res) => {
  Product.find(function(err, products) {
    if (err) {
      return res
        .status(400)
        .json({ err: "Oops something went wrong! Cannont find products." });
    }
    res.status(200).render(
      "reports/admin/allProduct",
      {
        products
       
      },
      function(err, html) {
        pdf
          .create(html, options)
          .toFile("uploads/allProductss.pdf", function(err, result) {
            if (err) return console.log(err);
            else {
              var datafile = fs.readFileSync("uploads/allProducts.pdf");
              res.header("content-type", "application/pdf");
              res.send(datafile);
            }
          });
      }
    );
  });
};
