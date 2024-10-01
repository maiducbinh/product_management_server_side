const express = require("express");
const bodyParser = require("body-parser")
var methodOverride = require('method-override')
const systemConfig = require("./config/system")
require("dotenv").config();
const routeAdmin = require("./routes/admin/index.route")
const route = require("./routes/client/index.route")
const app = express();
const database = require("./config/database")

app.use(methodOverride('_method'))

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

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

// App local variables
app.locals.prefixAdmin = systemConfig.prefixAdmin