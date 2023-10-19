// require('dotenv').config();
const express = require("express");
const configViewEngine = require("./configs/viewEngine");
const initWebRoutes = require("./routes/web");
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');
const session = require("express-session");
const connectFlash = require("connect-flash");
const passport = require("passport");



let app = express();

//use cookie parser
app.use(cookieParser('secret'));

//config session
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 // 86400000 1 day
    }
}));

// Enable body parser post data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// Serve files from the "uploads" directory
app.use('/uploads', express.static('uploads'));

//Config view engine
configViewEngine(app);

//Enable flash message
app.use(connectFlash());



//Config passport middleware
app.use(passport.initialize());
app.use(passport.session());

// init all web routes
initWebRoutes(app);

let port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server is running on port http://localhost:${port}`));