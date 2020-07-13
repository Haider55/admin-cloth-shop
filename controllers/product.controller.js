const Product = require("../models/product.model");
const pdf = require("html-pdf");
const fs = require("fs");
const path = require("path");
const multer = require("multer");
const options = { format: "A4" };

const IMAGE_DIR = path.join(__dirname, 'image-uploads');
if (!fs.existsSync(IMAGE_DIR)){
  try {
    fs.mkdirSync(IMAGE_DIR);
  } catch (error) {
    // blank
  }
}

var upload = multer({ storage: multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, IMAGE_DIR)
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now())
    }
  })
}).single('avatar');

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

  upload(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      return req.status(500).send('Something went wrong while uploading image!');
    } else if (err) {
      // An unknown error occurred when uploading.
      return req.status(500).send('Something went wrong while uploading image!');
    }

    const filename = (req.file && req.file.filename) ? req.file.filename : '';

    //////////////////////////////
    // Create record in DB
    //////////////////////////////
    let product = new Product({
      title: req.body.title,
      imageURL: filename,
      price: req.body.price,
      description: req.body.description,
      category: req.body.category,
      subcategory: req.body.subcategory
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
    //////////////////////////////

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

//categories

exports.categories = (req, res) => {
  //search for category from the database
  Product.find({category: req.params.category}, (err, products) => {
    if(err){
      return res
        .status(400)
        .json({ err: "Oops something went wrong! Cannot find products." });
    }
    if(!products){
            return res
        .status(400)
        .json({ err: "No products on that category." });
    }
    res.status(200).render("admin/categories", {products, category: req.params.category})
  });
}

// filter for a combination of a category and a subcategory
exports.subcategories = (req, res) => {
  Product.find({subcategory: req.params.subcategory}).where('category').equals(req.params.category).exec((err, products) => {
    if(err || !products){
      return res.status(400).json({err: 'No products found..'});
    }
    res.status(200).render("admin/categories", {products, category: req.params.category, subcategory: req.param.subcategory});
  })
  //just a sec
}

//filter for a specific sub category
exports.tags = (req, res) => {
  Product.find({subcategory: req.params.subcategory}, (err, products) => {
    if(err){
      return res
        .status(400)
        .json({ err: "Oops something went wrong! Cannot find products." });
    }
    if(!products){
            return res
        .status(400)
        .json({ err: "No products on that category." });
    }
    res.status(200).render("admin/categories", {products, category: req.params.subcategory});
  })
}
// Post Update to insert data in database
// Post Update to insert data in database
exports.updateProduct = async (req, res) => {

  upload(req, res, async function (err) {
    if (err instanceof multer.MulterError) {
      return req.status(500).send('Something went wrong while uploading image!');
    } else if (err) {
      // An unknown error occurred when uploading.
      return req.status(500).send('Something went wrong while uploading image!');
    }

    const product = await Product.findById(req.params.id);

    const filename = (req.file && req.file.filename) ? req.file.filename : '';
    if(!!filename) {
      const oldImageFilename = product.imageURL;
      req.body.imageURL = filename;

      try {
        if(!!oldImageFilename && fs.existsSync(path.join(IMAGE_DIR, oldImageFilename))) {
          fs.unlinkSync(path.join(IMAGE_DIR, oldImageFilename));
        }
      } catch(err) {
        // blank
      }

    }

    /////////////////////
    let result = await Product.updateOne(
      { _id: req.params.id },
      { $set: req.body }
    );

    if (!result) {
      return res.status(400).json({
        err: `Oops something went wrong! Cannont update product with ${req.params.id}.`
      });
    }

    req.flash("product_update_success_msg", "product updated successfully");
    res.redirect("/product/all");
    //////////////////////

  });
};

exports.delete = async (req, res) => {
  let product = await Product.findById(req.params.id);
  let result = await Product.deleteOne({ _id: req.params.id });

  if (!result) {
    return res.status(400).json({
      err: `Oops something went wrong! Cannot delete product with ${req.params.id}.`
    });
  }

  try {
    if(!!product.imageURL && fs.existsSync(path.join(IMAGE_DIR, product.imageURL))) {
      fs.unlinkSync(path.join(IMAGE_DIR, product.imageURL));
    }
  } catch(err) {
    // blank
  }

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
