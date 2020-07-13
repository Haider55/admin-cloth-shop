const express = require("express")
const route = express.Router()
const productModel = require("../models/product.model")

route.get("/", async (req, res) => {
    const {date} = req.query; // you can used this to apply updates and perform search events
    const products = await productModel.find({}).limit(20)
    res.json({products})
 // the lime part would return the that amount of products 
})

module.exports = route