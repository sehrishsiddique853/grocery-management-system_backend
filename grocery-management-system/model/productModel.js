const mongoose = require("mongoose");
const productSchema = mongoose.Schema({
    ProductName: {
        type: String,
        required: true
    },
    FirmName: {
        type: String,
        required: true
    },
    Price: {
        type: Number,
        required: true
    },
    Quantity: {
        type: Number,
        required: true
    },
    ExpiryDate: {
        type: Date,
        required: true
    }
});
const Product=mongoose.model("Product",productSchema);
module.exports=Product;