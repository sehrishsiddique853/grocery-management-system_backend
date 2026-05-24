const express = require("express");
const path=require("path");
require("./config/db");
const productRoutes = require("./routes/productRoute");
const { ratelimiting, loggingmiddleware } = require("./middlewares/middleware");
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static('public'));

app.use(loggingmiddleware);
app.use(ratelimiting);
app.use("/", productRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});