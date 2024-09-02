const express = require("express");
require("dotenv").config();
const route = require("./routes/client/index.route")
const app = express();
const port = process.env.PORT;

// pug configuration
app.set("views", "./views"); // reading views folder
app.set("view engine", "pug");

// Routes
route(app);

app.listen(port, () => { 
    console.log(`App listening on port ${port})`); 
});