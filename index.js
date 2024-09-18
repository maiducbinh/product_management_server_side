const express = require("express");
require("dotenv").config();
const routeAdmin = require("./routes/admin/index.route")
const route = require("./routes/client/index.route")
const app = express();
const database = require("./config/database")

// pug configuration
app.set("views", "./views"); // reading views folder
app.set("view engine", "pug");

app.use(express.static("public")); // access 'public' folder

// database
database.connect()

// Routes
routeAdmin(app);
route(app);

const port = process.env.PORT;
app.listen(port, () => { 
    console.log(`App listening on port ${port})`); 
});