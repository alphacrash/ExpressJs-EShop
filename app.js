var express = require("express"),
    bodyParser = require("body-parser"),
    flash = require("connect-flash"),
    mongoose = require("mongoose"),
    methodOverride = require("method-override"),
    passport = require("passport"),
    LocalStrategy = require("passport-local"),
    session = require("express-session")
cookieParser = require("cookie-parser")

var User = require("./models/user"),
    Product = require("./models/product"),
    Comment = require("./models/comment"),
    seedDB = require("./seed");

var indexRoutes = require("./routes/index"),
    productRoutes = require("./routes/products"),
    commentRoutes = require("./routes/comments");

var MongoStore = require("connect-mongo")(session)

var url = process.env.DATABASEURL || "mongodb://localhost/EShop"

mongoose.connect(url)

var app = express();

app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(flash());
// seedDB();

// PASSPORT CONFIGURATION
app.use(session({
    secret: "Winter is Coming",
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
    cookie: { maxAge: 180 * 60 * 1000 }
}));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function (req, res, next) {
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    res.locals.session = req.session;
    next();
})

app.use("/", indexRoutes);
app.use("/products", productRoutes);
app.use("/products/:id/comments/", commentRoutes);

// SERVER
// app.listen(process.env.PORT, process.env.IP, function () {
//     console.log("Server is running...");
// });

app.listen(3000, function () {
    console.log("Server is running...");
});