const express = require("express");
const path = require("path");
const bodyParser = require("body-parser")
const cookieParser = require("cookie-parser")
const session = require("express-session")
var methodOverride = require('method-override')
const systemConfig = require("./config/system")
const multer = require('multer');
const cloudinary = require("cloudinary").v2;
const streamifier = require("streamifier");
require("dotenv").config();
const routeAdmin = require("./routes/admin/index.route")
const route = require("./routes/client/index.route")
const flash = require('express-flash');
const moment = require('moment');
const app = express();
const database = require("./config/database")

app.use(methodOverride('_method'))

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// pug configuration
app.set("views", `${__dirname}/views`); // reading views folder
app.set("view engine", "pug");

app.use(express.static(`${__dirname}/public`)); // access 'public' folder

// database
database.connect()

// Flash
app.use(cookieParser("JHGJKLKLGFLJK"));
app.use(session({ cookie: { maxAge: 60000}}));
app.use(flash());
// End Flash

// TinyMCE
app.use('/tinymce', express.static(path.join(__dirname, 'node_modules', 'tinymce')));
// End TinyMCE

// Routes
routeAdmin(app);
route(app);

const port = process.env.PORT;
app.listen(port, () => { 
    console.log(`App listening on port ${port})`); 
});

// App local variables
app.locals.prefixAdmin = systemConfig.prefixAdmin
app.locals.moment = moment

// Parse incoming JSON requests
app.use(express.json());