const express = require("express");
const router = express.Router();

const product_controller = require("../controllers/product.controller");

router.get("/test", product_controller.test);

router.get("/add",  product_controller.add);
router.post("/add",  product_controller.create);

router.get("/all", product_controller.all);
router.get("/:id", product_controller.details);
router.get("/update/:id", product_controller.update);
router.post("/update/:id", product_controller.updateProduct);
router.get("/delete/:id",  product_controller.delete);

//categories > subcategories
router.get('/categories/:category/:subcategory', product_controller.subcategories);

//subcategories
router.get('/tags/:subcategory', product_controller.tags)

router.get("/report/all", product_controller.allReport);

module.exports = router;