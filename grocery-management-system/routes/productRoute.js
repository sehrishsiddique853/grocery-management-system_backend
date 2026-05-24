const express = require("express");
const fs = require("fs");
const Product = require("../model/productModel");

const router = express.Router();

// Home page
router.get("/", (req, res) => {
    res.render("index");
});

// Insert products from JSON file
router.get("/insert", async (req, res) => {
    try {
        const data = fs.readFileSync("productsInformation.json", "utf8");
        const parsedData = JSON.parse(data);
        await Product.insertMany(parsedData);
        res.redirect("/products");
    } catch (error) {
        res.status(500).render("error", { error: "Error inserting products" });
    }
});

// Display all products
router.get('/products', async (req, res) => {
    try {
        const products = await Product.find();
        res.render("products/allproducts", { products });
    } catch (error) {
        res.status(500).render("error", { error: error.message });
    }
});

// Display product detail
router.get('/products/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        res.render("products/product-detail", { product });
    } catch (error) {
        res.status(500).render("error", { error: error.message });
    }
});



// Display expired products
router.get("/product/expired", async (req, res) => {
    try {
        const todaydate = new Date();
        const products = await Product.find({ ExpiryDate: { $lt: todaydate } });
        res.render("products/expired-products", { products });
    } catch (error) {
        res.status(500).render("error", { error: error.message });
    }
});

// Display low stock products
router.get("/product/less-than-50", async (req, res) => {
    try {
        const products = await Product.find({ Quantity: { $lt: 50 } });
        res.render("products/low-stock-products", { products });
    } catch (error) {
        res.status(500).render("error", { error: error.message });
    }
});



// Delete expired products
router.post("/products/delete-expired", async (req, res) => {
    try {
        const todaydate = new Date();
        const result = await Product.deleteMany({ ExpiryDate: { $lt: todaydate } });
        res.redirect("/product/expired");
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Search products by price range and name
router.get('/product/inrange', async (req, res) => {
    try {
        const { min, max, name } = req.query;
        let filteredproduct = {};
        
        if (min || max) {
            filteredproduct.Price = {};
            if (min) filteredproduct.Price.$gte = Number(min);
            if (max) filteredproduct.Price.$lte = Number(max);
        }
        
        if (name) filteredproduct.ProductName = new RegExp(name, "i");
        const products = (min || max || name) 
            ? await Product.find(filteredproduct)
            : []; 
        
        res.render("products/search-products", { products, min, max, name });
    } catch (error) {
        res.status(500).render("error", { error: error.message });
    }
});
// Show update prices page
// Update product prices form - GET route
router.get('/product/update-price', async (req, res) => {
    try {
        
        res.render('products/update-prices', );
    } catch (error) {
        res.status(500).render("error", { error: error.message });
    }
});

// Update product prices - PUT route
router.put('/products/update-prices', async (req, res) => {
    try {
        const { ProductName, FirmName, NewPrice } = req.body;
        if (!NewPrice) return res.status(400).json({ error: "New price is required" });

        let query = {};
        if (ProductName) query.ProductName = new RegExp(ProductName, "i");
        if (FirmName) query.FirmName = new RegExp(FirmName, "i");

        const result = await Product.updateMany(query, { $set: { Price: parseFloat(NewPrice) } });

        res.json({
            message: `Successfully updated ${result.modifiedCount} products`,
            modifiedCount: result.modifiedCount
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
// Create new product
router.post("/products/create", async (req, res) => {
    try {
        const { ProductName, FirmName, Price, Quantity, ExpiryDate } = req.body;
        await Product.create({
            ProductName,
            FirmName,
            Price: parseFloat(Price),
            Quantity: parseInt(Quantity),
            ExpiryDate: new Date(ExpiryDate)
        });
        res.redirect("/products");
    } catch (error) {
        res.status(500).render("error", { error: error.message });
    }
});



// Update product
router.post("/products/update/:id", async (req, res) => {
    try {
        const { ProductName, FirmName, Price, Quantity, ExpiryDate } = req.body;
        await Product.findByIdAndUpdate(req.params.id, {
            ProductName,
            FirmName,
            Price: parseFloat(Price),
            Quantity: parseInt(Quantity),
            ExpiryDate: new Date(ExpiryDate)
        });
        res.redirect(`/products/${req.params.id}`);
    } catch (error) {
        res.status(500).render("error", { error: error.message });
    }
});

// Delete product
router.post("/products/delete/:id", async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.id);
        res.redirect("/products");
    } catch (error) {
        res.status(500).render("error", { error: error.message });
    }
});

module.exports=router;