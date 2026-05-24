const mongoose = require("mongoose");
require("dotenv").config();

mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on('connected', () => {
    console.log("Connected to MongoDB Atlas");
});

db.on('disconnected', () => {
    console.log("Disconnected from MongoDB Atlas");
});

db.on('error', (err) => {
    console.log("MongoDB Atlas connection error:", err);
});

module.exports = mongoose;